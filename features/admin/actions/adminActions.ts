"use server";

import { events } from "@/db/schema";
import { createEventSchema } from "../schema/adminSchema";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { eq } from "drizzle-orm";

type ActionResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function createEventAction(formData: FormData): Promise<ActionResult> {
  const rawData = {
    name: formData.get("name") as string,
    date: formData.get("date") as string,
    location: formData.get("location") as string,
    price: Number(formData.get("price")),
    quota: Number(formData.get("quota")),
    description: formData.get("description") as string,
  };

  const validatedData = createEventSchema.safeParse(rawData);

  if (!validatedData.success) {
    console.log("Validasi Gagal:", validatedData.error.flatten().fieldErrors);
    return { success: false, error: "Data form tidak valid. Silakan cek kembali." };
  }

  try {
    await db.insert(events).values({
      title: validatedData.data.name,
      date: new Date(validatedData.data.date),
      location: validatedData.data.location,
      price: validatedData.data.price,
      quota: validatedData.data.quota,
      quotaRemaining: validatedData.data.quota,
      description: validatedData.data.description || "",
      imageUrl: validatedData.data.imageUrl || ""
    });

    revalidatePath("/admin/dashboard");
    return { success: true, message: "Event berhasil dibuat! 🎉" };
  } catch (error) {
    return { success: false, error: "Terjadi kesalahan saat menyimpan event." };
  }
}

export async function deleteEventAction(id: string): Promise<ActionResult> {
  try {
    await db.delete(events).where(eq(events.id, id));

    revalidatePath("/admin/dashboard");

    return { success: true, message: "Event berhasil dihapus! 🗑️" };
  } catch (error) {
    return { success: false, error: "Terjadi kesalahan saat menghapus event." };
  }
}

export async function updateEventAction(id: string, formData: FormData): Promise<ActionResult> {
  try {
    const rawData = {
      name: formData.get("name") as string,
      date: formData.get("date") as string,
      location: formData.get("location") as string,
      price: Number(formData.get("price")),
      quota: Number(formData.get("quota")),
      description: formData.get("description") as string,
      imageUrl: formData.get("imageUrl") as string,
    };

    const validatedData = createEventSchema.safeParse(rawData);

    if (!validatedData.success) {
      console.log("Validasi Edit Gagal:", validatedData.error.flatten().fieldErrors);
      return { success: false, error: "Data form tidak valid. Silakan cek kembali." };
    }

    const oldEventData = await db.select().from(events).where(eq(events.id, id)).limit(1);
    
    if (oldEventData.length === 0) {
      return { success: false, error: "Event tidak ditemukan." };
    }

    const oldEvent = oldEventData[0];
    const tiketTerjual = oldEvent.quota - oldEvent.quotaRemaining;
    const kuotaBaru = validatedData.data.quota;

    if (kuotaBaru < tiketTerjual) {
      return { success: false, error: `Kuota tidak boleh kurang dari tiket yang sudah terjual (${tiketTerjual} tiket).` };
    }

    await db.update(events).set({
      title: validatedData.data.name,
      date: new Date(validatedData.data.date),
      location: validatedData.data.location,
      price: validatedData.data.price,
      quota: kuotaBaru,
      quotaRemaining: kuotaBaru - tiketTerjual, 
      description: validatedData.data.description || "",
      imageUrl: validatedData.data.imageUrl || ""
    }).where(eq(events.id, id));

    revalidatePath("/admin/dashboard");
    return { success: true, message: "Berhasil! Event telah di-update. 🚀" };
    
  } catch (error) {
    console.error("Error Update:", error);
    return { success: false, error: "Terjadi kesalahan di server saat update." };
  }
}