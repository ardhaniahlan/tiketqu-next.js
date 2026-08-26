"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useDebounce from "@/hooks/useDebounce";

export function SearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("query") ?? "");
  const [date, setDate] = useState(searchParams.get("date") ?? "");

  const debouncedQuery = useDebounce(query, 500);
  const debouncedDate = useDebounce(date, 300);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedQuery) {
      params.set("query", debouncedQuery);
    } else {
      params.delete("query");
    }

    if (debouncedDate) {
      params.set("date", debouncedDate);
    } else {
      params.delete("date");
    }

    router.push(`/explore?${params.toString()}`);
  }, [debouncedQuery, debouncedDate]);

  return (
    <div className="bg-[#fcd34d] border-4 border-black p-4 md:p-5 shadow-[6px_6px_0_0_#000] flex flex-col md:flex-row gap-4 items-end">
      <div className="flex-1 w-full flex flex-col gap-1">
        <label className="text-xs font-black uppercase">Cari Event</label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nama event atau artis..."
          className="border-4 border-black p-3 font-medium outline-none focus:bg-yellow-50"
        />
      </div>

      <div className="flex-1 w-full flex flex-col gap-1">
        <label className="text-xs font-black uppercase">Tanggal</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border-4 border-black p-3 font-medium outline-none focus:bg-yellow-50"
        />
      </div>
    </div>
  );
}