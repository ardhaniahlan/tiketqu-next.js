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
  category?: string;
  organizer?: string;
  time?: string;
  locationMapUrl?: string;
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
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter shadow-[4px_4px_0_0_#000] bg-white border-4 border-black px-4 py-2 inline-block">
            {isEditMode ? "Edit Event" : "Buat Event Baru"}
          </h1>
        </div>

        <form action={handleClientAction} className="bg-white border-4 border-black p-5 md:p-8 shadow-[6px_6px_0_0_#000] flex flex-col gap-5">
          
          {/* BARIS 1: NAMA EVENT & KATEGORI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-bold uppercase text-xs">Nama Event</label>
              <input 
                type="text" 
                name="name"
                defaultValue={initialData?.title || ""}
                placeholder="Contoh: StandUp Fest 2026 / Lari 5K Jakarta"
                className="border-2 border-black p-2 text-sm font-medium outline-none focus:bg-yellow-100 transition-colors shadow-[2px_2px_0_0_#000]" 
                required 
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold uppercase text-xs">Kategori Event</label>
              <select 
                name="category"
                defaultValue={initialData?.category || "Konser & Musik"}
                className="border-2 border-black p-2 text-sm font-medium outline-none focus:bg-yellow-100 transition-colors shadow-[2px_2px_0_0_#000] bg-white" 
              >
                <option value="Konser & Musik">Konser & Musik</option>
                <option value="Seminar & Edukasi">Seminar & Edukasi</option>
                <option value="Olahraga & Lari">Olahraga & Lari</option>
                <option value="Stand-Up Comedy">Stand-Up Comedy</option>
                <option value="Pameran & Seni">Pameran & Seni</option>
                <option value="Workshop">Workshop</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          {/* BARIS 2: PENYELENGGARA & GAMBAR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-bold uppercase text-xs">Penyelenggara / Promotor</label>
              <input 
                type="text" 
                name="organizer"
                defaultValue={initialData?.organizer || ""}
                placeholder="Contoh: BEM Kampus / Maju Mundur Runner"
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
          </div>

          {/* BARIS 3: TANGGAL & WAKTU */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-bold uppercase text-xs">Tanggal Event</label>
              <input type="date" name="date" defaultValue={formattedDate} className="border-2 border-black p-2 text-sm font-medium outline-none focus:bg-yellow-100 transition-colors shadow-[2px_2px_0_0_#000]" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold uppercase text-xs">Jam Pelaksanaan</label>
              <input 
                type="text" 
                name="time" 
                defaultValue={initialData?.time || ""}
                placeholder="Contoh: 15.00 - Selesai / Open Gate 06.00 WIB" 
                className="border-2 border-black p-2 text-sm font-medium outline-none focus:bg-yellow-100 transition-colors shadow-[2px_2px_0_0_#000]" 
                required 
              />
            </div>
          </div>

          {/* BARIS 4: LOKASI & GOOGLE MAPS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-bold uppercase text-xs">Nama Lokasi / Gedung</label>
              <input 
                type="text" 
                name="location" 
                defaultValue={initialData?.location || ""} 
                placeholder="Contoh: Stadion Utama GBK"
                className="border-2 border-black p-2 text-sm font-medium outline-none focus:bg-yellow-100 transition-colors shadow-[2px_2px_0_0_#000]" 
                required 
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold uppercase text-xs">Link Google Maps (Opsional)</label>
              <input 
                type="url" 
                name="locationMapUrl" 
                defaultValue={initialData?.locationMapUrl || ""} 
                placeholder="Contoh: https://maps.app.goo.gl/..."
                className="border-2 border-black p-2 text-sm font-medium outline-none focus:bg-yellow-100 transition-colors shadow-[2px_2px_0_0_#000]" 
              />
            </div>
          </div>

          {/* BARIS 5: HARGA & KUOTA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-bold uppercase text-xs">Harga Tiket (Rp)</label>
              <input type="number" name="price" defaultValue={initialData?.price || ""} className="border-2 border-black p-2 text-sm font-medium outline-none focus:bg-yellow-100 transition-colors shadow-[2px_2px_0_0_#000]" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold uppercase text-xs">Kuota Maksimal / Kapasitas</label>
              <input type="number" name="quota" defaultValue={initialData?.quota || ""} className="border-2 border-black p-2 text-sm font-medium outline-none focus:bg-yellow-100 transition-colors shadow-[2px_2px_0_0_#000]" required />
            </div>
          </div>

          {/* BARIS 6: DESKRIPSI EVENT */}
          <div className="flex flex-col gap-1">
            <label className="font-bold uppercase text-xs">Deskripsi Lengkap Event</label>
            <textarea 
              name="description" 
              rows={4} 
              defaultValue={initialData?.description || ""} 
              placeholder="Ceritakan tentang acara ini, siapa bintang tamunya, aturan nonton, syarat usia, dll..."
              className="border-2 border-black p-3 text-sm font-medium outline-none focus:bg-yellow-100 transition-colors shadow-[2px_2px_0_0_#000]" 
              required
            />
          </div>

          <Button type="submit" className="w-full py-4 mt-4 text-lg font-black tracking-tight">
            {isEditMode ? "💾 UPDATE EVENT SEKARANG" : "💾 SIMPAN & PUBLIKASIKAN EVENT"}
          </Button>
        </form>
      </div>
    </div>
  );
}