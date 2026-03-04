import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const authResult = requireAdmin(req);
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: 'asc' },
    select: { id: true, name: true }
  });
  return NextResponse.json({ categories });
}