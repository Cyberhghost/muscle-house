import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';

const feeSchema = z.object({
  wilaya: z.string().min(1),
  fee: z.number().min(0),
});

export async function GET() {
  const fees = await prisma.shippingFee.findMany({ orderBy: { wilaya: 'asc' } });
  return NextResponse.json(fees);
}

export async function PUT(req: NextRequest) {
  const authResult = requireAdmin(req);
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const body = await req.json();
  const parsed = feeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const fee = await prisma.shippingFee.upsert({
    where: { wilaya: parsed.data.wilaya },
    update: { fee: parsed.data.fee },
    create: parsed.data,
  });

  return NextResponse.json(fee);
}
