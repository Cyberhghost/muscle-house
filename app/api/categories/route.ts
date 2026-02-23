import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';

const categorySchema = z.object({
  name: z.string().min(1),
  imageUrl: z.string(),
  displayOrder: z.number().int().min(0).optional(),
});

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: 'asc' },
    include: { _count: { select: { products: { where: { isActive: true } } } } },
  });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const authResult = requireAdmin(req);
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const body = await req.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const category = await prisma.category.create({ data: parsed.data });
  return NextResponse.json(category, { status: 201 });
}
