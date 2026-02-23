import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Catégories',
  description: 'Explorez toutes nos catégories de compléments sportifs',
};

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: 'asc' },
    include: {
      _count: { select: { products: { where: { isActive: true } } } },
    },
  }).catch(() => []);

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-4xl font-black text-white mb-3">
          NOS CATÉGORIES<span className="text-[#00d4aa]">.</span>
        </h1>
        <p className="text-gray-400 mb-12">Trouvez les produits adaptés à vos objectifs</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/categories/${cat.id}`} className="group">
              <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-white/10 hover:border-[#00d4aa] transition-all duration-300 hover:shadow-lg hover:shadow-[#00d4aa]/10">
                <Image
                  src={cat.imageUrl || '/images/placeholder.svg'}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 className="text-white font-bold text-xl">{cat.name}</h2>
                  <p className="text-[#00d4aa] text-sm mt-1">
                    {cat._count.products} produit{cat._count.products !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p>Aucune catégorie disponible pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
