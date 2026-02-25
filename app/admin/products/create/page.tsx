'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, Upload, Trash2, GripVertical } from 'lucide-react';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
}

interface ProductFormData {
  name: string;
  categoryId: string;
  description: string;
  price: string;
  comparePrice: string;
  stock: string;
  isNew: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  isPack: boolean;
  displayOrder: string;
}

export default function CreateProduct() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    categoryId: '',
    description: '',
    price: '',
    comparePrice: '',
    stock: '0',
    isNew: false,
    isFeatured: false,
    isOnSale: false,
    isPack: false,
    displayOrder: '0',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = [...images, ...files];
    setImages(newImages);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Drag & drop pour réorganiser
  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    const newImages = [...images];
    const newPreviews = [...imagePreviews];

    const [movedImage] = newImages.splice(dragIndex, 1);
    const [movedPreview] = newPreviews.splice(dragIndex, 1);

    newImages.splice(index, 0, movedImage);
    newPreviews.splice(index, 0, movedPreview);

    setImages(newImages);
    setImagePreviews(newPreviews);
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!formData.name || !formData.categoryId || !formData.price) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      const price = parseFloat(formData.price);
      if (isNaN(price) || price < 0) {
        throw new Error('Prix invalide');
      }

      // Upload images via FormData
      const uploadedUrls: string[] = [];
      for (const image of images) {
        const fd = new FormData();
        fd.append('file', image);
        const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        if (!uploadRes.ok) throw new Error("Erreur lors de l'upload d'une image");
        const uploadData = await uploadRes.json();
        uploadedUrls.push(uploadData.url);
      }

      const payload = {
        name: formData.name,
        categoryId: parseInt(formData.categoryId),
        description: formData.description,
        price: price,
        promoPrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
        stock: parseInt(formData.stock),
        imageUrl: uploadedUrls[0] || '/images/placeholder.svg',
        displayOrder: parseInt(formData.displayOrder) || 0,
        freeShipping: false,
      };

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la création du produit');
      }

      setSuccess(true);
      setTimeout(() => router.push('/admin/products'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Nouveau produit</h1>
        <p className="text-gray-400 mt-1">Créez un nouveau produit</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl">
          Produit créé avec succès ! Redirection...
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

        {/* Tarification & stock */}
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
                name="comparePrice"
                value={formData.comparePrice}
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
                placeholder="0"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#00d4aa] focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">Plus le chiffre est élevé, plus le produit apparaît en premier</p>
            </div>
          </div>
        </div>

        {/* Images - Upload */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">
            Images
            {imagePreviews.length > 0 && (
              <span className="text-sm font-normal text-gray-400 ml-2">
                ({imagePreviews.length} image{imagePreviews.length > 1 ? 's' : ''})
              </span>
            )}
          </h2>

          {/* Zone d'upload */}
          <label className="flex items-center justify-center w-full h-40 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-[#00d4aa] hover:bg-[#00d4aa]/5 transition-all group">
            <div className="text-center">
              <Upload className="w-10 h-10 text-gray-500 mx-auto mb-3 group-hover:text-[#00d4aa] transition-colors" />
              <span className="text-sm text-gray-400 group-hover:text-gray-300">Cliquez pour télécharger des images</span>
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

          {/* Previews avec drag & drop */}
          {imagePreviews.length > 0 && (
            <div className="mt-6">
              <p className="text-xs text-gray-500 mb-3">↕ Glissez pour réorganiser • La 1ère image sera l&#39;image principale</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`relative group rounded-xl overflow-hidden border-2 transition-all cursor-grab active:cursor-grabbing ${
                      index === 0 ? 'border-[#00d4aa] ring-2 ring-[#00d4aa]/20' : 'border-white/10 hover:border-white/30'
                    } ${dragIndex === index ? 'opacity-50 scale-95' : ''}`}
                  >
                    <div className="aspect-square relative">
                      <img
                        src={preview}
                        alt={`Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full transition-all hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {/* Badge image principale */}
                      {index === 0 && (
                        <span className="absolute top-2 left-2 bg-[#00d4aa] text-[#0a0a0a] text-xs font-bold px-2 py-1 rounded-lg">
                          Principale
                        </span>
                      )}
                      {/* Grip icon */}
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

        {/* Options */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Options</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: 'isNew', label: 'Nouveau produit', desc: 'Affiche le badge "NEW"' },
              { name: 'isFeatured', label: 'Produit en vedette', desc: 'Apparaît sur la page d\'accueil' },
              { name: 'isOnSale', label: 'En promotion', desc: 'Affiche le badge "PROMO"' },
              { name: 'isPack', label: 'Pack', desc: 'C\'est un pack de produits' },
            ].map((option) => (
              <label
                key={option.name}
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  formData[option.name as keyof ProductFormData]
                    ? 'border-[#00d4aa]/30 bg-[#00d4aa]/5'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <input
                  type="checkbox"
                  name={option.name}
                  checked={formData[option.name as keyof ProductFormData] as boolean}
                  onChange={handleInputChange}
                  className="mt-0.5 w-4 h-4 rounded accent-[#00d4aa]"
                />
                <div>
                  <span className="text-sm font-medium text-white">{option.label}</span>
                  <p className="text-xs text-gray-500 mt-0.5">{option.desc}</p>
                </div>
              </label>
            ))}
          </div>
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
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#00d4aa] text-[#0a0a0a] font-bold rounded-xl hover:bg-[#00b894] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}