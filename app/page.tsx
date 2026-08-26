import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/features/global/components/Button";
import { LogoutButton } from "@/features/auth/components/LogoutButton";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-[#f4f4f5] p-8">
      <header className="flex justify-between items-center mb-12 border-b-4 border-black pb-4">
        <h1 className="text-3xl font-black tracking-tighter">
          <span className="text-blue-600">🎫</span> TIKETQU
        </h1>

        <div className="flex gap-4 items-center">
          {session ? (
            <>
              <span className="font-bold border-2 border-black px-4 py-2 bg-white shadow-[4px_4px_0_0_#000]">
                Halo, {session.user?.name}!
              </span>

              {session.user?.role === "admin" && (
                <a href="/admin/dashboard">
                  <Button type="button">⚙️ Admin Panel</Button>
                </a>
              )}

              <LogoutButton />
            </>
          ) : (
            <Link href="/auth/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </header>

      <main>
        <h2 className="text-4xl font-black uppercase mb-8 shadow-[4px_4px_0_0_#000] inline-block bg-white border-4 border-black p-4">
          Explore Events
        </h2>
        <p className="font-medium text-lg text-gray-700">
          Katalog tiket event akan segera hadir di sini.
        </p>
      </main>
    </div>
  );
}
