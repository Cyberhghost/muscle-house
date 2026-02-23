import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';

const updateSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'IN_DELIVERY', 'DELIVERED', 'CANCELLED']).optional(),
  trackingNumber: z.string().optional(),
});

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  const authResult = requireAdmin(req);
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id: Number(id) },
    include: {
      items: { include: { product: { select: { id: true, name: true, imageUrl: true } } } },
    },
  });
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(order);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const authResult = requireAdmin(req);
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const order = await prisma.order.update({ where: { id: Number(id) }, data: parsed.data });
  return NextResponse.json(order);
}
