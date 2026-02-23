import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nouveautés',
  description: 'Découvrez nos derniers produits',
};

export default async function NouveautesPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    take: 24,
  }).catch(() => []);

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-4xl font-black text-white mb-3">
          NOUVEAUTÉS<span className="text-[#00d4aa]">.</span>
        </h1>
        <p className="text-gray-400 mb-12">Nos derniers produits</p>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={{ ...product, isNew: true }} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p>Aucun nouveau produit pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
