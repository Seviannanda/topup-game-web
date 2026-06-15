import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { createOrder } from '@/lib/actions';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Gamepad2, Wallet, AlertCircle, ShoppingCart } from 'lucide-react';

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = parseInt(id);

  const [product, user] = await Promise.all([
    prisma.product.findUnique({
      where: { id: productId },
      include: { game: true },
    }),
    getCurrentUser(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-md mx-auto">
        <Link
          href={`/game/${product.game.slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Link>

        <h1 className="text-xl font-bold mb-4">Checkout</h1>

        {/* Ringkasan produk */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4 flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={`https://picsum.photos/seed/${product.game.slug}/100/100`}
              alt={product.game.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm text-slate-400">{product.game.name}</p>
            <p className="font-semibold">{product.name}</p>
            <p className="text-purple-400 font-bold mt-1">
              Rp {product.price.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        {!user && (
          <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-sm rounded-lg p-3 mb-4">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              Kamu harus{' '}
              <Link href="/login" className="font-semibold underline">
                login
              </Link>{' '}
              terlebih dahulu sebelum melakukan pemesanan.
            </span>
          </div>
        )}

        <form action={createOrder} className="space-y-4">
          <input type="hidden" name="productId" value={product.id} />

          <div>
            <label htmlFor="gameUserId" className="flex items-center gap-1.5 text-sm font-medium mb-1.5">
              <Gamepad2 className="w-4 h-4 text-purple-400" />
              ID Game / Nickname
            </label>
            <input
              type="text"
              id="gameUserId"
              name="gameUserId"
              required
              placeholder="Contoh: 123456789 (Server 10)"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="paymentMethod" className="flex items-center gap-1.5 text-sm font-medium mb-1.5">
              <Wallet className="w-4 h-4 text-purple-400" />
              Metode Pembayaran
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="QRIS">QRIS</option>
              <option value="Bank Transfer">Transfer Bank (Virtual Account)</option>
              <option value="E-Wallet">E-Wallet (OVO/Dana/Gopay)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={!user}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
            {user ? 'Buat Pesanan' : 'Login untuk melanjutkan'}
          </button>
        </form>
      </div>
    </main>
  );
}