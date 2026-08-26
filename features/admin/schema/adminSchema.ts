import { z } from "zod";

export const createEventSchema = z.object({
  name: z.string().min(3, "Nama event minimal 3 karakter"),
  date: z.string().nonempty("Tanggal wajib diisi"),
  location: z.string().min(3, "Lokasi wajib diisi"),
  price: z.number().min(0, "Harga tidak boleh minus"), 
  quota: z.number().min(1, "Kuota minimal 1"),
  description: z.string().optional()
});
