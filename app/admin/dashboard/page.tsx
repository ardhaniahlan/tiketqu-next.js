import { StatCard } from "@/features/admin/components/StatCard";
import { ActiveEventsTable } from "@/features/admin/components/ActiveEventTable";
import { Button } from "@/features/global/components/Button";
import Link from "next/link";
import { db } from "@/db";
import { events } from "@/db/schema";
import { desc } from "drizzle-orm";

export default async function AdminDashboardPage() {
  const eventData = await db.select().from(events).orderBy(desc(events.createdAt));

  const totalEvents = eventData.length;
  
  let ticketsSold = 0;
  let totalRevenue = 0;

  eventData.forEach((event) => {
    const terjual = event.quota - event.quotaRemaining;
    ticketsSold += terjual;
    totalRevenue += (terjual * event.price); 
  });

  const formattedTicketsSold = new Intl.NumberFormat("id-ID").format(ticketsSold);
  const formattedRevenue = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(totalRevenue);

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-6xl mx-auto">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Total Events" 
          value={String(totalEvents)} 
        />
        <StatCard 
          title="Tickets Sold" 
          value={formattedTicketsSold} 
        />
        <StatCard 
          title="Total Revenue" 
          value={formattedRevenue} 
          variant="blue" 
        />
      </div>

      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-black tracking-tight">Active Events</h2>
          <Link href="/admin/dashboard/create">
            <Button className="text-sm px-3 py-1.5">+ CREATE EVENT</Button>
          </Link>
        </div>
        
        <ActiveEventsTable events={eventData} />
      </section>

      <section>
         <div className="flex justify-between items-center mb-3 mt-8">
          <h2 className="text-2xl font-black tracking-tight">Recent Orders</h2>
          <div className="flex gap-3">
            <input 
              type="text" 
              placeholder="Search buyer..." 
              className="border-2 border-black px-3 py-1.5 text-sm font-medium focus:outline-none shadow-[2px_2px_0_0_#000]"
            />
            <select className="border-2 border-black px-3 py-1.5 text-sm font-bold bg-white cursor-pointer shadow-[2px_2px_0_0_#000] focus:outline-none">
              <option>ALL STATUS</option>
              <option>PENDING</option>
              <option>COMPLETED</option>
            </select>
          </div>
        </div>
      </section>

    </div>
  );
}