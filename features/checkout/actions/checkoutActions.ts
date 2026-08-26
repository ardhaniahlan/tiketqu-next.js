"use server";

import { db } from "@/db";
import { orders, events } from "@/db/schema";
import { eq } from "drizzle-orm"; 
import { revalidatePath } from "next/cache";
import { checkoutSchema } from "../schema/checkoutSchema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Snap } from "midtrans-client";

let snap = new Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

export async function createOrderAction(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return { error: "Anda harus login terlebih dahulu untuk memesan tiket." };
    }

    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      quantity: Number(formData.get("quantity")),
      eventId: formData.get("eventId") as string,
    };

    const validatedData = checkoutSchema.safeParse(rawData);

    if (!validatedData.success) {
      const errorMessage = validatedData.error.issues[0].message;
      return { error: errorMessage };
    }

    const { name, email, phone, quantity, eventId } = validatedData.data;

    const eventData = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
    if (eventData.length === 0) {
      return { error: "Event tidak ditemukan." };
    }

    const event = eventData[0];
    if (event.quotaRemaining < quantity) {
      return { error: `Maaf, sisa tiket tidak mencukupi (tersisa ${event.quotaRemaining} tiket).` };
    }

    const totalPrice = event.price * quantity;

    const [newOrder] = await db.insert(orders).values({
      userId: session.user.id,
      eventId,
      buyerName: name,
      buyerEmail: email,
      buyerPhone: phone,
      quantity,
      totalPrice,
      status: "pending",
    }).returning({ id: orders.id });

    const parameter = {
      transaction_details: {
        order_id: newOrder.id,
        gross_amount: totalPrice,
      },
      customer_details: {
        first_name: name,
        email: email,
        phone: phone,
      },
    };

    const transaction = await snap.createTransaction(parameter);
    const snapToken = transaction.token;

    await db.update(orders)
      .set({ snapToken: snapToken })
      .where(eq(orders.id, newOrder.id));

    revalidatePath(`/explore/${eventId}`);

    return { success: true, snapToken: snapToken, message: "Menyiapkan pembayaran..." };

  } catch (error) {
    console.error("Checkout Error:", error);
    return { error: "Terjadi kesalahan pada server." };
  }
}