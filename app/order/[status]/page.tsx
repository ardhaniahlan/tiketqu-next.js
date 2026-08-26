import { db } from "@/db";
import { orders, events } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/features/global/components/Button";

interface OrderStatusPageProps {
  params: Promise<{ status: string }>;
  searchParams: Promise<{
    order_id?: string;
    transaction_status?: string;
    status_code?: string;
  }>;
}

const VIEW_CONFIG = {
  pending: {
    icon: "⏸️",
    title: "Pembayaran Belum Selesai",
    message:
      "Kamu menutup halaman pembayaran sebelum selesai. Pesanan kamu masih tersimpan, silakan lanjutkan pembayaran.",
    color: "bg-yellow-100",
  },
  error: {
    icon: "❌",
    title: "Pembayaran Gagal",
    message:
      "Terjadi kesalahan saat memproses pembayaran kamu. Silakan coba lagi.",
    color: "bg-red-100",
  },
} as const;

export default async function OrderStatusPage({
  params,
  searchParams,
}: OrderStatusPageProps) {
  const { status } = await params;
  const { order_id } = await searchParams;

  let order = null;
  if (order_id) {
    const result = await db
      .select({
        id: orders.id,
        status: orders.status,
        totalPrice: orders.totalPrice,
        eventTitle: events.title,
      })
      .from(orders)
      .leftJoin(events, eq(orders.eventId, events.id))
      .where(eq(orders.id, order_id))
      .limit(1);

    order = result[0] ?? null;
  }

  const isPaid = order?.status === "paid";
  const isPending = order?.status === "pending";

  const view =
    status === "success"
      ? {
          icon: isPaid ? "🎉" : isPending ? "⏳" : "❓",
          title: isPaid
            ? "Pembayaran Berhasil!"
            : isPending
            ? "Menunggu Konfirmasi Pembayaran"
            : "Pesanan Tidak Ditemukan",
          message: isPaid
            ? "Tiket kamu sudah kami siapkan. Cek email untuk detail e-tiket."
            : isPending
            ? "Kami masih menunggu konfirmasi dari sistem pembayaran. Halaman ini bisa kamu refresh beberapa saat lagi."
            : "Kami belum menemukan detail pesanan ini di sistem kami.",
          color: isPaid ? "bg-green-100" : isPending ? "bg-yellow-100" : "bg-gray-100",
        }
      : VIEW_CONFIG[status as keyof typeof VIEW_CONFIG] ?? VIEW_CONFIG.error;

  return (
    <div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center p-4">
      <div
        className={`w-full max-w-md border-4 border-black p-8 shadow-[6px_6px_0_0_#000] text-center space-y-4 ${view.color}`}
      >
        <div className="text-5xl">{view.icon}</div>
        <h1 className="font-black text-2xl uppercase">{view.title}</h1>
        <p className="font-medium text-gray-700">{view.message}</p>

        {order?.eventTitle && (
          <div className="bg-white border-2 border-black p-3 text-sm font-bold">
            {order.eventTitle}
          </div>
        )}

        <Link href="/explore">
          <Button className="w-full mt-4">KEMBALI KE EXPLORE</Button>
        </Link>
      </div>
    </div>
  );
}