import { db } from "@/db";
import { orders, events, transactions } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/features/global/components/Button";
import ContinuePaymentButton from "@/features/global/components/ContinuePaymentButton";

export default async function HistoryPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ page?: string }> 
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const pageSize = 2; 
  const offset = (currentPage - 1) * pageSize;

  const [userHistory, totalCountResult] = await Promise.all([
    db
      .select({
        orderId: orders.id,
        status: orders.status,
        totalPrice: orders.totalPrice,
        quantity: orders.quantity,
        createdAt: orders.createdAt,
        snapToken: orders.snapToken,
        eventTitle: events.title,
        paymentMethod: transactions.paymentType,
      })
      .from(orders)
      .leftJoin(events, eq(orders.eventId, events.id))
      .leftJoin(transactions, eq(orders.id, transactions.orderId))
      .where(eq(orders.userId, session.user.id))
      .orderBy(desc(orders.createdAt))
      .limit(pageSize)
      .offset(offset),
      
    db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(eq(orders.userId, session.user.id))
  ]);

  const totalItems = Number(totalCountResult[0]?.count || 0);
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="min-h-screen bg-[#f4f4f5] font-sans p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between border-b-4 border-black pb-4">
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">📜 Riwayat Transaksi</h1>
          <Link href="/">
            <Button variant="secondary" className="px-3 py-1.5 text-sm md:text-base">← KEMBALI</Button>
          </Link>
        </div>

        {totalItems === 0 ? (
          <div className="text-center py-12 border-4 border-black bg-white shadow-[4px_4px_0_0_#000]">
            <p className="font-black text-xl mb-2">YAH, MASIH KOSONG!</p>
            <p className="font-bold text-gray-500 mb-4">Belum ada transaksi. Yuk beli tiket pertamamu!</p>
            <Link href="/explore">
              <Button>CARI EVENT SEKARANG 🎫</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-5">
              {userHistory.map((item) => (
                <div 
                  key={item.orderId} 
                  className="bg-white border-4 border-black p-4 md:p-6 shadow-[6px_6px_0_0_#000] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#000]"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-500">
                      Order ID: {item.orderId.substring(0, 8).toUpperCase()}...
                    </p>
                    <h2 className="text-xl font-black uppercase tracking-tight">{item.eventTitle || "Event Dihapus"}</h2>
                    <p className="font-bold text-sm bg-yellow-200 inline-block px-2 py-1 border-2 border-black">
                      {item.quantity} Tiket • Rp {item.totalPrice.toLocaleString("id-ID")}
                    </p>
                    {item.paymentMethod && (
                      <p className="text-xs font-black bg-gray-200 inline-block px-2 py-1 ml-2 border-2 border-black">
                        💳 {item.paymentMethod.toUpperCase()}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto mt-2 md:mt-0">
                    <span className={`px-4 py-1 text-xs font-black border-2 border-black shadow-[2px_2px_0_0_#000] ${
                      item.status === 'paid' ? 'bg-green-400' :
                      item.status === 'pending' ? 'bg-yellow-300' :
                      'bg-red-400 text-white'
                    }`}>
                      {item.status === 'paid' ? '✅ LUNAS' :
                       item.status === 'pending' ? '⏳ PENDING' :
                       '❌ GAGAL/KADALUARSA'}
                    </span>
                    
                    {item.status === 'paid' && (
                      <Link href={`/history/${item.orderId}`} className="w-full md:w-auto">
                        <Button className="w-full md:w-auto text-xs py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white">
                          🎟️ LIHAT E-TICKET
                        </Button>
                      </Link>
                    )}
                    
                    {item.status === 'pending' && (
                      <ContinuePaymentButton 
                        snapToken={item.snapToken} 
                        orderId={item.orderId} 
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-white border-4 border-black p-4 shadow-[4px_4px_0_0_#000] mt-6">
                <Link 
                  href={`/history?page=${currentPage - 1}`}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                >
                  <Button variant="secondary" className="px-4 py-2 text-sm font-black">
                    ← SEBELUMNYA
                  </Button>
                </Link>

                <span className="font-black text-sm">
                  HALAMAN {currentPage} DARI {totalPages}
                </span>

                <Link 
                  href={`/history?page=${currentPage + 1}`}
                  className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                >
                  <Button variant="secondary" className="px-4 py-2 text-sm font-black">
                    SELANJUTNYA →
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}