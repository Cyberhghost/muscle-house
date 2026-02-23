import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';

const settingsSchema = z.object({
  freeShippingAll: z.boolean().optional(),
  deliveryApiKey: z.string().optional(),
  deliveryApiUrl: z.string().url().optional().or(z.literal('')),
});

export async function GET(req: NextRequest) {
  const authResult = requireAdmin(req);
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  let settings = await prisma.settings.findFirst();
  if (!settings) {
    settings = await prisma.settings.create({ data: {} });
  }
  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  const authResult = requireAdmin(req);
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const body = await req.json();
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  let settings = await prisma.settings.findFirst();
  if (!settings) {
    settings = await prisma.settings.create({ data: parsed.data });
  } else {
    settings = await prisma.settings.update({ where: { id: settings.id }, data: parsed.data });
  }

  return NextResponse.json(settings);
}
