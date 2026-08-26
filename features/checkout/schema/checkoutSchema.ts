import { z } from "zod";

export const checkoutSchema = z.object({
  name: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  phone: z.string().min(10, "Nomor WhatsApp minimal 10 digit").regex(/^[0-9]+$/, "Nomor WhatsApp hanya boleh berisi angka"),
  quantity: z.number().min(1, "Minimal pembelian 1 tiket"),
  eventId: z.string().min(1, "Event ID tidak valid"),
});