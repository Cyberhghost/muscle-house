'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  price: number;
  promoPrice?: number | null;
  stock: number;
  imageUrl: string;
  isActive: boolean;
  displayOrder: number;
  category?: { name: string };
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const params = search ? `?search=${encodeURIComponent(search)}` : '';

    fetch(`/api/admin/products${params}`)
      .then((r) => {
        if (!r.ok) throw new Error('Erreur API');
        return r.json();
      })
      .then((data) => {
        if (!cancelled) {
          // ✅ FIX ICI : l'API retourne directement un tableau
          setProducts(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProducts([]);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [search, refreshKey]);

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce produit ?')) return;

    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    setRefreshKey((k) => k + 1);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-white">Produits</h1>

        <button
          onClick={() => router.push('/admin/products/create')}
          className="bg-[#00d4aa] text-[#0f1d33] font-bold px-4 py-2 rounded-xl hover:bg-[#00b894] transition-colors flex items-center gap-2 text-sm"
        >
          <Plus size={16} />
          Nouveau produit
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un produit..."
          className="w-full bg-[#152238] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#00d4aa] transition-colors"
        />
      </div>

      {loading ? (
        <div className="text-center py-10 text-[#00d4aa]">Chargement...</div>
      ) : (
        <div className="bg-[#152238] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr className="text-gray-400">
                  <th className="text-left px-4 py-3 font-medium">Produit</th>
                  <th className="text-left px-4 py-3 font-medium">Catégorie</th>
                  <th className="text-left px-4 py-3 font-medium">Prix</th>
                  <th className="text-left px-4 py-3 font-medium">Stock</th>
                  <th className="text-left px-4 py-3 font-medium">Ordre</th>
                  <th className="text-left px-4 py-3 font-medium">Statut</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-t border-white/5 hover:bg-[#1a2a4a]/60"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#1a2a4a] flex-shrink-0">
                          <Image
                            src={product.imageUrl || '/images/placeholder.svg'}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <span className="text-white font-medium line-clamp-1">
                          {product.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-gray-400">
                      {product.category?.name || '-'}
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-[#00d4aa]">
                        {product.price.toLocaleString('fr-DZ')} DA
                      </span>
                      {product.promoPrice && (
                        <span className="text-red-400 text-xs ml-1">
                          → {product.promoPrice.toLocaleString('fr-DZ')} DA
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={
                          product.stock > 0
                            ? 'text-green-400'
                            : 'text-red-400'
                        }
                      >
                        {product.stock}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-gray-400">
                      {product.displayOrder}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          product.isActive
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {product.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            router.push(
                              `/admin/products/${product.id}/edit`
                            )
                          }
                          className="p-2 text-gray-400 hover:text-[#00d4aa] transition-colors"
                        >
                          <Pencil size={14} />
                        </button>

                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {products.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              Aucun produit trouvé
            </div>
          )}
        </div>
      )}
    </div>
  );
}