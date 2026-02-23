'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, Truck, Shield, Star, Minus, Plus } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  promoPrice?: number | null;
  imageUrl: string;
  freeShipping: boolean;
  stock: number;
  category: { name: string; id: number };
}

export default function ProductDetailClient({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const displayPrice = product.promoPrice ?? product.price;
  const discount = product.promoPrice
    ? Math.round(((product.price - product.promoPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: displayPrice,
        imageUrl: product.imageUrl,
      });
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-[#00d4aa]">Accueil</Link>
          <span>/</span>
          <Link href={`/categories/${product.category.id}`} className="hover:text-[#00d4aa]">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </nav>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#111]">
            <Image
              src={product.imageUrl || '/images/placeholder.svg'}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {product.promoPrice && (
              <div className="absolute top-4 left-4 bg-[#e53e3e] text-white text-sm font-bold px-3 py-1 rounded-lg">
                -{discount}%
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <Link href={`/categories/${product.category.id}`} className="text-[#00d4aa] text-sm font-medium mb-2 hover:underline">
              {product.category.name}
            </Link>
            <h1 className="text-3xl font-black text-white mb-4">{product.name}</h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-black text-[#00d4aa]">
                {displayPrice.toLocaleString('fr-DZ')} DA
              </span>
              {product.promoPrice && (
                <span className="text-xl text-gray-500 line-through">
                  {product.price.toLocaleString('fr-DZ')} DA
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <span className="text-green-400 text-sm">✓ En stock ({product.stock} disponibles)</span>
              ) : (
                <span className="text-red-400 text-sm">✗ Rupture de stock</span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-300 leading-relaxed mb-8">{product.description}</p>

            {/* Quantity */}
            {product.stock > 0 && (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm text-gray-400">Quantité:</span>
                  <div className="flex items-center gap-2 bg-[#111] border border-white/20 rounded-lg p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:text-[#00d4aa] transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-2 hover:text-[#00d4aa] transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-[#00d4aa] text-[#0a0a0a] font-bold py-4 rounded-xl hover:bg-[#00b894] transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 mb-4"
                >
                  <ShoppingCart size={20} />
                  Ajouter au panier
                </button>
              </>
            )}

            {/* Features */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Truck size={16} className="text-[#00d4aa]" />
                {product.freeShipping ? 'Livraison GRATUITE' : 'Livraison rapide 24/48h'}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Shield size={16} className="text-[#00d4aa]" />
                Produits 100% authentiques garantis
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Star size={16} className="text-[#00d4aa]" />
                Paiement à la livraison uniquement
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-black text-white mb-8">PRODUITS SIMILAIRES<span className="text-[#00d4aa]">.</span></h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
