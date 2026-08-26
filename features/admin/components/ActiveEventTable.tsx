import { Button } from "@/features/global/components/Button";
import Link from "next/link";
import { DeleteEventButton } from "./DeleteButton";

type EventItem = {
  id: string;
  title: string;
  date: Date;
  location: string;
  price: number;
  quota: number;
  quotaRemaining: number;
};

export function ActiveEventsTable({ events }: { events: EventItem[] }) {
  return (
    <div className="border-4 border-black shadow-[6px_6px_0_0_#000] bg-white overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-150">
        <thead>
          <tr className="border-b-4 border-black bg-gray-50">
            <th className="p-4 font-bold uppercase text-sm">Event Name</th>
            <th className="p-4 font-bold uppercase text-sm">Date</th>
            <th className="p-4 font-bold uppercase text-sm">Quota / Sold</th>
            <th className="p-4 font-bold uppercase text-sm text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-8 text-center font-bold text-gray-500">
                Belum ada event yang aktif.
              </td>
            </tr>
          ) : (
            events.map((event) => {
              const sold = event.quota - event.quotaRemaining;
              const percentage = event.quota > 0 ? (sold / event.quota) * 100 : 0;

              return (
                <tr key={event.id} className="border-b-2 border-black last:border-b-0 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold">{event.title}</td>
                  
                  <td className="p-4 text-gray-600 font-medium">
                    {event.date.toLocaleDateString("en-US", { 
                      month: "short", 
                      day: "2-digit", 
                      year: "numeric" 
                    })}
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-4 border-2 border-black bg-white flex">
                        <div 
                          className="bg-blue-600 h-full border-r-2 border-black" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="font-mono text-sm font-bold">{sold}/{event.quota}</span>
                    </div>
                  </td>
                  
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/dashboard/edit/${event.id}`}>
                        <Button variant="secondary" className="px-3 py-1 text-sm">✏️</Button>
                      </Link>
                      
                      <DeleteEventButton id={event.id} />
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}