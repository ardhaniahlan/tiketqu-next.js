import Link from "next/link";
import { events } from "@/db/schema";

type EventData = typeof events.$inferSelect;

interface EventCardProps {
  event: EventData;
}

function formatRupiah(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function EventCard({ event }: EventCardProps) {
  const persentaseLaku = (event.quota - event.quotaRemaining) / event.quota;

  let badge = null;
  if (persentaseLaku > 0.8 && event.quotaRemaining > 0) {
    badge = (
      <div className="absolute top-2 right-2 bg-red-600 text-white font-black text-xs px-2 py-1 border-2 border-black z-10">
        ALMOST SOLD OUT
      </div>
    );
  } else if (event.quotaRemaining === 0) {
    badge = (
      <div className="absolute top-2 right-2 bg-gray-800 text-white font-black text-xs px-2 py-1 border-2 border-black z-10">
        SOLD OUT
      </div>
    );
  }

  return (
    <div className="bg-white border-4 border-black flex flex-col shadow-[6px_6px_0_0_#000] relative group">
      {badge}

      <div className="h-48 border-b-4 border-black bg-blue-100 overflow-hidden relative">
        <img
          src={
            event.imageUrl ||
            "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=800&h=400"
          }
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
            📅{" "}
            {event.date.toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-2 line-clamp-1">
            📍 {event.location}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="font-black text-blue-700 text-lg uppercase tracking-tighter">
            {event.price === 0 ? "GRATIS" : formatRupiah(event.price)}
          </span>

          <Link href={`/explore/${event.id}`}>
            <button className="bg-red-600 text-white text-xs font-black uppercase px-3 py-2 border-2 border-black shadow-[2px_2px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all">
              LIHAT DETAIL
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}