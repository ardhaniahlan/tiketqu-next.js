import { LogoutButton } from "@/features/auth/components/LogoutButton";
import { Button } from "@/features/global/components/Button";
import { db } from "@/db";
import { events } from "@/db/schema";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { and, asc, count, desc, gte, ilike } from "drizzle-orm";
import Link from "next/link";
import { Suspense } from "react";
import { EventCard } from "@/features/explore/components/EventCard";
import { SearchFilter } from "@/features/explore/components/SearchFilter";

const PAGE_SIZE = 9;

interface ExplorePageProps {
  searchParams: Promise<{
    query?: string;
    date?: string;
    sort?: "asc" | "desc";
    page?: string;
  }>;
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const session = await getServerSession(authOptions);
  const { query, date, sort = "desc", page: pageParam } = await searchParams;

  const page = Math.max(1, Number(pageParam) || 1);
  const itemsToShow = page * PAGE_SIZE;

  const conditions = [];
  if (query) {
    conditions.push(ilike(events.title, `%${query}%`));
  }
  if (date) {
    conditions.push(gte(events.date, new Date(date)));
  }
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [eventList, totalResult] = await Promise.all([
    db
      .select()
      .from(events)
      .where(whereClause)
      .orderBy(sort === "asc" ? asc(events.date) : desc(events.date))
      .limit(itemsToShow),
    db.select({ total: count() }).from(events).where(whereClause),
  ]);

  const totalCount = totalResult[0]?.total ?? 0;
  const hasMore = itemsToShow < totalCount;

  const nextPageParams = new URLSearchParams();
  if (query) nextPageParams.set("query", query);
  if (date) nextPageParams.set("date", date);
  if (sort) nextPageParams.set("sort", sort);
  nextPageParams.set("page", String(page + 1));

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

              <Link href="/history">
                <Button variant="secondary" className="px-4 py-2 text-sm bg-yellow-300 hover:bg-yellow-400 text-black">
                  🎫 TIKET SAYA
                </Button>
              </Link>
              <LogoutButton />
            </>
          ) : (
            <div className="flex gap-2">
              <Link href="/auth/login">
                <Button variant="secondary" className="px-6 py-2 text-sm bg-white">LOGIN</Button>
              </Link>
              <Link href="/auth/login">
                <Button className="px-6 py-2 text-sm bg-blue-700">REGISTER</Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 space-y-8">
        <Suspense fallback={null}>
          <SearchFilter />
        </Suspense>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {eventList.length === 0 ? (
            <div className="col-span-full text-center py-12 font-bold text-gray-500 border-4 border-black border-dashed bg-white">
              Belum ada event yang tersedia saat ini.
            </div>
          ) : (
            eventList.map((event) => <EventCard key={event.id} event={event} />)
          )}
        </div>

        {hasMore && (
          <div className="flex justify-center pt-8">
            <Link href={`/explore?${nextPageParams.toString()}`} scroll={false}>
              <Button variant="secondary" className="px-8 py-3 bg-white font-black text-sm uppercase">
                LOAD MORE EVENTS
              </Button>
            </Link>
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