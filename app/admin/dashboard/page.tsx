import { StatCard } from "@/features/admin/components/StatCard";
import { ActiveEventsTable } from "@/features/admin/components/ActiveEventTable";
import { Button } from "@/features/global/components/Button";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Events" value="124" />
        <StatCard title="Tickets Sold" value="8,432" />
        <StatCard title="Revenue" value="$142K" variant="blue" />
      </div>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-black tracking-tight">Active Events</h2>
          <Link href="/admin/dashboard/create">
            <Button>+ CREATE EVENT</Button>
          </Link>
        </div>
        <ActiveEventsTable />
      </section>

      <section>
         <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-black tracking-tight">Recent Orders</h2>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Search buyer..." 
              className="border-4 border-black p-2 font-medium focus:outline-none"
            />
            <select className="border-4 border-black p-2 font-bold bg-white cursor-pointer shadow-[4px_4px_0_0_#000]">
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