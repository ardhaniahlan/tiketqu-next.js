"use client";

import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";

export default function PopupCallback() {
  const [status, setStatus] = useState("Menyelesaikan login...");

  useEffect(() => {
    async function finish() {
      const session = await getSession();

      if (session && window.opener) {
        window.opener.postMessage("oauth-success", window.location.origin);
        setStatus("Berhasil! Menutup jendela...");
        window.close();
      } else {
        setStatus("Login gagal. Silakan tutup jendela ini dan coba lagi.");
      }
    }

    finish();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f4f5]">
      <p className="font-medium text-gray-700">{status}</p>
    </div>
  );
}