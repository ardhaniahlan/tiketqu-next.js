import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f4f4f5]">
      
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        
        <header className="h-20 border-b-4 border-black bg-white flex items-center justify-between px-6 md:px-8">
          <h1 className="font-bold text-gray-500 uppercase tracking-widest text-xs md:text-sm">
            Admin Console
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border-2 border-black bg-blue-200 overflow-hidden shadow-[2px_2px_0_0_#000]">
               <img src="https://api.dicebear.com/7.x/notionists/svg?seed=admin" alt="Admin" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 bg-[#f4f4f5]">
          {children}
        </main>
      </div>

    </div>
  );
}