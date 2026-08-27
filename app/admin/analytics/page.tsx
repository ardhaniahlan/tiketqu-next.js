import { db } from "@/db";
import { events, orders, transactions } from "@/db/schema";
import { desc, eq, sum } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  // Mengambil data analitik mendalam dari database secara paralel
  const [totalRevenueResult, totalTicketsResult, eventPerformances] = await Promise.all([
    // A. Total keseluruhan pendapatan lunas
    db
      .select({ total: sum(transactions.grossAmount) })
      .from(transactions)
      .where(eq(transactions.status, "paid")),

    // B. Total tiket terjual keseluruhan
    db
      .select({ total: sum(orders.quantity) })
      .from(orders)
      .where(eq(orders.status, "paid")),

    // C. Performa Penjualan per Masing-Masing Event
    db
      .select({
        eventId: events.id,
        title: events.title,
        date: events.date,
        price: events.price,
        quota: events.quota,
        quotaRemaining: events.quotaRemaining,
      })
      .from(events)
      .orderBy(desc(events.createdAt)),
  ]);

  const totalRevenue = Number(totalRevenueResult[0]?.total || 0);
  const totalTickets = Number(totalTicketsResult[0]?.total || 0);

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-6xl mx-auto font-sans">
      
      {/* HEADER HALAMAN */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-4 border-black pb-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Analitik & Laporan</h1>
          <p className="font-bold text-gray-500 text-sm">Statistik mendalam performa penjualan event Anda.</p>
        </div>
      </div>

      {/* KARTU RINGKASAN UTAMA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-300 border-4 border-black p-6 shadow-[6px_6px_0_0_#000]">
          <h3 className="font-bold uppercase text-sm mb-2">Total Pendapatan Bersih</h3>
          <p className="text-3xl md:text-4xl font-black font-mono">
            Rp {totalRevenue.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="bg-yellow-300 border-4 border-black p-6 shadow-[6px_6px_0_0_#000]">
          <h3 className="font-bold uppercase text-sm mb-2">Akumulasi Tiket Terjual</h3>
          <p className="text-3xl md:text-4xl font-black font-mono">
            {totalTickets} <span className="text-xl">Lembar</span>
          </p>
        </div>
      </div>

      {/* TABEL PERFORMA PER EVENT */}
      <div className="bg-white border-4 border-black shadow-[6px_6px_0_0_#000] overflow-hidden mt-8">
        <div className="bg-gray-100 p-4 border-b-4 border-black">
          <h2 className="font-black text-lg uppercase">Rincian Performa per Event</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-4 border-black bg-gray-50">
                <th className="p-4 font-black uppercase text-xs">Nama Event</th>
                <th className="p-4 font-black uppercase text-xs">Harga Tiket</th>
                <th className="p-4 font-black uppercase text-xs">Sisa / Total Kuota</th>
                <th className="p-4 font-black uppercase text-xs">Tiket Terjual</th>
                <th className="p-4 font-black uppercase text-xs">Estimasi Pendapatan</th>
              </tr>
            </thead>
            <tbody>
              {eventPerformances.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center font-bold text-gray-500">
                    Belum ada data event tersedia.
                  </td>
                </tr>
              ) : (
                eventPerformances.map((ev) => {
                  const sold = ev.quota - ev.quotaRemaining;
                  const estimatedRevenue = sold * ev.price;

                  return (
                    <tr key={ev.eventId} className="border-b-2 border-black hover:bg-yellow-50 transition-colors">
                      <td className="p-4">
                        <p className="font-black text-sm">{ev.title}</p>
                        <p className="text-xs text-gray-500">
                          {ev.date ? new Date(ev.date).toLocaleDateString("id-ID") : "-"}
                        </p>
                      </td>
                      <td className="p-4 font-bold text-sm">
                        Rp {ev.price.toLocaleString("id-ID")}
                      </td>
                      <td className="p-4 font-bold text-sm">
                        <span className="text-blue-600 font-black">{ev.quotaRemaining}</span> / {ev.quota}
                      </td>
                      <td className="p-4">
                        <span className="bg-yellow-200 border-2 border-black px-2 py-1 text-xs font-black">
                          {sold} Terjual
                        </span>
                      </td>
                      <td className="p-4 font-black text-sm text-green-600 font-mono">
                        Rp {estimatedRevenue.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}