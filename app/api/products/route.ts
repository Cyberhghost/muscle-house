import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  promoPrice: z.number().positive().nullable().optional(),
  stock: z.number().int().min(0),
  categoryId: z.number().int().positive(),
  imageUrl: z.string().url(),
  displayOrder: z.number().int().min(0).optional(),
  freeShipping: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get('categoryId');
  const search = searchParams.get('search');
  const promoOnly = searchParams.get('promo') === 'true';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  const where: Record<string, unknown> = { isActive: true };
  if (categoryId) where.categoryId = Number(categoryId);
  if (promoOnly) where.promoPrice = { not: null };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { category: { select: { id: true, name: true } } },
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ products, total, page, limit });
}

export async function POST(req: NextRequest) {
  const authResult = requireAdmin(req);
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const product = await prisma.product.create({ data: parsed.data });
  return NextResponse.json(product, { status: 201 });
}
