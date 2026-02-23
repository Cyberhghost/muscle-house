import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  imageUrl: z.string().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id: Number(id) } });
  if (!category) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(category);
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

  const category = await prisma.category.update({ where: { id: Number(id) }, data: parsed.data });
  return NextResponse.json(category);
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const authResult = requireAdmin(req);
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { id } = await params;
  await prisma.category.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
