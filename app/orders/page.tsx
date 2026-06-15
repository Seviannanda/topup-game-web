import prisma from '@/lib/prisma';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import {
  LogIn,
  PackageOpen,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
} from 'lucide-react';

export default async function OrdersPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
          <LogIn className="w-8 h-8 text-purple-400 mx-auto mb-3" />
          <p className="text-slate-300 mb-4">
            Silakan login untuk melihat riwayat transaksi kamu.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: { product: { include: { game: true } } },
  });

  const statusConfig = {
    pending: {
      label: 'Pending',
      style: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
      icon: Clock,
    },
    success: {
      label: 'Success',
      style: 'bg-green-500/10 text-green-300 border-green-500/30',
      icon: CheckCircle2,
    },
    failed: {
      label: 'Failed',
      style: 'bg-red-500/10 text-red-300 border-red-500/30',
      icon: XCircle,
    },
  } as Record<string, { label: string; style: string; icon: typeof Clock }>;

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Riwayat Transaksi</h1>

        {orders.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
            <PackageOpen className="w-8 h-8 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Belum ada transaksi.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const current = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = current.icon;

              return (
                <Link
                  key={order.id}
                  href={`/order/${order.id}`}
                  className="group flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-purple-500/50 transition"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm truncate">
                        {order.product.game.name} - {order.product.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                      <span>#{order.id}</span>
                      <span>&middot;</span>
                      <span className="truncate">{order.gameUserId}</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {order.createdAt.toLocaleString('id-ID')}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-4">
                    <span className="font-semibold text-sm text-purple-400">
                      Rp {order.totalPrice.toLocaleString('id-ID')}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${current.style}`}>
                      <StatusIcon className="w-3 h-3" />
                      {current.label}
                    </span>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 transition ml-2 flex-shrink-0 hidden sm:block" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}