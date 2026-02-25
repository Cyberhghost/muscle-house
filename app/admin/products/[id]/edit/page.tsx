'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, X, Upload, Trash2, GripVertical } from 'lucide-react';

interface Category {
  id: number;
  name: string;
}

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Images existantes (URLs du serveur)
  const [existingImages, setExistingImages] = useState<string[]>([]);
  // Nouvelles images uploadées (pas encore envoyées)
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragSection, setDragSection] = useState<'existing' | 'new' | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    description: '',
    price: '',
    promoPrice: '',
    stock: '0',
    displayOrder: '0',
    freeShipping: false,
  });

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, [params.id]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/products/${params.id}`);
      if (!response.ok) throw new Error('Produit non trouvé');

      const data = await response.json();
      const prod = data.product ?? data;

      // Le schéma a un seul imageUrl, on le met dans un tableau pour le gérer
      const imgs = prod.imageUrl ? [prod.imageUrl] : [];
      setExistingImages(imgs);

      setFormData({
        name: prod.name ?? '',
        categoryId: prod.categoryId?.toString() ?? '',
        description: prod.description || '',
        price: prod.price?.toString() ?? '',
        promoPrice: prod.promoPrice?.toString() ?? '',
        stock: prod.stock?.toString() ?? '0',
        displayOrder: prod.displayOrder?.toString() ?? '0',
        freeShipping: !!prod.freeShipping,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Upload de nouvelles images
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Drag & drop pour images existantes
  const handleDragStartExisting = (index: number) => {
    setDragIndex(index);
    setDragSection('existing');
  };

  const handleDragOverExisting = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragSection !== 'existing' || dragIndex === null || dragIndex === index) return;
    const arr = [...existingImages];
    const [moved] = arr.splice(dragIndex, 1);
    arr.splice(index, 0, moved);
    setExistingImages(arr);
    setDragIndex(index);
  };

  // Drag & drop pour nouvelles images
  const handleDragStartNew = (index: number) => {
    setDragIndex(index);
    setDragSection('new');
  };

  const handleDragOverNew = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragSection !== 'new' || dragIndex === null || dragIndex === index) return;
    const imgs = [...newImages];
    const previews = [...newImagePreviews];
    const [movedImg] = imgs.splice(dragIndex, 1);
    const [movedPrev] = previews.splice(dragIndex, 1);
    imgs.splice(index, 0, movedImg);
    previews.splice(index, 0, movedPrev);
    setNewImages(imgs);
    setNewImagePreviews(previews);
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragSection(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      if (!formData.name || !formData.categoryId || !formData.price) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      const price = parseFloat(formData.price);
      if (isNaN(price) || price < 0) throw new Error('Prix invalide');

      // Upload les nouvelles images
      const uploadedUrls: string[] = [];
      for (const image of newImages) {
        const fd = new FormData();
        fd.append('file', image);
        const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        if (!uploadRes.ok) throw new Error("Erreur lors de l'upload d'une image");
        const uploadData = await uploadRes.json();
        uploadedUrls.push(uploadData.url);
      }

      // Combiner : existantes + nouvelles
      const allImages = [...existingImages, ...uploadedUrls];

      const payload = {
        name: formData.name,
        categoryId: parseInt(formData.categoryId),
        description: formData.description,
        price: price,
        promoPrice: formData.promoPrice ? parseFloat(formData.promoPrice) : null,
        stock: parseInt(formData.stock),
        imageUrl: allImages[0] || '/images/placeholder.svg',
        displayOrder: parseInt(formData.displayOrder) || 0,
        freeShipping: formData.freeShipping,
      };

      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la mise à jour');
      }

      setSuccess(true);
      setTimeout(() => router.push('/admin/products'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
    try {
      const response = await fetch(`/api/admin/products/${params.id}`, { method: 'DELETE' });
      if (response.ok) {
        router.push('/admin/products');
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch {
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#00d4aa]">Chargement...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Modifier le produit</h1>
          <p className="text-gray-400 mt-1">{formData.name}</p>
        </div>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-2.5 rounded-xl hover:bg-red-500/20 transition-all"
        >
          <Trash2 className="w-4 h-4" />
          Supprimer
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl">
          Produit mis à jour avec succès ! Redirection...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        {/* Informations de base */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Informations de base</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nom du produit <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#00d4aa] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Catégorie <span className="text-red-400">*</span>
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#00d4aa] focus:border-transparent transition-all"
              >
                <option value="" className="bg-[#111]">Sélectionner une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-[#111]">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#00d4aa] focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Tarification */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Tarification & stock</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Prix (DA) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#00d4aa] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Prix promo (DA)</label>
              <input
                type="number"
                step="0.01"
                name="promoPrice"
                value={formData.promoPrice}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#00d4aa] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#00d4aa] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Priorité d&#39;affichage</label>
              <input
                type="number"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#00d4aa] focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">Plus le chiffre est élevé, plus le produit apparaît en premier</p>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">
            Images
            <span className="text-sm font-normal text-gray-400 ml-2">
              ({existingImages.length + newImagePreviews.length} image{existingImages.length + newImagePreviews.length > 1 ? 's' : ''})
            </span>
          </h2>

          {/* Images existantes */}
          {existingImages.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#00d4aa] rounded-full"></span>
                Images actuelles
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {existingImages.map((imageUrl, index) => (
                  <div
                    key={`existing-${index}`}
                    draggable
                    onDragStart={() => handleDragStartExisting(index)}
                    onDragOver={(e) => handleDragOverExisting(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`relative group rounded-xl overflow-hidden border-2 cursor-grab active:cursor-grabbing transition-all ${
                      index === 0 && newImagePreviews.length === 0
                        ? 'border-[#00d4aa] ring-2 ring-[#00d4aa]/20'
                        : 'border-white/10 hover:border-white/30'
                    } ${dragSection === 'existing' && dragIndex === index ? 'opacity-50 scale-95' : ''}`}
                  >
                    <div className="aspect-square relative">
                      <img src={imageUrl} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full transition-all hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {index === 0 && (
                        <span className="absolute top-2 left-2 bg-[#00d4aa] text-[#0a0a0a] text-xs font-bold px-2 py-1 rounded-lg">
                          Principale
                        </span>
                      )}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all">
                        <GripVertical className="w-4 h-4 text-white drop-shadow" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Zone d'upload */}
          <label className="flex items-center justify-center w-full h-40 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-[#00d4aa] hover:bg-[#00d4aa]/5 transition-all group">
            <div className="text-center">
              <Upload className="w-10 h-10 text-gray-500 mx-auto mb-3 group-hover:text-[#00d4aa] transition-colors" />
              <span className="text-sm text-gray-400 group-hover:text-gray-300">Ajouter de nouvelles images</span>
              <p className="text-xs text-gray-600 mt-1">PNG, JPG, WebP • Max 5MB</p>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {/* Nouvelles images */}
          {newImagePreviews.length > 0 && (
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                Nouvelles images (pas encore sauvegardées)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {newImagePreviews.map((preview, index) => (
                  <div
                    key={`new-${index}`}
                    draggable
                    onDragStart={() => handleDragStartNew(index)}
                    onDragOver={(e) => handleDragOverNew(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`relative group rounded-xl overflow-hidden border-2 border-blue-400/30 cursor-grab active:cursor-grabbing transition-all hover:border-blue-400/60 ${
                      dragSection === 'new' && dragIndex === index ? 'opacity-50 scale-95' : ''
                    }`}
                  >
                    <div className="aspect-square relative">
                      <img src={preview} alt={`Nouvelle ${index + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full transition-all hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="absolute top-2 left-2 bg-blue-400 text-white text-xs font-bold px-2 py-1 rounded-lg">
                        Nouvelle
                      </span>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all">
                        <GripVertical className="w-4 h-4 text-white drop-shadow" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-white/10 text-gray-300 rounded-xl hover:bg-white/5 transition-all"
          >
            <X className="w-4 h-4" />
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#00d4aa] text-[#0a0a0a] font-bold rounded-xl hover:bg-[#00b894] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}