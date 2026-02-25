'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

interface Product {
  id: number;
  name: string;
  price: number;
  promoPrice?: number | null;
  imageUrl: string;
  isNew?: boolean;
  isPromo?: boolean;
  freeShipping?: boolean;
}

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  const displayPrice = product.promoPrice ?? product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: displayPrice,
      imageUrl: product.imageUrl,
    });
  };

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="bg-[#152238] border border-white/10 rounded-xl overflow-hidden hover:border-[#00d4aa]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#00d4aa]/5">
        <div className="relative aspect-square overflow-hidden bg-[#1a2a4a]">
          <Image
            src={product.imageUrl || '/images/placeholder.svg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.promoPrice && product.promoPrice < product.price && (
              <span className="bg-[#e53e3e] text-white text-xs font-bold px-2 py-0.5 rounded">
                PROMO
              </span>
            )}
            {product.isNew && (
              <span className="bg-[#00d4aa] text-[#0f1d33] text-xs font-bold px-2 py-0.5 rounded">
                NEW
              </span>
            )}
            {product.freeShipping && (
              <span className="bg-[#1a2a4a] text-white text-xs px-2 py-0.5 rounded">
                Livraison gratuite
              </span>
            )}
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-medium text-sm text-white line-clamp-2 mb-2 group-hover:text-[#00d4aa] transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[#00d4aa] font-bold text-lg">
                {displayPrice.toLocaleString('fr-DZ')} DA
              </span>
              {product.promoPrice && product.promoPrice < product.price && (
                <span className="text-gray-500 text-sm line-through ml-2">
                  {product.price.toLocaleString('fr-DZ')} DA
                </span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-[#00d4aa] text-[#0f1d33] p-2 rounded-lg hover:bg-[#00b894] transition-colors"
              aria-label="Ajouter au panier"
            >
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}