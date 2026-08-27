import { db } from "@/db";
import { orders, events } from "@/db/schema";
import { desc, eq, ilike, or, and, sql } from "drizzle-orm";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface AllOrdersPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function AllOrdersPage({
  searchParams,
}: AllOrdersPageProps) {
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams.search || "";
  const statusQuery = resolvedParams.status || "ALL";
  const currentPage = Number(resolvedParams.page) || 1;

  const pageSize = 10;
  const offset = (currentPage - 1) * pageSize;

  const conditions: any[] = [];

  if (searchQuery) {
    conditions.push(
      or(
        ilike(orders.buyerName, `%${searchQuery}%`),
        ilike(orders.id, `%${searchQuery}%`),
        ilike(orders.buyerEmail, `%${searchQuery}%`),
        ilike(events.title, `%${searchQuery}%`),
      ),
    );
  }

  if (statusQuery && statusQuery !== "ALL") {
    conditions.push(eq(orders.status, statusQuery.toLowerCase()));
  }

  const finalWhere = conditions.length > 0 ? and(...conditions) : undefined;

  const [allOrders, totalCountResult] = await Promise.all([
    db
      .select({
        orderId: orders.id,
        buyerName: orders.buyerName,
        buyerEmail: orders.buyerEmail,
        buyerPhone: orders.buyerPhone,
        quantity: orders.quantity,
        totalPrice: orders.totalPrice,
        status: orders.status,
        createdAt: orders.createdAt,
        eventTitle: events.title,
      })
      .from(orders)
      .leftJoin(events, eq(orders.eventId, events.id))
      .where(finalWhere)
      .orderBy(desc(orders.createdAt))
      .limit(pageSize)
      .offset(offset),

    db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .leftJoin(events, eq(orders.eventId, events.id))
      .where(finalWhere),
  ]);

  const totalData = Number(totalCountResult[0]?.count || 0);
  const totalPages = Math.ceil(totalData / pageSize);

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-6xl mx-auto font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-4 border-black pb-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">
            Semua Pesanan
          </h1>
          <p className="font-bold text-gray-500 text-sm">
            Pusat kendali transaksi dan data pembeli tiket.
          </p>
        </div>
      </div>

      <form
        method="GET"
        className="flex flex-col md:flex-row gap-3 bg-white p-4 border-4 border-black shadow-[4px_4px_0_0_#000]"
      >
        <input
          type="text"
          name="search"
          defaultValue={searchQuery}
          placeholder="Cari nama, email, atau ID pesanan..."
          className="border-2 border-black px-3 py-2 text-sm font-medium focus:outline-none focus:bg-yellow-100 flex-1 shadow-[2px_2px_0_0_#000]"
        />

        <select
          name="status"
          defaultValue={statusQuery}
          className="border-2 border-black px-3 py-2 text-sm font-bold bg-white cursor-pointer shadow-[2px_2px_0_0_#000] focus:outline-none"
        >
          <option value="ALL">SEMUA STATUS</option>
          <option value="paid">PAID (LUNAS)</option>
          <option value="pending">PENDING</option>
          <option value="expired">EXPIRED</option>
          <option value="cancelled">CANCELLED</option>
        </select>

        <button
          type="submit"
          className="bg-black text-white px-6 py-2 font-black uppercase text-sm hover:bg-gray-800 border-2 border-black shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5"
        >
          CARI 🔍
        </button>
      </form>

      <div className="bg-white border-4 border-black shadow-[6px_6px_0_0_#000] overflow-hidden">
        <div className="bg-gray-100 p-4 border-b-4 border-black flex justify-between items-center">
          <h2 className="font-black text-lg uppercase">
            Daftar Transaksi (Total: {totalData})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-4 border-black bg-gray-50">
                <th className="p-4 font-black uppercase text-xs">
                  Order ID / Tanggal
                </th>
                <th className="p-4 font-black uppercase text-xs">
                  Pembeli & Kontak
                </th>
                <th className="p-4 font-black uppercase text-xs">Event</th>
                <th className="p-4 font-black uppercase text-xs">
                  Jumlah & Total
                </th>
                <th className="p-4 font-black uppercase text-xs">Status</th>
                <th className="p-4 font-black uppercase text-xs text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {allOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-12 text-center font-bold text-gray-500"
                  >
                    Tidak ada data pesanan yang ditemukan.
                  </td>
                </tr>
              ) : (
                allOrders.map((order) => (
                  <tr
                    key={order.orderId}
                    className="border-b-2 border-black hover:bg-yellow-50 transition-colors"
                  >
                    <td className="p-4 text-xs font-bold text-gray-500">
                      <span className="font-mono text-black font-black">
                        {order.orderId}
                      </span>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {new Date(order.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-sm">{order.buyerName}</p>
                      <p className="text-xs text-gray-600">
                        {order.buyerEmail}
                      </p>
                      <p className="text-xs text-gray-500 font-mono">
                        {order.buyerPhone}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-sm truncate max-w-50">
                        {order.eventTitle}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-sm">
                        {order.quantity} Lembar <br />
                        <span className="text-xs text-green-600 font-black">
                          Rp {order.totalPrice.toLocaleString("id-ID")}
                        </span>
                      </p>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-xs font-black border-2 border-black uppercase ${
                          order.status === "paid"
                            ? "bg-green-400"
                            : order.status === "pending"
                              ? "bg-yellow-300"
                              : "bg-red-400"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <Link
                        href={`/user/ticket/${order.orderId}`}
                        className="inline-block bg-yellow-300 hover:bg-yellow-400 font-bold text-xs px-3 py-1.5 border-2 border-black shadow-[2px_2px_0_0_#000] uppercase"
                      >
                        Lihat Detail 👁️
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-4 bg-gray-50 border-t-4 border-black flex justify-between items-center">
            <p className="text-xs font-bold uppercase">
              Halaman {currentPage} dari {totalPages}
            </p>
            <div className="flex gap-2">
              {currentPage > 1 && (
                <Link
                  href={`/admin/orders?search=${searchQuery}&status=${statusQuery}&page=${currentPage - 1}`}
                  className="bg-white px-3 py-1.5 border-2 border-black font-black text-xs shadow-[2px_2px_0_0_#000] hover:bg-yellow-200"
                >
                  ← SEBELUMNYA
                </Link>
              )}
              {currentPage < totalPages && (
                <Link
                  href={`/admin/orders?search=${searchQuery}&status=${statusQuery}&page=${currentPage + 1}`}
                  className="bg-yellow-300 px-3 py-1.5 border-2 border-black font-black text-xs shadow-[2px_2px_0_0_#000] hover:bg-yellow-400"
                >
                  SELANJUTNYA →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
