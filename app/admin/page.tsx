import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { updateOrderStatus } from '@/lib/actions';
import Link from 'next/link';
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle,
  Gamepad2,
} from 'lucide-react';

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'admin') {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
          <ShieldAlert className="w-8 h-8 text-red-400 mx-auto mb-3" />
          <p className="text-slate-300 mb-4">Halaman ini hanya untuk admin.</p>
          <Link href="/" className="text-purple-400 hover:underline font-medium">
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    );
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      product: { include: { game: true } },
      user: true,
    },
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
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-400" />
            Admin - Kelola Transaksi
          </h1>
          <Link
            href="/admin/games"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-sm px-3 py-2 rounded-lg transition"
          >
            <Gamepad2 className="w-4 h-4" />
            Kelola Game
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800/50 border-b border-slate-800">
              <tr>
                <th className="text-left p-3 text-slate-400 font-medium">ID</th>
                <th className="text-left p-3 text-slate-400 font-medium">User</th>
                <th className="text-left p-3 text-slate-400 font-medium">Item</th>
                <th className="text-left p-3 text-slate-400 font-medium">ID Game</th>
                <th className="text-left p-3 text-slate-400 font-medium">Total</th>
                <th className="text-left p-3 text-slate-400 font-medium">Status</th>
                <th className="text-left p-3 text-slate-400 font-medium">Tanggal</th>
                <th className="text-left p-3 text-slate-400 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const current = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = current.icon;

                return (
                  <tr key={order.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30 transition">
                    <td className="p-3 font-medium">#{order.id}</td>
                    <td className="p-3">
                      {order.user ? (
                        <>
                          <div className="font-medium">{order.user.name}</div>
                          <div className="text-slate-500 text-xs">{order.user.email}</div>
                        </>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="font-medium">{order.product.game.name}</div>
                      <div className="text-slate-500 text-xs">{order.product.name}</div>
                    </td>
                    <td className="p-3 text-slate-300">{order.gameUserId}</td>
                    <td className="p-3 text-purple-400 font-medium">
                      Rp {order.totalPrice.toLocaleString('id-ID')}
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${current.style}`}>
                        <StatusIcon className="w-3 h-3" />
                        {current.label}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 text-xs">
                      {order.createdAt.toLocaleString('id-ID')}
                    </td>
                    <td className="p-3">
                      <form action={updateOrderStatus.bind(null, order.id)} className="flex gap-2">
                        <select
                          name="status"
                          defaultValue={order.status}
                          className="bg-slate-950 border border-slate-800 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="success">Success</option>
                          <option value="failed">Failed</option>
                        </select>
                        <button
                          type="submit"
                          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2.5 py-1 rounded-md text-xs hover:opacity-90 transition"
                        >
                          Update
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}