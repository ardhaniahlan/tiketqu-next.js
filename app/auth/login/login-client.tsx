"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/features/global/components/Card";
import { Button } from "@/features/global/components/Button";

export default function LoginClient() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = () => {
    setError(null);
    setIsLoading(true);

    const width = 480;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      "/api/auth/signin/google?callbackUrl=/auth/popup-callback",
      "google-login",
      `width=${width},height=${height},left=${left},top=${top}`,
    );

    if (!popup) {
      setIsLoading(false);
      setError("Popup diblokir browser. Izinkan popup untuk situs ini lalu coba lagi.");
      return;
    }

    const pollTimer = window.setInterval(() => {
      if (popup.closed) {
        cleanup();
        setIsLoading(false);
        setError("Login dibatalkan.");
      }
    }, 500);

    function cleanup() {
      window.clearInterval(pollTimer);
      window.removeEventListener("message", handleMessage);
    }

    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (event.data === "oauth-success") {
        cleanup();
        setIsLoading(false);
        router.replace("/");
        router.refresh();
      }
    }

    window.addEventListener("message", handleMessage);
  };

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

        {error && (
          <p className="text-red-600 font-medium text-sm">{error}</p>
        )}

        <Button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full text-lg py-4 flex items-center justify-center gap-2"
        >
          <span className="text-xl font-black">G</span>
          {isLoading ? "Menunggu login..." : "Lanjutkan dengan Google"}
        </Button>
      </Card>
    </div>
  );
}