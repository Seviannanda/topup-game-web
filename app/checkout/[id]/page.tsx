import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { createOrder } from '@/lib/actions';

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = parseInt(id);

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { game: true },
  });

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-xl font-bold mb-4">Checkout</h1>

        <div className="border rounded-md p-4 mb-4 bg-gray-50">
          <p className="text-sm text-gray-500">{product.game.name}</p>
          <p className="font-semibold">{product.name}</p>
          <p className="text-blue-600 font-bold mt-1">
            Rp {product.price.toLocaleString('id-ID')}
          </p>
        </div>

        <form action={createOrder} className="space-y-4">
          <input type="hidden" name="productId" value={product.id} />

          <div>
            <label htmlFor="gameUserId" className="block text-sm font-medium mb-1">
              ID Game / Nickname
            </label>
            <input
              type="text"
              id="gameUserId"
              name="gameUserId"
              required
              placeholder="Contoh: 123456789 (Server 10)"
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium mb-1">
              Metode Pembayaran
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              required
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="QRIS">QRIS</option>
              <option value="Bank Transfer">Transfer Bank (Virtual Account)</option>
              <option value="E-Wallet">E-Wallet (OVO/Dana/Gopay)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition"
          >
            Buat Pesanan
          </button>
        </form>
      </div>
    </main>
  );
}