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
  imageUrl: z.string().min(1).optional(),
  displayOrder: z.number().int().min(0).optional(),
  freeShipping: z.boolean().optional(),
});

/* =========================
   GET
========================= */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = requireAdmin(request);
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    // 🔥 IMPORTANT (NEXT 15)
    const { id } = await context.params;

    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);

  } catch (error) {
    console.error('🔥 GET PRODUCT ERROR:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

/* =========================
   PUT
========================= */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = requireAdmin(request);
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await prisma.product.update({
      where: { id: Number(id) },
      data: parsed.data,
    });

    return NextResponse.json(updated);

  } catch (error) {
    console.error('🔥 UPDATE PRODUCT ERROR:', error);
    return NextResponse.json(
      { error: 'Erreur mise à jour' },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE
========================= */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = requireAdmin(request);
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = await context.params;

    await prisma.product.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('🔥 DELETE PRODUCT ERROR:', error);
    return NextResponse.json(
      { error: 'Erreur suppression' },
      { status: 500 }
    );
  }
}