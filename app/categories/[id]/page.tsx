import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id: Number(id) } }).catch(() => null);
  if (!category) return { title: 'Catégorie introuvable' };
  return { title: category.name, description: `Découvrez nos produits ${category.name}` };
}

export default async function CategoryPage({ params }: Props) {
  const { id } = await params;
  const category = await prisma.category.findUnique({
    where: { id: Number(id) },
  }).catch(() => null);

  if (!category) notFound();

  const products = await prisma.product.findMany({
    where: { categoryId: Number(id), isActive: true },
    orderBy: { displayOrder: 'asc' },
  }).catch(() => []);

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-[#00d4aa]">Accueil</Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-[#00d4aa]">Catégories</Link>
          <span>/</span>
          <span className="text-white">{category.name}</span>
        </nav>

        <h1 className="text-4xl font-black text-white mb-3">
          {category.name.toUpperCase()}<span className="text-[#00d4aa]">.</span>
        </h1>
        <p className="text-gray-400 mb-12">{products.length} produit{products.length !== 1 ? 's' : ''}</p>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p>Aucun produit dans cette catégorie pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
