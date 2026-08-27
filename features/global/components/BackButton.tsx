"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/features/global/components/Button";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      type="button"
      onClick={() => router.back()}
      className="w-full py-4 text-sm bg-white text-black hover:bg-gray-200 border-2 border-black"
    >
      ← KEMBALI
    </Button>
  );
}
