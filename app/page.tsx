import { prisma } from '@/lib/prisma';
import HeroSection from '@/components/HeroSection';
import CategoriesSection from '@/components/CategoriesSection';
import ProductsSection from '@/components/ProductsSection';

export default async function HomePage() {
  const [categories, promoProducts, newProducts] = await Promise.all([
    prisma.category.findMany({
      orderBy: { displayOrder: 'asc' },
      take: 6,
    }).catch(() => []),
    prisma.product.findMany({
      where: { isActive: true, promoPrice: { not: null } },
      orderBy: { displayOrder: 'asc' },
      take: 8,
      include: { category: true },
    }).catch(() => []),
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: { category: true },
    }).catch(() => []),
  ]);

  return (
    <>
      <HeroSection />
      <CategoriesSection categories={categories} />
      <ProductsSection title="Promotions" products={promoProducts} showPromoBadge />
      <ProductsSection title="Nouveautés" products={newProducts} showNewBadge />
    </>
  );
}
