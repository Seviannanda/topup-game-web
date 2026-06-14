import prisma from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const game = await prisma.game.findUnique({
    where: { slug },
    include: { products: true },
  });

  if (!game) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-blue-600 hover:underline text-sm">
          &larr; Kembali ke daftar game
        </Link>

        <div className="bg-white rounded-lg shadow p-6 mt-4 mb-6">
          <h1 className="text-2xl font-bold">{game.name}</h1>
          <p className="text-gray-500 mt-1">{game.description}</p>
        </div>

        <h2 className="text-lg font-semibold mb-3">Pilih Nominal</h2>

        <div className="space-y-3">
          {game.products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-gray-500 text-sm">
                  Rp {product.price.toLocaleString('id-ID')}
                </p>
              </div>

              <Link
                href={`/checkout/${product.id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
              >
                Beli
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}