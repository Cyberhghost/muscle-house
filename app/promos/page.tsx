import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Promotions',
  description: 'Découvrez toutes nos offres promotionnelles',
};

export default async function PromosPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true, promoPrice: { not: null } },
    orderBy: { displayOrder: 'asc' },
  }).catch(() => []);

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-4xl font-black text-white mb-3">
          PROMOTIONS<span className="text-[#00d4aa]">.</span>
        </h1>
        <p className="text-gray-400 mb-12">Profitez de nos meilleures offres</p>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={{ ...product, isPromo: true }} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p>Aucune promotion disponible pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
