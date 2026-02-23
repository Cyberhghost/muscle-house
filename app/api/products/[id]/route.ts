import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  promoPrice: z.number().positive().nullable().optional(),
  stock: z.number().int().min(0).optional(),
  categoryId: z.number().int().positive().optional(),
  imageUrl: z.string().url().optional(),
  displayOrder: z.number().int().min(0).optional(),
  freeShipping: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: { category: true },
  });
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(product);
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

  const product = await prisma.product.update({
    where: { id: Number(id) },
    data: parsed.data,
  });
  return NextResponse.json(product);
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const authResult = requireAdmin(req);
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { id } = await params;
  await prisma.product.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
