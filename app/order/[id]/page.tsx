import prisma from '@/lib/prisma';
import { confirmPayment } from '@/lib/actions';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  Gamepad2,
  Wallet,
  Receipt,
} from 'lucide-react';

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

  const user = await getCurrentUser();

  if (!order || !user || order.userId !== user.id) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
          <p className="text-slate-300 mb-4">
            Pesanan tidak ditemukan atau bukan milik akun ini.
          </p>
          <Link href="/" className="text-purple-400 hover:underline font-medium">
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    );
  }

  const statusConfig = {
    pending: {
      label: 'Menunggu Pembayaran',
      style: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
      icon: Clock,
    },
    success: {
      label: 'Pembayaran Berhasil',
      style: 'bg-green-500/10 text-green-300 border-green-500/30',
      icon: CheckCircle2,
    },
    failed: {
      label: 'Pembayaran Gagal',
      style: 'bg-red-500/10 text-red-300 border-red-500/30',
      icon: XCircle,
    },
  } as Record<string, { label: string; style: string; icon: typeof Clock }>;

  const current = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = current.icon;

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-md mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition mb-4">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h1 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-purple-400" />
            Detail Pesanan
          </h1>

          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border mb-4 ${current.style}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {current.label}
          </div>

          <div className="space-y-2.5 text-sm border-t border-slate-800 pt-4">
            <div className="flex justify-between">
              <span className="text-slate-400">ID Pesanan</span>
              <span className="font-medium">#{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Gamepad2 className="w-3.5 h-3.5" />
                Game
              </span>
              <span className="font-medium">{order.product.game.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Item</span>
              <span className="font-medium">{order.product.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">ID Game / Nickname</span>
              <span className="font-medium">{order.gameUserId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5" />
                Metode Pembayaran
              </span>
              <span className="font-medium">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-base pt-2.5 border-t border-slate-800 mt-2.5">
              <span className="font-semibold">Total Bayar</span>
              <span className="font-bold text-purple-400">
                Rp {order.totalPrice.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {order.status === 'pending' && (
            <form action={confirmPayment.bind(null, order.id)} className="mt-6">
              <p className="text-xs text-slate-500 mb-2 text-center">
                *Tombol ini adalah simulasi pembayaran (belum koneksi ke payment gateway nyata)
              </p>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition"
              >
                <CreditCard className="w-4 h-4" />
                Bayar Sekarang (Simulasi)
              </button>
            </form>
          )}

          {order.status === 'success' && (
            <div className="mt-6 bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center text-sm text-green-300">
              Pembayaran berhasil! Item akan segera diproses ke ID Game kamu.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}