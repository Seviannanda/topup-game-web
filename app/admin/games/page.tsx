import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { createGame, toggleGameActive } from '@/lib/admin-actions';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  Plus,
  Eye,
  EyeOff,
  Package,
  Gamepad2,
} from 'lucide-react';

export default async function AdminGamesPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'admin') {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
          <ShieldAlert className="w-8 h-8 text-red-400 mx-auto mb-3" />
          <p className="text-slate-300 mb-4">Halaman ini hanya untuk admin.</p>
          <Link href="/" className="text-purple-400 hover:underline font-medium">
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    );
  }

  const games = await prisma.game.findMany({
    orderBy: { id: 'asc' },
    include: { _count: { select: { products: true } } },
  });

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-purple-400" />
            Kelola Game
          </h1>
          <Link
            href="/admin"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-sm px-3 py-2 rounded-lg transition"
          >
            <ShieldCheck className="w-4 h-4" />
            Kelola Transaksi
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
          <h2 className="font-semibold mb-3 text-sm">Tambah Game Baru</h2>
          <form action={createGame} className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Nama Game</label>
              <input
                type="text"
                name="name"
                required
                placeholder="Contoh: Honor of Kings"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Deskripsi</label>
              <input
                type="text"
                name="description"
                placeholder="Top up token Honor of Kings termurah"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
            >
              <Plus className="w-4 h-4" />
              Tambah Game
            </button>
          </form>
        </div>

        <div className="space-y-3">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{game.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                    game.isActive
                      ? 'bg-green-500/10 text-green-300 border-green-500/30'
                      : 'bg-slate-700/30 text-slate-400 border-slate-600/30'
                  }`}>
                    {game.isActive ? 'Aktif' : 'Disembunyikan'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate">{game.description}</p>
                <p className="text-xs text-slate-500 mt-1">{game._count.products} produk</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/admin/games/${game.id}`}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-sm px-3 py-1.5 rounded-lg transition"
                >
                  <Package className="w-4 h-4" />
                  Kelola
                </Link>
                <form action={toggleGameActive.bind(null, game.id, game.isActive)}>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-sm px-3 py-1.5 rounded-lg transition"
                    title={game.isActive ? 'Sembunyikan' : 'Tampilkan'}
                  >
                    {game.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}