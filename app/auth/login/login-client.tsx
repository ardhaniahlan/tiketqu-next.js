"use client";

import { signIn } from "next-auth/react";
import { Card } from "@/features/global/components/Card";
import { Button } from "@/features/global/components/Button";

export default function LoginClient() {
  return (
    <div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center p-8 space-y-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
            Masuk / Daftar
          </h1>
          <p className="text-gray-600 font-medium">
            Satu langkah lagi untuk mendapatkan tiketmu!
          </p>
        </div>

        <Button 
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full text-lg py-4 flex items-center justify-center gap-2"
        >
          <span className="text-xl font-black">G</span> Lanjutkan dengan Google
        </Button>
      </Card>
    </div>
  );
}