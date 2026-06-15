import Link from 'next/link';
import { registerUser } from '@/lib/auth-actions';
import { User, Mail, Lock, UserPlus, AlertCircle, Gamepad2 } from 'lucide-react';

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-sm w-full bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-1">
          <Gamepad2 className="w-6 h-6 text-purple-400" />
          <h1 className="text-xl font-bold">Daftar Akun</h1>
        </div>
        <p className="text-sm text-slate-400 mb-5">
          Buat akun untuk mulai top up dan melacak transaksi kamu.
        </p>

        {error && (
          <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg p-3 mb-4">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Email sudah terdaftar. Silakan gunakan email lain atau login.</span>
          </div>
        )}

        <form action={registerUser} className="space-y-4">
          <div>
            <label htmlFor="name" className="flex items-center gap-1.5 text-sm font-medium mb-1.5">
              <User className="w-4 h-4 text-purple-400" />
              Nama
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="email" className="flex items-center gap-1.5 text-sm font-medium mb-1.5">
              <Mail className="w-4 h-4 text-purple-400" />
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="password" className="flex items-center gap-1.5 text-sm font-medium mb-1.5">
              <Lock className="w-4 h-4 text-purple-400" />
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              minLength={6}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition"
          >
            <UserPlus className="w-4 h-4" />
            Daftar
          </button>
        </form>

        <p className="text-sm text-center text-slate-400 mt-4">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-purple-400 hover:underline font-medium">
            Login di sini
          </Link>
        </p>
      </div>
    </main>
  );
}