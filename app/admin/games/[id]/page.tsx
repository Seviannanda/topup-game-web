import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { createProduct, updateProduct, toggleProductActive } from '@/lib/admin-actions';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ShieldAlert,
  Plus,
  Eye,
  EyeOff,
  ArrowLeft,
  Gem,
} from 'lucide-react';

export default async function AdminGameDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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

  const { id } = await params;
  const gameId = parseInt(id);

  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: { products: { orderBy: { id: 'asc' } } },
  });

  if (!game) {
    notFound();
  }

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/admin/games" className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition mb-4">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Kelola Game
        </Link>

        <h1 className="text-2xl font-bold mb-1">{game.name}</h1>
        <p className="text-sm text-slate-400 mb-6">{game.description}</p>

        {/* Form tambah produk */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
          <h2 className="font-semibold mb-3 text-sm flex items-center gap-1.5">
            <Gem className="w-4 h-4 text-purple-400" />
            Tambah Nominal Baru
          </h2>
          <form action={createProduct.bind(null, game.id)} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              name="name"
              required
              placeholder="Contoh: 100 Diamond"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <input
              type="number"
              name="price"
              required
              min={0}
              placeholder="Harga (contoh: 25000)"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Tambah
            </button>
          </form>
        </div>

        {/* Daftar produk */}
        <div className="space-y-3">
          {game.products.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center text-sm text-slate-400">
              Belum ada nominal/produk untuk game ini.
            </div>
          ) : (
            game.products.map((product) => (
              <div
                key={product.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <form
                  action={updateProduct.bind(null, product.id, game.id)}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1"
                >
                  <input
                    type="text"
                    name="name"
                    defaultValue={product.name}
                    required
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    name="price"
                    defaultValue={product.price}
                    required
                    min={0}
                    className="w-full sm:w-32 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="bg-slate-800 hover:bg-slate-700 text-sm px-3 py-2 rounded-lg transition whitespace-nowrap"
                  >
                    Simpan
                  </button>
                </form>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      product.isActive
                        ? 'bg-green-500/10 text-green-300 border-green-500/30'
                        : 'bg-slate-700/30 text-slate-400 border-slate-600/30'
                    }`}
                  >
                    {product.isActive ? 'Aktif' : 'Disembunyikan'}
                  </span>
                  <form action={toggleProductActive.bind(null, product.id, game.id, product.isActive)}>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-sm px-3 py-2 rounded-lg transition"
                      title={product.isActive ? 'Sembunyikan' : 'Tampilkan'}
                    >
                      {product.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}