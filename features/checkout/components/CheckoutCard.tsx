"use client";

import { useState } from "react";
import { Button } from "@/features/global/components/Button";
import { useRouter } from "next/navigation"; 

interface CheckoutCardProps {
  eventId: string;
  price: number;
  quotaRemaining: number;
}

export function CheckoutCard({ eventId, price, quotaRemaining }: CheckoutCardProps) {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter(); 
  
  const isSoldOut = quotaRemaining === 0;
  const maxQty = Math.min(4, quotaRemaining);

  const increaseQty = () => {
    if (quantity < maxQty) setQuantity(quantity + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const formatRupiah = (angka: number) => {
    if (angka === 0) return "GRATIS";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(angka);
  };

  const handleCheckout = () => {
    router.push(`/explore/${eventId}/checkout?eventId=${eventId}&qty=${quantity}`);
  };

  return (
    <div className="bg-[#fcd34d] border-4 border-black p-6 shadow-[8px_8px_0_0_#000] flex flex-col gap-6">
      
      
      <h2 className="font-black text-2xl uppercase border-b-4 border-black pb-4">
        Beli Tiket
      </h2>
      
      <div className="flex justify-between items-center">
        <span className="font-bold text-gray-800">Harga Satuan</span>
        <span className="font-black text-xl text-blue-700">
          {formatRupiah(price)}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span className="font-bold text-gray-800">Status</span>
        {isSoldOut ? (
          <span className="font-black text-red-600 bg-white border-2 border-black px-2 py-1 text-sm">HABIS</span>
        ) : (
          <span className="font-black text-green-700 bg-white border-2 border-black px-2 py-1 text-sm">SISA {quotaRemaining}</span>
        )}
      </div>

      {!isSoldOut && (
        <div className="flex justify-between items-center border-t-4 border-black pt-4 mt-2">
          <span className="font-bold text-gray-800">Jumlah Tiket</span>
          <div className="flex items-center gap-4 bg-white border-2 border-black p-1 shadow-[2px_2px_0_0_#000]">
            <button 
              onClick={decreaseQty} 
              disabled={quantity <= 1}
              className="w-8 h-8 flex items-center justify-center font-black text-xl bg-gray-200 border-2 border-black disabled:opacity-50 active:translate-y-px"
            >
              -
            </button>
            <span className="font-black text-xl w-6 text-center">{quantity}</span>
            <button 
              onClick={increaseQty} 
              disabled={quantity >= maxQty}
              className="w-8 h-8 flex items-center justify-center font-black text-xl bg-blue-400 border-2 border-black disabled:opacity-50 active:translate-y-px"
            >
              +
            </button>
          </div>
        </div>
      )}

      {!isSoldOut && (
        <div className="flex justify-between items-center bg-white border-4 border-black p-3 shadow-[4px_4px_0_0_#000] mt-2">
          <span className="font-black uppercase">Total:</span>
          <span className="font-black text-2xl text-blue-700">
            {formatRupiah(price * quantity)}
          </span>
        </div>
      )}

      <Button 
        onClick={handleCheckout}
        disabled={isSoldOut}
        className={`w-full py-4 text-xl mt-2 ${isSoldOut ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
      >
        {isSoldOut ? "TIKET HABIS" : "BELI SEKARANG 🎟️"}
      </Button>

      {!isSoldOut && (
        <p className="text-center text-xs font-bold text-gray-700 -mt-2.5">
          *Maksimal pembelian 4 tiket per akun.
        </p>
      )}
    </div>
  );
}