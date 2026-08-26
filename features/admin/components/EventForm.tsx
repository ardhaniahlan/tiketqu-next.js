"use client"

import { createEventAction, updateEventAction } from "@/features/admin/actions/adminActions";
import { Button } from "@/features/global/components/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type EventItem = {
  id: string;
  title: string;
  date: Date;
  location: string;
  price: number;
  quota: number;
  description: string;
  imageUrl?: string;
};

export const EventForm = ({ initialData }: { initialData?: EventItem }) => {
  const router = useRouter();
  
  const isEditMode = !!initialData;

  const formattedDate = initialData?.date 
    ? new Date(initialData.date).toISOString().split("T")[0] 
    : "";

  async function handleClientAction(formData: FormData) {
    const toastMessage = isEditMode ? "Menyimpan perubahan..." : "Menyimpan event...";
    const toastId = toast.loading(toastMessage);

    try {
      let result;
      
      if (isEditMode && initialData) {
        result = await updateEventAction(initialData.id, formData);
      } else {
        result = await createEventAction(formData);
      }

      if (result?.success) {
        toast.success(result.message, { id: toastId });
        router.push("/admin/dashboard");
      } else {
        toast.error(result?.error, { id: toastId });
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem", { id: toastId });
    }
  }

  return (
    <div className="bg-[#f4f4f5] p-4 md:p-6 font-sans min-h-screen">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/dashboard">
            <Button type="button" variant="secondary" className="px-3 py-1 text-sm">← Batal</Button>
          </Link>
          <h1 className="text-2xl font-black uppercase tracking-tighter shadow-[4px_4px_0_0_#000] bg-white border-4 border-black px-4 py-2 inline-block">
            {isEditMode ? "Edit Event" : "Buat Event Baru"}
          </h1>
        </div>

        <form action={handleClientAction} className="bg-white border-4 border-black p-5 shadow-[6px_6px_0_0_#000] flex flex-col gap-3">
          
          <div className="flex flex-col gap-1">
            <label className="font-bold uppercase text-xs">Nama Event</label>
            <input 
              type="text" 
              name="name"
              defaultValue={initialData?.title || ""}
              className="border-2 border-black p-2 text-sm font-medium outline-none focus:bg-yellow-100 transition-colors shadow-[2px_2px_0_0_#000]" 
              required 
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="font-bold uppercase text-xs">URL Poster Event</label>
            <input 
              type="text" 
              name="imageUrl"
              defaultValue={initialData?.imageUrl || ""}
              className="border-2 border-black p-2 text-sm font-medium outline-none focus:bg-yellow-100 transition-colors shadow-[2px_2px_0_0_#000]" 
              placeholder="Contoh: https://imgur.com/gambar.jpg" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-bold uppercase text-xs">Tanggal Event</label>
              <input type="date" name="date" defaultValue={formattedDate} className="border-2 border-black p-2 text-sm font-medium outline-none focus:bg-yellow-100 transition-colors shadow-[2px_2px_0_0_#000]" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold uppercase text-xs">Lokasi</label>
              <input type="text" name="location" defaultValue={initialData?.location || ""} className="border-2 border-black p-2 text-sm font-medium outline-none focus:bg-yellow-100 transition-colors shadow-[2px_2px_0_0_#000]" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-bold uppercase text-xs">Harga Tiket (Rp)</label>
              <input type="number" name="price" defaultValue={initialData?.price || ""} className="border-2 border-black p-2 text-sm font-medium outline-none focus:bg-yellow-100 transition-colors shadow-[2px_2px_0_0_#000]" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold uppercase text-xs">Kuota Tiket</label>
              <input type="number" name="quota" defaultValue={initialData?.quota || ""} className="border-2 border-black p-2 text-sm font-medium outline-none focus:bg-yellow-100 transition-colors shadow-[2px_2px_0_0_#000]" required />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold uppercase text-xs">Deskripsi (Opsional)</label>
            <textarea name="description" rows={2} defaultValue={initialData?.description || ""} className="border-2 border-black p-2 text-sm font-medium outline-none focus:bg-yellow-100 transition-colors shadow-[2px_2px_0_0_#000]" />
          </div>

          <Button type="submit" className="w-full py-3 mt-2 text-base">
            {isEditMode ? "💾 Update Event" : "💾 Simpan Event"}
          </Button>
        </form>
      </div>
    </div>
  );
}