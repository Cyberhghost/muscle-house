'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface Category {
  id: number;
  name: string;
  imageUrl: string;
  displayOrder: number;
  _count?: { products: number };
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => { if (!cancelled) { setCategories(data); setLoading(false); } });
    return () => { cancelled = true; };
  }, [refreshKey]);

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette catégorie?')) return;
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    setRefreshKey((k) => k + 1);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-white">Catégories</h1>
        <button
          onClick={() => { setEditCategory(null); setShowModal(true); }}
          className="bg-[#00d4aa] text-[#0a0a0a] font-bold px-4 py-2 rounded-xl hover:bg-[#00b894] transition-colors flex items-center gap-2 text-sm"
        >
          <Plus size={16} />
          Nouvelle catégorie
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-[#00d4aa]">Chargement...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-[#111] border border-white/10 rounded-2xl p-4 flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#1a1a1a] flex-shrink-0">
                <Image src={cat.imageUrl || '/images/placeholder.svg'} alt={cat.name} fill className="object-cover" sizes="64px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium">{cat.name}</p>
                <p className="text-gray-400 text-xs mt-1">{cat._count?.products ?? 0} produits · Ordre: {cat.displayOrder}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setEditCategory(cat); setShowModal(true); }} className="p-2 text-gray-400 hover:text-[#00d4aa]">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(cat.id)} className="p-2 text-gray-400 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {categories.length === 0 && !loading && (
        <div className="text-center py-10 text-gray-500">Aucune catégorie</div>
      )}

      {showModal && (
        <CategoryModal
          category={editCategory}
          onClose={() => setShowModal(false)}
          onSave={() => { setShowModal(false); setRefreshKey((k) => k + 1); }}
        />
      )}
    </div>
  );
}

function CategoryModal({ category, onClose, onSave }: { category: Category | null; onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState({
    name: category?.name || '',
    imageUrl: category?.imageUrl || '',
    displayOrder: category?.displayOrder?.toString() || '0',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = { name: form.name, imageUrl: form.imageUrl, displayOrder: parseInt(form.displayOrder, 10) };
    const url = category ? `/api/categories/${category.id}` : '/api/categories';
    const method = category ? 'PATCH' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setLoading(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-md">
        <h2 className="font-bold text-white text-lg mb-6">{category ? 'Modifier' : 'Nouvelle'} catégorie</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Nom *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full bg-[#0a0a0a] border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4aa]" />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">URL Image</label>
            <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." className="w-full bg-[#0a0a0a] border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4aa]" />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Ordre d&apos;affichage</label>
            <input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: e.target.value })} min="0" className="w-full bg-[#0a0a0a] border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4aa]" />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 border border-white/20 text-gray-400 py-2 rounded-xl text-sm">Annuler</button>
            <button type="submit" disabled={loading} className="flex-1 bg-[#00d4aa] text-[#0a0a0a] font-bold py-2 rounded-xl text-sm">{loading ? '...' : 'Sauvegarder'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
