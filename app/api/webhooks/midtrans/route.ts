import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, events, transactions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      order_id,
      transaction_status,
      transaction_id,
      payment_type,
      gross_amount,
    } = body;

    let finalStatus: "pending" | "paid" | "failed" | "expired" = "pending";

    if (
      transaction_status === "capture" ||
      transaction_status === "settlement"
    ) {
      finalStatus = "paid";
    } else if (transaction_status === "expire") {
      finalStatus = "expired";
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "deny"
    ) {
      finalStatus = "failed";
    }

    if (order_id) {
      await db
        .update(orders)
        .set({ status: finalStatus })
        .where(eq(orders.id, order_id));

      if (finalStatus === "paid") {
        const currentOrder = await db
          .select()
          .from(orders)
          .where(eq(orders.id, order_id))
          .limit(1);

        if (currentOrder.length > 0) {
          const { eventId, quantity } = currentOrder[0];

          await db
            .update(events)
            .set({
              quotaRemaining: sql`${events.quotaRemaining} - ${quantity}`,
            })
            .where(eq(events.id, eventId));

          await db.insert(transactions).values({
            orderId: order_id,
            midtransTransactionId: transaction_id,
            paymentType: payment_type,
            grossAmount: Math.round(Number(gross_amount)),
            status: finalStatus,
          });
        }
      }
    }

    return NextResponse.json(
      { status: "success", message: "Webhook received & processed" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 },
    );
  }
}
