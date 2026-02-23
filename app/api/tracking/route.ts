import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const number = searchParams.get('number');

  if (!number) {
    return NextResponse.json({ error: 'Missing tracking number' }, { status: 400 });
  }

  // Try by order ID first
  const orderId = parseInt(number.replace(/[^0-9]/g, ''), 10);
  
  const order = await prisma.order.findFirst({
    where: {
      OR: [
        ...(isNaN(orderId) ? [] : [{ id: orderId }]),
        { trackingNumber: number },
      ],
    },
    include: {
      items: {
        include: { product: { select: { name: true } } },
      },
    },
  });

  if (!order) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({
    id: order.id,
    customerName: order.customerName,
    wilaya: order.wilaya,
    status: order.status,
    trackingNumber: order.trackingNumber,
    createdAt: order.createdAt,
    totalAmount: order.totalAmount,
    items: order.items.map((item: { product: { name: string }; quantity: number; price: number }) => ({
      productName: item.product.name,
      quantity: item.quantity,
      price: item.price,
    })),
  });
}
