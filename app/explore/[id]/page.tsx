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

  const embedMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(event.location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  
  const externalMapUrl = event.locationMapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;

  return (
    <div className="min-h-screen bg-[#f4f4f5] font-sans pb-20">
      
      <header className="p-4 md:p-6 bg-white border-b-4 border-black flex justify-between items-center sticky top-0 z-50">
        <Link href="/">
          <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase hover:text-blue-700 transition-colors">
            <span className="text-blue-700">🎫</span> TIKETKU
          </h1>
        </Link>
        <Link href="/explore">
          <Button variant="secondary" className="px-4 py-2 text-sm bg-white shadow-[2px_2px_0_0_#000]">← KEMBALI</Button>
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

            <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_0_#000] flex flex-col gap-5">
              
              <div className="flex flex-col gap-2 items-start">
                <span className="bg-black text-white text-xs font-black px-3 py-1 uppercase tracking-widest border-2 border-transparent">
                  {event.category || "Umum"}
                </span>

                <h1 className="text-3xl md:text-5xl font-black uppercase leading-none tracking-tighter">
                  {event.title}
                </h1>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="bg-yellow-300 border-2 border-black p-4 font-bold flex flex-col justify-center shadow-[4px_4px_0_0_#000]">
                  <span className="text-xs uppercase text-gray-700 mb-2">Waktu Pelaksanaan</span>
                  <span className="flex items-center gap-2">📅 {formatTanggal}</span>
                  <span className="flex items-center gap-2 mt-1">⏰ {event.time || "TBA"}</span>
                </div>

                <div className="bg-blue-300 border-2 border-black p-4 font-bold flex flex-col justify-center shadow-[4px_4px_0_0_#000]">
                  <span className="text-xs uppercase text-gray-700 mb-2">Penyelenggara</span>
                  <span className="flex items-center gap-2 uppercase">🏢 {event.organizer || "-"}</span>
                </div>
              </div>

              <hr className="border-2 border-black my-4" />
              
              <div>
                <h3 className="font-black text-xl mb-3 uppercase">Deskripsi & Detail</h3>
                <p className="font-medium text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {event.description || "Tidak ada deskripsi untuk event ini."}
                </p>
              </div>

              <hr className="border-2 border-black my-4" />

              <div>
                <h3 className="font-black text-xl mb-3 uppercase tracking-tighter">Location</h3>
                
                <div className="bg-[#f4f4f5] border-4 border-black p-4 shadow-[6px_6px_0_0_#000] flex flex-col gap-3">
                  
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <p className="font-black text-sm uppercase tracking-wider">{event.location}</p>
                    <a 
                      href={externalMapUrl}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block bg-white text-black text-xs px-3 py-1 border-2 border-black hover:bg-yellow-300 uppercase font-black transition-colors"
                    >
                      Buka di App ↗
                    </a>
                  </div>

                  <div className="w-full h-64 border-4 border-black overflow-hidden bg-gray-200">
                    <iframe
                      src={embedMapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="grayscale-30 contrast-125" 
                    ></iframe>
                  </div>

                </div>
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