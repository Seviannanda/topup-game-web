'use server';

import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth';

export async function createOrder(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const productId = parseInt(formData.get('productId') as string);
  const gameUserId = formData.get('gameUserId') as string;
  const paymentMethod = formData.get('paymentMethod') as string;

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error('Produk tidak ditemukan');
  }

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      productId: product.id,
      gameUserId,
      totalPrice: product.price,
      paymentMethod,
      status: 'pending',
    },
  });

  redirect(`/order/${order.id}`);
}

export async function confirmPayment(orderId: number) {
  await prisma.order.update({
    where: { id: orderId },
    data: { status: 'success' },
  });

  revalidatePath(`/order/${orderId}`);
}

export async function updateOrderStatus(orderId: number, formData: FormData) {
  const user = await getCurrentUser();

  if (!user || user.role !== 'admin') {
    throw new Error('Akses ditolak');
  }

  const status = formData.get('status') as string;

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath('/admin');
}

export async function getSnapToken(orderId: number) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { product: { include: { game: true } }, user: true },
  });

  if (!order || order.userId !== user.id) {
    throw new Error('Order tidak ditemukan');
  }

  // Kalau sudah punya snapToken, langsung return
  if (order.snapToken) {
    return order.snapToken;
  }

  // Buat Snap Token baru dari Midtrans
  const midtransServerKey = process.env.MIDTRANS_SERVER_KEY!;
  const authString = Buffer.from(`${midtransServerKey}:`).toString('base64');

  const response = await fetch('https://app.sandbox.midtrans.com/snap/v1/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${authString}`,
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: `order-${order.id}`,
        gross_amount: order.totalPrice,
      },
      customer_details: {
        first_name: order.user?.name || 'Customer',
        email: order.user?.email || 'customer@email.com',
      },
      item_details: [
        {
          id: `product-${order.product.id}`,
          price: order.totalPrice,
          quantity: 1,
          name: `${order.product.game.name} - ${order.product.name}`,
        },
      ],
    }),
  });

  const data = await response.json();

  if (!data.token) {
    throw new Error('Gagal mendapatkan token dari Midtrans');
  }

  // Simpan token ke database
  await prisma.order.update({
    where: { id: order.id },
    data: { snapToken: data.token },
  });

  return data.token as string;
}