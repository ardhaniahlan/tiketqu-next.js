import { db } from "@/db";
import { events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/features/global/components/Button";
import { CheckoutCard } from "@/features/checkout/components/CheckoutCard";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const eventId = resolvedParams.id;

  const eventData = await db.select().from(events).where(eq(events.id, eventId)).limit(1);

  if (eventData.length === 0) {
    notFound();
  }

  const event = eventData[0];
  const sisaTiket = event.quotaRemaining;
  const isSoldOut = sisaTiket === 0;

  const formatTanggal = event.date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const isEventPassed = event.date && new Date() > new Date(event.date);

  return (
    <div className="min-h-screen bg-[#f4f4f5] font-sans pb-20">
      
      <header className="p-4 md:p-6 bg-white border-b-4 border-black flex justify-between items-center sticky top-0 z-50">
        <Link href="/">
          <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase hover:text-blue-700 transition-colors">
            <span className="text-blue-700">🎫</span> TIKETKU
          </h1>
        </Link>
        <Link href="/">
          <Button variant="secondary" className="px-4 py-2 text-sm bg-white">← KEMBALI</Button>
        </Link>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-8 mt-4 md:mt-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            
            <div className="border-4 border-black shadow-[6px_6px_0_0_#000] bg-white overflow-hidden aspect-video relative">
              {(isSoldOut || isEventPassed) && (
                <div className="absolute top-4 right-4 bg-black text-white font-black text-xl px-4 py-2 border-2 border-white z-10 rotate-12">
                  {isSoldOut ? "SOLD OUT" : "SELESAI"}
                </div>
              )}
              <img 
                src={event.imageUrl || "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=1200&h=600"} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_0_#000] flex flex-col gap-4">
              <h1 className="text-3xl md:text-5xl font-black uppercase leading-none tracking-tighter">
                {event.title}
              </h1>
              
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="bg-yellow-300 border-2 border-black px-4 py-2 font-bold flex items-center gap-2">
                  📅 {formatTanggal}
                </div>
                <div className="bg-blue-300 border-2 border-black px-4 py-2 font-bold flex items-center gap-2">
                  📍 {event.location}
                </div>
              </div>

              <hr className="border-2 border-black my-2" />
              
              <div>
                <h3 className="font-black text-xl mb-2 uppercase">Deskripsi Event</h3>
                <p className="font-medium text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {event.description || "Tidak ada deskripsi untuk event ini."}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/3 sticky top-28">
            
            <CheckoutCard 
              eventId={event.id}
              price={event.price}
              quotaRemaining={event.quotaRemaining}
              isSoldOut={isSoldOut}
              isEventPassed={isEventPassed}
            />

          </div>

        </div>
      </main>
    </div>
  );
}