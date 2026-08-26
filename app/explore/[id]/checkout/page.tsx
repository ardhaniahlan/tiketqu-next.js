import { db } from "@/db";
import { events } from "@/db/schema";
import CheckoutForm from "@/features/checkout/components/CheckoutForm";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ eventId?: string; qty?: string }>;
}) {
  const params = await searchParams;
  const eventId = params.eventId;
  const qty = Number(params.qty) || 1;

  if (!eventId) {
    redirect("/");
  }

  const eventData = await db.select().from(events).where(eq(events.id, eventId)).limit(1);

  if (eventData.length === 0) {
    redirect("/");
  }

  const event = eventData[0];
  const totalPrice = event.price * qty;

  return (
    <div className="min-h-screen bg-[#f4f4f5] font-sans p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black uppercase tracking-tighter shadow-[4px_4px_0_0_#000] bg-white border-4 border-black px-4 py-2 inline-block mb-8">
          Checkout Pesanan 🛒
        </h1>

        <Link href={`/explore/${eventId}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 font-bold">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Detail Event
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          <CheckoutForm eventId={event.id} quantity={qty} totalPrice={totalPrice} />

          <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_0_#000] flex flex-col gap-4">
            <h2 className="font-black text-xl uppercase border-b-4 border-black pb-2">
              Ringkasan Tiket
            </h2>
            
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-gray-500 uppercase">Event</span>
              <h3 className="font-black text-lg">{event.title}</h3>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-gray-500 uppercase">Lokasi & Tanggal</span>
              <p className="font-medium text-sm">📍 {event.location}</p>
              <p className="font-medium text-sm">📅 {event.date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</p>
            </div>

            <hr className="border-2 border-black my-2" />

            <div className="flex justify-between items-center text-sm font-bold">
              <span>Jumlah Tiket:</span>
              <span>{qty} Pcs</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold">
              <span>Harga Satuan:</span>
              <span>Rp {event.price.toLocaleString("id-ID")}</span>
            </div>

            <div className="flex justify-between items-center bg-yellow-200 border-2 border-black p-3 font-black text-lg mt-2 shadow-[2px_2px_0_0_#000]">
              <span>TOTAL BAYAR:</span>
              <span className="text-blue-700">Rp {totalPrice.toLocaleString("id-ID")}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}