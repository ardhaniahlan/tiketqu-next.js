import { LogoutButton } from "@/features/auth/components/LogoutButton";
import { Button } from "@/features/global/components/Button";
import { db } from "@/db";
import { events } from "@/db/schema";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { desc } from "drizzle-orm";
import Link from "next/link";

export default async function ExplorePage() {
  const session = await getServerSession(authOptions);

  const eventList = await db.select().from(events).orderBy(desc(events.createdAt));

  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-[#f4f4f5] font-sans flex flex-col">
      <header className="flex justify-between items-center p-4 md:p-6 bg-white border-b-4 border-black">
        <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase">
          <span className="text-blue-700">🎫</span> TIKETKU
        </h1>

        <div className="flex gap-3 md:gap-6 items-center">
          <Link href="/" className="font-bold uppercase text-sm border-b-4 border-red-600 pb-1 hidden md:block">
            Explore
          </Link>
          
          {session ? (
            <>
              {session.user?.role === "admin" && (
                <Link href="/admin/dashboard">
                  <Button type="button" variant="secondary" className="px-4 py-2 text-sm">⚙️ ADMIN</Button>
                </Link>
              )}
              <LogoutButton />
            </>
          ) : (
            <div className="flex gap-2">
              <Link href="/auth/login">
                <Button variant="secondary" className="px-6 py-2 text-sm bg-white">LOGIN</Button>
              </Link>
              <Link href="/auth/register">
                <Button className="px-6 py-2 text-sm bg-blue-700">REGISTER</Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 space-y-8">
        
        <div className="bg-[#fcd34d] border-4 border-black p-4 md:p-5 shadow-[6px_6px_0_0_#000] flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full flex flex-col gap-1">
            <label className="text-xs font-black uppercase">Cari Event</label>
            <input 
              type="text" 
              placeholder="Nama event atau artis..." 
              className="border-4 border-black p-3 font-medium outline-none focus:bg-yellow-50" 
            />
          </div>
          <div className="flex-1 w-full flex flex-col gap-1">
            <label className="text-xs font-black uppercase">Tanggal</label>
            <input 
              type="date" 
              className="border-4 border-black p-3 font-medium outline-none focus:bg-yellow-50" 
            />
          </div>
          <Button className="bg-blue-700 text-white px-8 py-3 w-full md:w-auto text-base">
            SEARCH
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {eventList.length === 0 ? (
            <div className="col-span-full text-center py-12 font-bold text-gray-500 border-4 border-black border-dashed bg-white">
              Belum ada event yang tersedia saat ini.
            </div>
          ) : (
            eventList.map((event) => {
              const persentaseLaku = (event.quota - event.quotaRemaining) / event.quota;
              let badge = null;
              if (persentaseLaku > 0.8 && event.quotaRemaining > 0) {
                badge = <div className="absolute top-2 right-2 bg-red-600 text-white font-black text-xs px-2 py-1 border-2 border-black z-10">ALMOST SOLD OUT</div>;
              } else if (event.quotaRemaining === 0) {
                badge = <div className="absolute top-2 right-2 bg-gray-800 text-white font-black text-xs px-2 py-1 border-2 border-black z-10">SOLD OUT</div>;
              }

              return (
                <div key={event.id} className="bg-white border-4 border-black flex flex-col shadow-[6px_6px_0_0_#000] relative group">
                  {badge}
                  
                  <div className="h-48 border-b-4 border-black bg-blue-100 overflow-hidden relative">
                    <img 
                      src={event.imageUrl || "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=800&h=400"} 
                      alt={event.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-4 flex flex-col flex-1 bg-white">
                    <h3 className="font-black text-lg md:text-xl uppercase mb-3 line-clamp-2 leading-tight">
                      {event.title}
                    </h3>
                    
                    <div className="flex flex-col gap-2 mb-6 text-sm font-semibold text-gray-600">
                      <span className="flex items-center gap-2">
                        📅 {event.date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                      <span className="flex items-center gap-2 line-clamp-1">
                        📍 {event.location}
                      </span>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4">
                      <span className="font-black text-blue-700 text-lg uppercase tracking-tighter">
                        {event.price === 0 ? "GRATIS" : formatRupiah(event.price)}
                      </span>
                      
                      <Link href={`/events/${event.id}`}>
                        <button className="bg-red-600 text-white text-xs font-black uppercase px-3 py-2 border-2 border-black shadow-[2px_2px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all">
                          LIHAT DETAIL
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {eventList.length > 0 && (
          <div className="flex justify-center pt-8">
            <Button variant="secondary" className="px-8 py-3 bg-white font-black text-sm uppercase">
              LOAD MORE EVENTS
            </Button>
          </div>
        )}
      </main>

      <footer className="border-t-4 border-black p-6 bg-white mt-12 flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="font-black text-xl tracking-tighter">TIKETKU</h2>
        <p className="font-bold text-xs text-gray-500">© 2024 TiketKu. All rights reserved.</p>
      </footer>
    </div>
  );
}