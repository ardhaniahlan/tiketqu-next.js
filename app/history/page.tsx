import { db } from "@/db";
import { orders, events, transactions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/features/global/components/Button";
import ContinuePaymentButton from "@/features/global/components/ContinuePaymentButton";

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const userHistory = await db
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
    .orderBy(desc(orders.createdAt));

  return (
    <div className="min-h-screen bg-[#f4f4f5] font-sans p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between border-b-4 border-black pb-4">
          <h1 className="text-3xl font-black uppercase">📜 Riwayat Transaksi</h1>
          <Link href="/">
            <Button variant="secondary">KEMBALI</Button>
          </Link>
        </div>

        {userHistory.length === 0 ? (
          <div className="text-center py-12 border-4 border-black border-dashed bg-white font-bold">
            Belum ada transaksi. Yuk beli tiket pertamamu!
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {userHistory.map((item) => (
              <div 
                key={item.orderId} 
                className="bg-white border-4 border-black p-4 md:p-6 shadow-[6px_6px_0_0_#000] flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-500">
                    Order ID: {item.orderId.substring(0, 8).toUpperCase()}...
                  </p>
                  <h2 className="text-xl font-black uppercase">{item.eventTitle}</h2>
                  <p className="font-medium text-sm">
                    {item.quantity} Tiket • Rp {item.totalPrice.toLocaleString("id-ID")}
                  </p>
                  {item.paymentMethod && (
                    <p className="text-xs font-bold bg-gray-200 inline-block px-2 py-1 mt-1">
                      Via {item.paymentMethod.toUpperCase()}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto mt-4 md:mt-0">
                  <span className={`px-4 py-1 text-sm font-bold border-2 border-black ${
                    item.status === 'paid' ? 'bg-green-400' :
                    item.status === 'pending' ? 'bg-yellow-300' :
                    'bg-red-400'
                  }`}>
                    {item.status === 'paid' ? '✅ LUNAS' :
                     item.status === 'pending' ? '⏳ PENDING' :
                     '❌ GAGAL/KADALUARSA'}
                  </span>
                  
                  {item.status === 'paid' && (
                    <Link href={`/history/${item.orderId}`} className="w-full md:w-auto">
                      <Button className="w-full md:w-auto bg-blue-600 text-white text-xs">
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
        )}
      </div>
    </div>
  );
}