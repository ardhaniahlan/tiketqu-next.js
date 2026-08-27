import { db } from "@/db";
import { orders, events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/features/global/components/Button";
import QRCode from "react-qr-code";

export const dynamic = "force-dynamic";

interface TicketPageProps {
  params: Promise<{ id: string }>; 
}

export default async function TicketPage({ params }: TicketPageProps) {
  const { id } = await params;

  const ticketData = await db
    .select({
      orderId: orders.id,
      buyerName: orders.buyerName,
      quantity: orders.quantity,
      status: orders.status,
      eventTitle: events.title,
      eventDate: events.date,
      eventLocation: events.location,
    })
    .from(orders)
    .leftJoin(events, eq(orders.eventId, events.id))
    .where(eq(orders.id, id)) 
    .limit(1);
  const ticket = ticketData[0];

  const isEventPassed = ticket.eventDate && new Date() > new Date(ticket.eventDate);

  if (!ticket || ticket.status !== "paid") {
    redirect("/history");
  }

  return (
    <div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center p-4">
      <div className="max-w-md w-full flex flex-col gap-6">
        
        <div className="bg-white border-4 border-black shadow-[8px_8px_0_0_#000] overflow-hidden">
          <div className="bg-blue-600 text-white p-6 border-b-4 border-black text-center font-black">
            <h1 className="text-2xl uppercase tracking-widest">E-TICKET</h1>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Nama Event</p>
              <h2 className="text-xl font-black">{ticket.eventTitle}</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-y-4 border-black border-dashed py-4">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Tanggal</p>
                <p className="font-bold">
                  {ticket.eventDate ? new Date(ticket.eventDate).toLocaleDateString("id-ID") : "-"}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Lokasi</p>
                <p className="font-bold">{ticket.eventLocation}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Nama Pemesan</p>
              <p className="font-bold text-lg">{ticket.buyerName}</p>
              <p className="font-bold text-sm bg-yellow-300 inline-block px-2 mt-1 border-2 border-black">
                {ticket.quantity} TIKET
              </p>
            </div>
          </div>

          <div className={`bg-white border-4 border-black shadow-[8px_8px_0_0_#000] overflow-hidden relative ${isEventPassed ? 'opacity-80 grayscale-50' : ''}`}>
          
          {isEventPassed && (
            <div className="absolute top-1/2 left-0 w-full bg-red-600 text-white font-black text-3xl py-4 text-center -rotate-12 uppercase border-y-4 border-black z-10 shadow-xl">
              EVENT TELAH SELESAI
            </div>
          )}

          <div className={`${isEventPassed ? 'bg-gray-600' : 'bg-blue-600'} text-white p-6 border-b-4 border-black text-center font-black`}>
            <h1 className="text-2xl uppercase tracking-widest">
              {isEventPassed ? 'HISTORY TICKET' : 'E-TICKET'}
            </h1>
          </div>

          <div className="bg-gray-100 p-6 flex flex-col items-center justify-center border-t-4 border-black">
            <div className={`bg-white p-4 border-4 border-black ${isEventPassed ? 'blur-sm' : ''}`}>
              <QRCode value={ticket.orderId} size={150} />
            </div>
            
            {!isEventPassed ? (
              <>
                <p className="text-xs font-bold mt-3 text-center text-gray-500">ID: {ticket.orderId}</p>
                <p className="text-xs font-bold mt-1 text-center text-red-600">
                  Jangan bagikan QR Code ini kepada siapapun!
                </p>
              </>
            ) : (
              <p className="text-sm font-black mt-4 text-center text-gray-600">
                Terima kasih telah hadir! 🎉
              </p>
            )}
          </div>
        </div>
        </div>

        <Link href="/history">
          <Button className="w-full py-4 text-sm bg-white text-black hover:bg-gray-200 border-2 border-black">
            KEMBALI KE RIWAYAT
          </Button>
        </Link>
      </div>
    </div>
  );
}