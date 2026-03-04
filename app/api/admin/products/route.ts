import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth'

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  promoPrice: z.number().positive().nullable().optional(),
  stock: z.number().int().min(0),
  categoryId: z.number().int().positive(),
  imageUrl: z.string().min(1),
  displayOrder: z.number().int().min(0).optional(),
  freeShipping: z.boolean().optional(),
  isActive: z.boolean().optional(),
})

/* =========================
   GET (LIST PRODUCTS)
========================= */
export async function GET(req: NextRequest) {
  const authResult = requireAdmin(req)
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    )
  }

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(products)
}

/* =========================
   POST (CREATE PRODUCT)
========================= */
export async function POST(req: NextRequest) {
  const authResult = requireAdmin(req)
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    )
  }

  try {
    const body = await req.json()
    const parsed = productSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: parsed.data,
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}