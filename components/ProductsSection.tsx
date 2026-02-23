import Link from 'next/link';
import ProductCard from './ProductCard';

interface Product {
  id: number;
  name: string;
  price: number;
  promoPrice?: number | null;
  imageUrl: string;
  freeShipping: boolean;
}

interface Props {
  title: string;
  products: Product[];
  showPromoBadge?: boolean;
  showNewBadge?: boolean;
  viewAllLink?: string;
}

export default function ProductsSection({ title, products, showPromoBadge, showNewBadge, viewAllLink }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="py-20 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-white">
            {title.toUpperCase()}
            <span className="text-[#00d4aa]">.</span>
          </h2>
          {viewAllLink && (
            <Link href={viewAllLink} className="text-[#00d4aa] text-sm font-medium hover:underline">
              Voir tout →
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                isNew: showNewBadge,
                isPromo: showPromoBadge,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
