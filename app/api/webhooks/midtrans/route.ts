import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, events, transactions, ticketItems } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import nodemailer from "nodemailer";

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
    const { eventId, quantity, buyerName, buyerEmail } = currentOrder[0];

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

    const ticketsToInsert = Array.from({ length: quantity }).map(() => ({
      orderId: order_id,
      status: "active",
    }));

    await db.insert(ticketItems).values(ticketsToInsert);

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER, 
          pass: process.env.EMAIL_PASS, 
        },
      });

      await transporter.sendMail({
        from: '"TiketQu Admin" <${process.env.EMAIL_USER}>', 
        to: buyerEmail,
        subject: `[E-Ticket] Pembayaran Berhasil - ${buyerName}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 4px solid #000;">
            <h1 style="background: #2563eb; color: #fff; padding: 10px; text-align: center;">TIKETQU E-TICKET</h1>
            <h2>Halo ${buyerName}, Pembayaran Berhasil! 🎉</h2>
            <p>Terima kasih telah memesan <strong>${quantity} tiket</strong>.</p>
            <p>Anda dapat melihat dan mengunduh QR Code tiket Anda secara langsung melalui link berikut:</p>
            
            <a href="https://revivable-cardiac-destiny.ngrok-free.dev/history/${order_id}" 
               style="display: inline-block; background: #facc15; color: #000; padding: 12px 20px; font-weight: bold; text-decoration: none; border: 2px solid #000;">
               Buka E-Ticket Saya 🎟️
            </a>
          </div>
        `,
      });
      console.log("✅ Email sukses terkirim ke:", buyerEmail);
    } catch (emailError) {
      console.error("❌ Gagal mengirim email:", emailError);
    }
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
