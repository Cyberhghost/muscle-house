import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const authResult = requireAdmin(req);
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    todayOrders,
    totalOrders,
    pendingOrders,
    totalRevenue,
    totalProducts,
    totalCategories,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: today } } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: { in: ['CONFIRMED', 'SHIPPED', 'IN_DELIVERY', 'DELIVERED'] } },
    }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.category.count(),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { items: { include: { product: { select: { name: true } } } } },
    }),
  ]);

  return NextResponse.json({
    todayOrders,
    totalOrders,
    pendingOrders,
    totalRevenue: totalRevenue._sum.totalAmount ?? 0,
    totalProducts,
    totalCategories,
    recentOrders,
  });
}
