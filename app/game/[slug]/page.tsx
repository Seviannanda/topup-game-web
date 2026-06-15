import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Gem, ShoppingCart } from 'lucide-react';

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const game = await prisma.game.findFirst({
  where: { slug, isActive: true },
  include: { products: { where: { isActive: true } } },
});

  if (!game) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      {/* Banner */}
      <section className="relative h-48 md:h-64 border-b border-slate-800">
        <Image
          src={`https://picsum.photos/seed/${game.slug}/1200/400`}
          alt={game.name}
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 h-full flex flex-col justify-end pb-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition mb-3">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke daftar game
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">{game.name}</h1>
          <p className="text-slate-400 text-sm mt-1">{game.description}</p>
        </div>
      </section>

      {/* Product List */}
      <section className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Gem className="w-5 h-5 text-purple-400" />
          Pilih Nominal
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {game.products.map((product) => (
            <div
              key={product.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between hover:border-purple-500/50 transition"
            >
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-purple-400 font-bold mt-1">
                  Rp {product.price.toLocaleString('id-ID')}
                </p>
              </div>

              <Link
                href={`/checkout/${product.id}`}
                className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
              >
                <ShoppingCart className="w-4 h-4" />
                Beli
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}