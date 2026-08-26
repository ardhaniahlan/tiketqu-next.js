import { Button } from "@/features/global/components/Button";

const events = [
  { id: 1, name: "Neon Nights Festival", date: "Oct 24, 2024", sold: 800, quota: 1000 },
  { id: 2, name: "Underground Techno Rave", date: "Nov 02, 2024", sold: 475, quota: 500 },
];

export function ActiveEventsTable() {
  return (
    <div className="border-4 border-black shadow-[6px_6px_0_0_#000] bg-white">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b-4 border-black bg-gray-50">
            <th className="p-4 font-bold uppercase text-sm">Event Name</th>
            <th className="p-4 font-bold uppercase text-sm">Date</th>
            <th className="p-4 font-bold uppercase text-sm">Quota / Sold</th>
            <th className="p-4 font-bold uppercase text-sm text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-b-2 border-black last:border-b-0">
              <td className="p-4 font-bold">{event.name}</td>
              <td className="p-4 text-gray-600 font-medium">{event.date}</td>
              <td className="p-4">
                <div className="flex items-center gap-3">
                  {/* Simple Progress Bar Brutalism */}
                  <div className="w-32 h-4 border-2 border-black bg-white flex">
                    <div 
                      className="bg-blue-600 h-full border-r-2 border-black" 
                      style={{ width: `${(event.sold / event.quota) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-sm font-bold">{event.sold}/{event.quota}</span>
                </div>
              </td>
              <td className="p-4 text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" className="px-3 py-1">✏️</Button>
                  <Button variant="danger" className="px-3 py-1">🗑️</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}