'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Akses ditolak');
  }
  return user;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// ===== GAME =====

export async function createGame(formData: FormData) {
  await requireAdmin();

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const slug = slugify(name);

  try {
    await prisma.game.create({
      data: { name, slug, description },
    });
  } catch {
    throw new Error('Game dengan nama tersebut sudah ada, gunakan nama lain.');
  }

  revalidatePath('/admin/games');
}

export async function updateGame(gameId: number, formData: FormData) {
  await requireAdmin();

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  await prisma.game.update({
    where: { id: gameId },
    data: { name, description },
  });

  revalidatePath('/admin/games');
  revalidatePath(`/admin/games/${gameId}`);
}

export async function toggleGameActive(
  gameId: number,
  currentStatus: boolean,
  _formData: FormData
) {
  await requireAdmin();

  await prisma.game.update({
    where: { id: gameId },
    data: { isActive: !currentStatus },
  });

  revalidatePath('/admin/games');
}

// ===== PRODUCT =====

export async function createProduct(gameId: number, formData: FormData) {
  await requireAdmin();

  const name = formData.get('name') as string;
  const price = parseInt(formData.get('price') as string);

  await prisma.product.create({
    data: { name, price, gameId },
  });

  revalidatePath(`/admin/games/${gameId}`);
}

export async function updateProduct(
  productId: number,
  gameId: number,
  formData: FormData
) {
  await requireAdmin();

  const name = formData.get('name') as string;
  const price = parseInt(formData.get('price') as string);

  await prisma.product.update({
    where: { id: productId },
    data: { name, price },
  });

  revalidatePath(`/admin/games/${gameId}`);
}

export async function toggleProductActive(
  productId: number,
  gameId: number,
  currentStatus: boolean,
  _formData: FormData
) {
  await requireAdmin();

  await prisma.product.update({
    where: { id: productId },
    data: { isActive: !currentStatus },
  });

  revalidatePath(`/admin/games/${gameId}`);
}