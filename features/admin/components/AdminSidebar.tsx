"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/features/global/components/Button";
import { useState } from "react";

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "📅 MANAJEMEN EVENT", href: "/admin/dashboard" },
    { name: "🧾 SEMUA PESANAN", href: "/admin/orders" },
    { name: "📊 ANALITIK", href: "/admin/analytics" },
    { name: "🎫 KEMBALI KE EVENT", href: "/explore" },
  ];

  return (
    <>
      <div className="md:hidden bg-white border-b-4 border-black p-4 flex justify-between items-center sticky top-0 z-40 shadow-[0_4px_0_0_#000]">
        <div className="font-black text-xl tracking-tighter">
          <span className="text-blue-600">🎫</span> TIKETQU
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="border-2 border-black px-3 py-1.5 bg-yellow-300 font-black text-sm shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
        >
          {isOpen ? "✕ TUTUP" : "☰ MENU"}
        </button>
      </div>

      <aside
        className={`
          fixed inset-0 z-50 md:static md:z-auto w-full md:w-64 border-r-4 border-black bg-white min-h-screen p-6 flex flex-col gap-6 
          shadow-[4px_0_0_0_#000] transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex justify-between items-center border-b-4 border-black pb-4">
          <div className="font-black text-2xl tracking-tighter">
            <span className="text-blue-600">🎫</span> TIKETQU ADMIN
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden border-2 border-black px-3 py-1 bg-red-400 font-black text-xs shadow-[2px_2px_0_0_#000]"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-4 mt-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setIsOpen(false)}
              >
                <Button 
                  variant={pathname === item.href ? "primary" : "secondary"}
                  className={`w-full text-left justify-start px-4 py-3 text-sm ${
                    isActive ? "bg-yellow-300 ring-2 ring-black" : ""
                  }`}
                >
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}