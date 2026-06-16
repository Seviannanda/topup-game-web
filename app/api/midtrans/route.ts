import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status } = body;

  // Verifikasi signature dari Midtrans (keamanan)
  const serverKey = process.env.MIDTRANS_SERVER_KEY!;
  const hash = crypto
    .createHash('sha512')
    .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
    .digest('hex');

  if (hash !== signature_key) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 403 });
  }

  // Ambil orderId dari order_id (format: "order-[id]")
  const orderId = parseInt(order_id.replace('order-', ''));

  // Tentukan status berdasarkan respons Midtrans
  let status = 'pending';

  if (transaction_status === 'capture' || transaction_status === 'settlement') {
    if (fraud_status === 'accept' || !fraud_status) {
      status = 'success';
    }
  } else if (
    transaction_status === 'cancel' ||
    transaction_status === 'deny' ||
    transaction_status === 'expire'
  ) {
    status = 'failed';
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  return NextResponse.json({ message: 'OK' });
}