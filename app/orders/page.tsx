import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { product: { include: { game: true } } },
  });

  const statusStyle = {
    pending: 'bg-yellow-100 text-yellow-800',
    success: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  } as Record<string, string>;

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Riwayat Transaksi</h1>
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            &larr; Kembali ke Beranda
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500 text-sm">
            Belum ada transaksi.
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/order/${order.id}`}
                className="block bg-white rounded-lg shadow p-4 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm">
                    {order.product.game.name} - {order.product.name}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      statusStyle[order.status] || 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>#{order.id} &middot; {order.gameUserId}</span>
                  <span className="font-medium text-gray-700">
                    Rp {order.totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {order.createdAt.toLocaleString('id-ID')}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}