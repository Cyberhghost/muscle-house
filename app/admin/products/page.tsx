'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  price: number;
  promoPrice?: number | null;
  stock: number;
  imageUrl: string;
  isActive: boolean;
  displayOrder: number;
  category: { name: string };
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    const res = await fetch(`/api/products${params}`);
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce produit?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-white">Produits</h1>
        <button
          onClick={() => { setEditProduct(null); setShowModal(true); }}
          className="bg-[#00d4aa] text-[#0a0a0a] font-bold px-4 py-2 rounded-xl hover:bg-[#00b894] transition-colors flex items-center gap-2 text-sm"
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
          className="w-full bg-[#111] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00d4aa] transition-colors"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-10 text-[#00d4aa]">Chargement...</div>
      ) : (
        <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
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
                  <tr key={product.id} className="border-t border-white/5 hover:bg-white/2">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#1a1a1a] flex-shrink-0">
                          <Image
                            src={product.imageUrl || '/images/placeholder.svg'}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <span className="text-white font-medium line-clamp-1">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{product.category?.name}</td>
                    <td className="px-4 py-3">
                      <span className="text-[#00d4aa]">{product.price.toLocaleString('fr-DZ')} DA</span>
                      {product.promoPrice && (
                        <span className="text-red-400 text-xs ml-1">→ {product.promoPrice.toLocaleString('fr-DZ')}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={product.stock > 0 ? 'text-green-400' : 'text-red-400'}>{product.stock}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{product.displayOrder}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${product.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {product.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setEditProduct(product); setShowModal(true); }}
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
            <div className="text-center py-10 text-gray-500">Aucun produit trouvé</div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ProductModal
          product={editProduct}
          onClose={() => setShowModal(false)}
          onSave={() => { setShowModal(false); fetchProducts(); }}
        />
      )}
    </div>
  );
}

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: () => void;
}

function ProductModal({ product, onClose, onSave }: ProductModalProps) {
  const [form, setForm] = useState({
    name: product?.name || '',
    description: '',
    price: product?.price?.toString() || '',
    promoPrice: product?.promoPrice?.toString() || '',
    stock: product?.stock?.toString() || '0',
    categoryId: '',
    imageUrl: product?.imageUrl || '',
    displayOrder: product?.displayOrder?.toString() || '0',
    freeShipping: false,
    isActive: product?.isActive ?? true,
  });
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/categories').then((r) => r.json()).then((data) => {
      setCategories(data);
      if (!product && data.length > 0) setForm((f) => ({ ...f, categoryId: data[0].id.toString() }));
    });
    if (product) {
      fetch(`/api/products/${product.id}`).then((r) => r.json()).then((data) => {
        setForm({
          name: data.name,
          description: data.description,
          price: data.price.toString(),
          promoPrice: data.promoPrice?.toString() || '',
          stock: data.stock.toString(),
          categoryId: data.categoryId.toString(),
          imageUrl: data.imageUrl,
          displayOrder: data.displayOrder.toString(),
          freeShipping: data.freeShipping,
          isActive: data.isActive,
        });
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      promoPrice: form.promoPrice ? parseFloat(form.promoPrice) : null,
      stock: parseInt(form.stock, 10),
      categoryId: parseInt(form.categoryId, 10),
      imageUrl: form.imageUrl,
      displayOrder: parseInt(form.displayOrder, 10),
      freeShipping: form.freeShipping,
      isActive: form.isActive,
    };

    const url = product ? `/api/products/${product.id}` : '/api/products';
    const method = product ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Erreur');
      onSave();
    } catch {
      setError('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <h2 className="font-bold text-white text-lg mb-6">{product ? 'Modifier' : 'Nouveau'} produit</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs text-gray-400 mb-1 block">Nom *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full bg-[#0a0a0a] border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4aa]" />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-400 mb-1 block">Description *</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} className="w-full bg-[#0a0a0a] border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4aa] resize-none" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Prix (DA) *</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required min="0" className="w-full bg-[#0a0a0a] border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4aa]" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Prix promo (DA)</label>
              <input type="number" value={form.promoPrice} onChange={(e) => setForm({ ...form, promoPrice: e.target.value })} min="0" className="w-full bg-[#0a0a0a] border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4aa]" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Stock</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} min="0" className="w-full bg-[#0a0a0a] border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4aa]" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Catégorie *</label>
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required className="w-full bg-[#0a0a0a] border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4aa]">
                <option value="">Sélectionner</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-400 mb-1 block">URL Image</label>
              <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." className="w-full bg-[#0a0a0a] border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4aa]" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Ordre d&apos;affichage</label>
              <input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: e.target.value })} min="0" className="w-full bg-[#0a0a0a] border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4aa]" />
            </div>
            <div className="flex items-center gap-4 pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.freeShipping} onChange={(e) => setForm({ ...form, freeShipping: e.target.checked })} className="accent-[#00d4aa]" />
                <span className="text-xs text-gray-400">Livraison gratuite</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-[#00d4aa]" />
                <span className="text-xs text-gray-400">Actif</span>
              </label>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-white/20 text-gray-400 py-2 rounded-xl text-sm hover:bg-white/5">
              Annuler
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-[#00d4aa] text-[#0a0a0a] font-bold py-2 rounded-xl text-sm hover:bg-[#00b894] disabled:opacity-50">
              {loading ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
