"use client";

import { Button } from "@/features/global/components/Button";
import { useState } from "react";
import toast from "react-hot-toast";

interface CheckoutFormProps {
  eventId: string;
  quantity: number;
  totalPrice: number;
}

export default function CheckoutForm({ eventId, quantity, totalPrice }: CheckoutFormProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Memproses pesanan...");

    const formData = new FormData(e.currentTarget);
    const buyerName = formData.get("name") as string;
    const buyerEmail = formData.get("email") as string;
    const buyerPhone = formData.get("phone") as string;
    
    try {
      console.log({ eventId, quantity, totalPrice, buyerName, buyerEmail, buyerPhone });
      
      setTimeout(() => {
        toast.success("Pesanan dibuat! Menyiapkan pembayaran...", { id: toastId });
        setLoading(false);
      }, 1500);

    } catch (error) {
      toast.error("Gagal memproses pesanan", { id: toastId });
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_0_#000] flex flex-col gap-4">
      <h2 className="font-black text-xl uppercase border-b-4 border-black pb-2">
        Data Pemesan
      </h2>

      <div className="flex flex-col gap-1">
        <label className="font-bold uppercase text-xs">Nama Lengkap</label>
        <input 
          type="text" 
          name="name" 
          required 
          placeholder="Contoh: Budi Santoso"
          className="border-2 border-black p-2 text-sm font-medium outline-none focus:bg-yellow-100 shadow-[2px_2px_0_0_#000]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-bold uppercase text-xs">Email (Untuk E-Ticket)</label>
        <input 
          type="email" 
          name="email" 
          required 
          placeholder="budi@example.com"
          className="border-2 border-black p-2 text-sm font-medium outline-none focus:bg-yellow-100 shadow-[2px_2px_0_0_#000]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-bold uppercase text-xs">Nomor WhatsApp</label>
        <input 
          type="tel" 
          name="phone" 
          required 
          placeholder="081234567890"
          className="border-2 border-black p-2 text-sm font-medium outline-none focus:bg-yellow-100 shadow-[2px_2px_0_0_#000]"
        />
      </div>

      <Button 
        type="submit" 
        disabled={loading}
        className="w-full py-3 mt-4 text-base bg-blue-600 hover:bg-blue-700 text-white"
      >
        {loading ? "MEMPROSES..." : "LANJUT KE PEMBAYARAN 💳"}
      </Button>
    </form>
  );
}