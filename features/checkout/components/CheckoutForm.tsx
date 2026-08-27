"use client";

import { Button } from "@/features/global/components/Button";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createOrderAction } from "../actions/checkoutActions";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    snap: any;
  }
}

interface CheckoutFormProps {
  eventId: string;
  quantity: number;
  totalPrice: number;
  userName?: string | null;
  userEmail?: string | null;
}

export default function CheckoutForm({
  eventId,
  quantity,
  totalPrice,
  userName,
  userEmail,
}: CheckoutFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const snapScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

    const script = document.createElement("script");
    script.src = snapScriptUrl;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading(
      "Memproses pesanan & menghubungkan ke Midtrans...",
    );

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    formData.append("eventId", eventId);
    formData.append("quantity", String(quantity));
    formData.append("totalPrice", String(totalPrice));

    try {
      const result = await createOrderAction(formData);

      if (result?.error) {
        toast.error(result.error, { id: toastId });
        setLoading(false);
      } else if (result?.success && result?.snapToken) {
        toast.success(result.message, { id: toastId });
        setLoading(false);

        window.snap.pay(result.snapToken, {
          onSuccess: function (result: any) {
            toast.success("Pembayaran berhasil!");
            router.push(`/order/success?order_id=${result.order_id}`);
          },
          onPending: function (result: any) {
            toast("Menunggu pembayaran selesai...", { icon: "⏳" });
            router.push(`/order/pending?order_id=${result.order_id}`);
          },
          onError: function (result: any) {
            toast.error("Pembayaran gagal!");
            router.push(`/order/error`);
          },
          onClose: function () {
            toast("Pembayaran dibatalkan.", { icon: "❌" });
            setLoading(false);
          },
        });
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem", { id: toastId });
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_0_#000] flex flex-col gap-4"
    >
      <h2 className="font-black text-xl uppercase border-b-4 border-black pb-2">
        Data Pemesan
      </h2>

      <div className="flex flex-col gap-1">
        <label className="font-bold uppercase text-xs">Nama Lengkap</label>
        <input
          type="text"
          name="name"
          required
          defaultValue={userName || ""} 
          placeholder="Contoh: Budi Santoso"
          className="border-2 border-black p-2 text-sm font-medium outline-none focus:bg-yellow-100 shadow-[2px_2px_0_0_#000]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-bold uppercase text-xs">
          Email (Untuk E-Ticket)
        </label>
        <input
          type="email"
          name="email"
          required
          defaultValue={userEmail || ""} 
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
          autoFocus 
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