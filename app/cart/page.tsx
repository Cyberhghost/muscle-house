'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={64} className="text-gray-600 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-3">Votre panier est vide</h1>
          <p className="text-gray-400 mb-8">Ajoutez des produits pour commencer vos achats</p>
          <Link
            href="/categories"
            className="bg-[#00d4aa] text-[#0a0a0a] font-bold px-8 py-4 rounded-xl hover:bg-[#00b894] transition-colors"
          >
            Découvrir nos produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-black text-white mb-10">
          MON PANIER<span className="text-[#00d4aa]">.</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 bg-[#111] border border-white/10 rounded-xl p-4">
                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-[#1a1a1a]">
                  <Image
                    src={item.imageUrl || '/images/placeholder.svg'}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white text-sm line-clamp-2 mb-1">{item.name}</h3>
                  <p className="text-[#00d4aa] font-bold">{item.price.toLocaleString('fr-DZ')} DA</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="flex items-center gap-2 bg-[#0a0a0a] border border-white/10 rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:text-[#00d4aa]"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:text-[#00d4aa]"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-[#111] border border-white/10 rounded-xl p-6 h-fit">
            <h2 className="font-bold text-white text-lg mb-6">Récapitulatif</h2>
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-gray-400">
                  <span className="line-clamp-1 flex-1 mr-2">{item.name} x{item.quantity}</span>
                  <span className="flex-shrink-0">{(item.price * item.quantity).toLocaleString('fr-DZ')} DA</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-4 mb-6">
              <div className="flex justify-between font-bold text-white">
                <span>Sous-total</span>
                <span className="text-[#00d4aa]">{totalPrice().toLocaleString('fr-DZ')} DA</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">+ frais de livraison selon wilaya</p>
            </div>
            <Link
              href="/checkout"
              className="w-full bg-[#00d4aa] text-[#0a0a0a] font-bold py-4 rounded-xl hover:bg-[#00b894] transition-colors text-center block"
            >
              Passer la commande
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
