import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import type { Metadata } from 'next';

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `Recherche: ${q}` : 'Recherche' };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() || '';

  const products = query
    ? await prisma.product.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        orderBy: { displayOrder: 'asc' },
      }).catch(() => [])
    : [];

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-black text-white mb-3">
          {query ? `Résultats pour "${query}"` : 'Recherche'}
          <span className="text-[#00d4aa]">.</span>
        </h1>
        <p className="text-gray-400 mb-12">
          {products.length} résultat{products.length !== 1 ? 's' : ''} trouvé{products.length !== 1 ? 's' : ''}
        </p>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            {query ? (
              <p>Aucun produit trouvé pour &quot;{query}&quot;</p>
            ) : (
              <p>Entrez un terme de recherche</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
