import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { confirmPayment } from '@/lib/actions';
import Link from 'next/link';

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orderId = parseInt(id);

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { product: { include: { game: true } } },
  });

  if (!order) {
    notFound();
  }

  const statusStyle = {
    pending: 'bg-yellow-100 text-yellow-800',
    success: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  }[order.status] || 'bg-gray-100 text-gray-800';

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-xl font-bold mb-4">Detail Pesanan</h1>

        <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${statusStyle}`}>
          {order.status.toUpperCase()}
        </div>

        <div className="space-y-2 text-sm border-t pt-4">
          <div className="flex justify-between">
            <span className="text-gray-500">ID Pesanan</span>
            <span className="font-medium">#{order.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Game</span>
            <span className="font-medium">{order.product.game.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Item</span>
            <span className="font-medium">{order.product.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">ID Game / Nickname</span>
            <span className="font-medium">{order.gameUserId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Metode Pembayaran</span>
            <span className="font-medium">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between text-base pt-2 border-t mt-2">
            <span className="font-semibold">Total Bayar</span>
            <span className="font-bold text-blue-600">
              Rp {order.totalPrice.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {order.status === 'pending' && (
          <form action={confirmPayment.bind(null, order.id)} className="mt-6">
            <p className="text-xs text-gray-500 mb-2 text-center">
              *Tombol ini adalah simulasi pembayaran (belum koneksi ke payment gateway nyata)
            </p>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition"
            >
              Bayar Sekarang (Simulasi)
            </button>
          </form>
        )}

        {order.status === 'success' && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4 text-center text-sm text-green-700">
            Pembayaran berhasil! Item akan segera diproses ke ID Game kamu.
          </div>
        )}

        <Link
          href="/"
          className="block text-center text-blue-600 hover:underline text-sm mt-4"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}