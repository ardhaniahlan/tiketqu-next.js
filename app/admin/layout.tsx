import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f4f4f5]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <header className="h-20 border-b-4 border-black bg-white flex items-center justify-between px-8 z-0">
          <h1 className="font-bold text-gray-500 uppercase tracking-widest text-sm">
            Admin Console
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-black bg-blue-200 overflow-hidden">
               <img src="https://api.dicebear.com/7.x/notionists/svg?seed=admin" alt="Admin" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}