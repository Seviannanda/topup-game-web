import Link from 'next/link';
import { Gamepad2, History, LogIn, UserPlus, LogOut, ShieldCheck, User } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { logoutUser } from '@/lib/auth-actions';

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Gamepad2 className="w-6 h-6 text-purple-400" />
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            TopUp Game
          </span>
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/orders" className="flex items-center gap-1.5 text-slate-300 hover:text-white transition">
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">Riwayat</span>
          </Link>

          {user ? (
            <>
              {user.role === 'admin' && (
                <Link href="/admin" className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              )}
              <span className="hidden sm:flex items-center gap-1.5 text-slate-300">
                <User className="w-4 h-4" />
                {user.name}
              </span>
              <form action={logoutUser}>
                <button type="submit" className="flex items-center gap-1.5 text-red-400 hover:text-red-300 transition">
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="flex items-center gap-1.5 text-slate-300 hover:text-white transition">
                <LogIn className="w-4 h-4" />
                Login
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1.5 rounded-md hover:opacity-90 transition"
              >
                <UserPlus className="w-4 h-4" />
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}