import { StatCard } from "@/features/admin/components/StatCard";
import { ActiveEventsTable } from "@/features/admin/components/ActiveEventTable";
import { Button } from "@/features/global/components/Button";
import Link from "next/link";
import { db } from "@/db";
import { events, orders, transactions } from "@/db/schema";
import { desc, eq, sum } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [eventData, revenueResult, ticketsSoldResult, recentOrders] = await Promise.all([
    db.select().from(events).orderBy(desc(events.createdAt)),
    
    db.select({ total: sum(transactions.grossAmount) }).from(transactions).where(eq(transactions.status, "paid")),
    
    db.select({ total: sum(orders.quantity) }).from(orders).where(eq(orders.status, "paid")),

    db
      .select({
        orderId: orders.id,
        buyerName: orders.buyerName,
        quantity: orders.quantity,
        totalPrice: orders.totalPrice,
        status: orders.status,
        createdAt: orders.createdAt,
        eventTitle: events.title,
      })
      .from(orders)
      .leftJoin(events, eq(orders.eventId, events.id))
      .orderBy(desc(orders.createdAt))
      .limit(5),
  ]);

  const totalEvents = eventData.length;
  const ticketsSold = Number(ticketsSoldResult[0]?.total || 0);
  const totalRevenue = Number(revenueResult[0]?.total || 0);

  const formattedTicketsSold = new Intl.NumberFormat("id-ID").format(ticketsSold);
  const formattedRevenue = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(totalRevenue);

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-6xl mx-auto font-sans">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Total Events" 
          value={String(totalEvents)} 
        />
        <StatCard 
          title="Total Tiket Terjual" 
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
          <h2 className="text-2xl font-black tracking-tight">Event yang Aktif</h2>
          <Link href="/admin/dashboard/create">
            <Button className="text-sm px-3 py-1.5">+ BUAT EVENT</Button>
          </Link>
        </div>
        
        <ActiveEventsTable events={eventData} />
      </section>

      <section>
        <div className="flex justify-between items-center mb-3 mt-8">
          <h2 className="text-2xl font-black tracking-tight">Pesanan Terbaru</h2>
          <Link href="/admin/orders" className="text-xs font-bold underline hover:text-blue-600 uppercase">
            <Button className="text-sm px-3 py-1.5">LIHAT SEMUA PESANAN →</Button>
          </Link>
        </div>
      </section>

      <div className="bg-white border-4 border-black shadow-[6px_6px_0_0_#000] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-4 border-black bg-gray-50">
                <th className="p-4 font-black uppercase text-xs">Order ID</th>
                <th className="p-4 font-black uppercase text-xs">Pembeli</th>
                <th className="p-4 font-black uppercase text-xs">Event</th>
                <th className="p-4 font-black uppercase text-xs">Total</th>
                <th className="p-4 font-black uppercase text-xs">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center font-bold text-gray-500">
                    Belum ada pesanan masuk.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.orderId} className="border-b-2 border-black hover:bg-yellow-50 transition-colors">
                    <td className="p-4 text-xs font-bold text-gray-500">
                      {order.orderId.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-sm">{order.buyerName}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-sm truncate max-w-50">{order.eventTitle}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-sm">
                        {order.quantity} Tiket <br/>
                        <span className="text-xs text-green-600">Rp {order.totalPrice.toLocaleString("id-ID")}</span>
                      </p>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-black border-2 border-black uppercase ${
                        order.status === 'paid' ? 'bg-green-400' :
                        order.status === 'pending' ? 'bg-yellow-300' :
                        'bg-red-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}