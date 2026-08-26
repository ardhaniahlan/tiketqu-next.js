import Link from "next/link";
import { Button } from "@/features/global/components/Button";

export function AdminSidebar() {
  return (
    <aside className="w-64 border-r-4 border-black bg-white min-h-screen p-6 flex flex-col gap-6 shadow-[4px_0_0_0_#000] z-10">
      <div className="font-black text-2xl tracking-tighter border-b-4 border-black pb-4">
        <span className="text-blue-600">🎫</span> TIKETQU
      </div>

      <nav className="flex flex-col gap-4 mt-4">
        <Link href="/admin/dashboard">
          <Button className="w-full text-left justify-start px-4 py-3 text-sm">
            📅 MANAGE EVENTS
          </Button>
        </Link>
        <Link href="/admin/orders">
          <Button variant="secondary" className="w-full text-left justify-start px-4 py-3 text-sm">
            🧾 ALL ORDERS
          </Button>
        </Link>
        <Link href="/admin/analytics">
          <Button variant="secondary" className="w-full text-left justify-start px-4 py-3 text-sm">
            📊 ANALYTICS
          </Button>
        </Link>
      </nav>
    </aside>
  );
}