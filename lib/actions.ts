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