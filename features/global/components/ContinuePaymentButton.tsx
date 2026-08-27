"use client";

import { Button } from "@/features/global/components/Button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

declare global {
  interface Window {
    snap: any;
  }
}

interface ContinuePaymentButtonProps {
  snapToken: string | null;
  orderId: string;
}

export default function ContinuePaymentButton({
  snapToken,
  orderId,
}: ContinuePaymentButtonProps) {
  const router = useRouter();

  useEffect(() => {
    const snapScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

    if (!document.querySelector(`script[src="${snapScriptUrl}"]`)) {
      const script = document.createElement("script");
      script.src = snapScriptUrl;
      script.setAttribute("data-client-key", clientKey);
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handlePay = () => {
    if (!snapToken) {
      toast.error("Gagal memuat token pembayaran.");
      return;
    }

    window.snap.pay(snapToken, {
      onSuccess: function (result: any) {
        toast.success("Pembayaran berhasil!");
        router.push(`/order/success?order_id=${orderId}`);
      },
      onPending: function (result: any) {
        toast("Menunggu pembayaran...", { icon: "⏳" });
        router.push(`/order/pending?order_id=${orderId}`);
      },
      onError: function (result: any) {
        toast.error("Pembayaran gagal!");
        router.push(`/order/error`);
      },
      onClose: function () {
        toast("Pembayaran ditutup.", { icon: "❌" });
      },
    });
  };

  return (
    <Button
      onClick={handlePay}
      className="w-full md:w-auto text-xs bg-yellow-400 hover:bg-yellow-500 text-black border-2 border-black"
    >
      💳 LANJUTKAN BAYAR
    </Button>
  );
}