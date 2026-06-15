'use server';

import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { hashPassword, verifyPassword, createSession, destroySession } from '@/lib/auth';

export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    redirect('/register?error=1');
  }

  const hashed = await hashPassword(password);

  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  });

  await createSession(user.id);
  redirect('/');
}

export async function loginUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await verifyPassword(password, user.password))) {
    redirect('/login?error=1');
  }

  await createSession(user.id);
  redirect('/');
}

export async function logoutUser() {
  await destroySession();
  redirect('/');
}