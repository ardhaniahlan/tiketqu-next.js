import Link from "next/link";
import { Button } from "@/features/global/components/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center p-4 text-center font-sans">
      <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_#000] max-w-md w-full space-y-6">
        <h1 className="text-6xl md:text-8xl font-black text-red-600 tracking-tighter">
          404
        </h1>
        <h2 className="text-xl md:text-2xl font-black uppercase">
          HALAMAN TIDAK DITEMUKAN
        </h2>
        <p className="font-bold text-gray-500 text-sm">
          Sepertinya Anda tersesat atau link yang Anda masukkan salah. 
        </p>
        <Link href="/" className="block pt-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-sm">
            KEMBALI KE BERANDA 🏠
          </Button>
        </Link>
      </div>
    </div>
  );
}