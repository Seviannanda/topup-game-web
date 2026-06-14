import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function Home() {
  const games = await prisma.game.findMany();

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="flex items-center justify-between max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold">Top Up Game</h1>
        <Link href="/orders" className="text-blue-600 hover:underline text-sm">
          Riwayat Transaksi &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {games.map((game) => (
          <Link
            key={game.id}
            href={`/game/${game.slug}`}
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition block"
          >
            <div className="w-full h-32 bg-gray-300 rounded mb-3 flex items-center justify-center text-gray-600 font-semibold">
              {game.name}
            </div>
            <h2 className="font-semibold text-lg">{game.name}</h2>
            <p className="text-sm text-gray-500">{game.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}