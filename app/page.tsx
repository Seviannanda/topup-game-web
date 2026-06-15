import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { Zap, ShieldCheck, Clock, ArrowRight } from 'lucide-react';

export default async function Home() {
  const games = await prisma.game.findMany({
  where: { isActive: true },
});

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-slate-950 to-blue-900/20" />
        <div className="relative max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Top Up Game{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Cepat &amp; Aman
            </span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto mb-8">
            Isi ulang diamond, voucher, dan item favorit kamu dalam hitungan menit. Proses instan, harga bersahabat.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              Proses Instan
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              Transaksi Aman
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              Layanan 24/7
            </div>
          </div>
        </div>
      </section>

      {/* Game List */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold mb-6">Pilih Game</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {games.map((game) => (
            <Link
              key={game.id}
              href={`/game/${game.slug}`}
              className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-purple-500/50 transition"
            >
              <div className="relative w-full aspect-square">
                <Image
                  src={`https://picsum.photos/seed/${game.slug}/400/400`}
                  alt={game.name}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1">{game.name}</h3>
                <p className="text-sm text-slate-400 line-clamp-2 mb-3">{game.description}</p>
                <span className="inline-flex items-center gap-1 text-sm text-purple-400 group-hover:gap-2 transition-all">
                  Top Up <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}