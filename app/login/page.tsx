import Link from 'next/link';
import { loginUser } from '@/lib/auth-actions';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="max-w-sm w-full bg-white rounded-lg shadow p-6">
        <h1 className="text-xl font-bold mb-4">Login</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3 mb-4">
            Email atau password salah.
          </div>
        )}

        <form action={loginUser} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input type="email" id="email" name="email" required className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
            <input type="password" id="password" name="password" required className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition">
            Login
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Belum punya akun?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">Daftar di sini</Link>
        </p>
      </div>
    </main>
  );
}