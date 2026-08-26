import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { order_id, transaction_status } = body;

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
    }

    return NextResponse.json(
      { status: "success", message: "Webhook received" },
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
