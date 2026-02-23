'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Truck } from 'lucide-react';

const ALGERIAN_PHONE_REGEX = /^0[5-7]\d{8}$/;

interface ShippingFee {
  id: number;
  wilaya: string;
  fee: number;
}

interface Props {
  shippingFees: ShippingFee[];
  freeShippingAll: boolean;
}

export default function CheckoutClient({ shippingFees, freeShippingAll }: Props) {
  const { items, totalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    address: '',
    wilaya: '',
  });

  const selectedWilaya = shippingFees.find((w) => w.wilaya === form.wilaya);
  const shippingCost = freeShippingAll
    ? 0
    : selectedWilaya?.fee ?? 0;

  const subtotal = totalPrice();
  const total = subtotal + shippingCost;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.customerName.trim()) newErrors.customerName = 'Nom requis';
    if (!form.phone.trim() || !ALGERIAN_PHONE_REGEX.test(form.phone)) newErrors.phone = 'Numéro invalide (ex: 0561727883)';
    if (!form.address.trim()) newErrors.address = 'Adresse requise';
    if (!form.wilaya) newErrors.wilaya = 'Wilaya requise';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            productId: i.id,
            quantity: i.quantity,
            price: i.price,
          })),
          totalAmount: total,
        }),
      });

      if (!res.ok) throw new Error('Erreur lors de la commande');
      const data = await res.json();
      setOrderId(data.id);
      clearCart();
      setSuccess(true);
    } catch {
      setErrors({ submit: 'Erreur lors de la commande. Réessayez.' });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !success) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Votre panier est vide</p>
          <Link href="/categories" className="text-[#00d4aa] hover:underline">Découvrir nos produits</Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <CheckCircle size={64} className="text-[#00d4aa] mx-auto mb-6" />
          <h1 className="text-3xl font-black text-white mb-3">Commande Confirmée !</h1>
          <p className="text-gray-400 mb-4">
            Votre commande #{orderId} a été reçue avec succès.
          </p>
          <p className="text-gray-400 mb-8">
            Nous vous contacterons sous peu pour confirmer la livraison.
            Vous pouvez suivre votre commande avec le numéro <span className="text-[#00d4aa] font-bold">#{orderId}</span>.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/tracking" className="bg-[#00d4aa] text-[#0a0a0a] font-bold px-6 py-3 rounded-xl hover:bg-[#00b894] transition-colors">
              Suivre ma commande
            </Link>
            <Link href="/" className="border border-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/5 transition-colors">
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-black text-white mb-10">
          FINALISER LA COMMANDE<span className="text-[#00d4aa]">.</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
              <h2 className="font-bold text-white text-lg mb-6 flex items-center gap-2">
                <Truck size={20} className="text-[#00d4aa]" />
                Informations de livraison
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Nom complet *</label>
                  <input
                    type="text"
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    placeholder="Votre nom et prénom"
                    className={`w-full bg-[#0a0a0a] border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#00d4aa] transition-colors ${errors.customerName ? 'border-red-500' : 'border-white/20'}`}
                  />
                  {errors.customerName && <p className="text-red-400 text-xs mt-1">{errors.customerName}</p>}
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Téléphone *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="0561727883"
                    className={`w-full bg-[#0a0a0a] border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#00d4aa] transition-colors ${errors.phone ? 'border-red-500' : 'border-white/20'}`}
                  />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Wilaya *</label>
                  <select
                    value={form.wilaya}
                    onChange={(e) => setForm({ ...form, wilaya: e.target.value })}
                    className={`w-full bg-[#0a0a0a] border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00d4aa] transition-colors ${errors.wilaya ? 'border-red-500' : 'border-white/20'}`}
                  >
                    <option value="">Sélectionnez votre wilaya</option>
                    {shippingFees.map((sf) => (
                      <option key={sf.id} value={sf.wilaya}>
                        {sf.wilaya} {freeShippingAll ? '(Livraison gratuite)' : `(${sf.fee.toLocaleString('fr-DZ')} DA)`}
                      </option>
                    ))}
                  </select>
                  {errors.wilaya && <p className="text-red-400 text-xs mt-1">{errors.wilaya}</p>}
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Adresse complète *</label>
                  <textarea
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Rue, quartier, bâtiment..."
                    rows={3}
                    className={`w-full bg-[#0a0a0a] border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#00d4aa] transition-colors resize-none ${errors.address ? 'border-red-500' : 'border-white/20'}`}
                  />
                  {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-[#1a3a5c]/20 border border-[#1a3a5c] rounded-2xl p-5">
              <p className="text-white font-medium mb-1">💳 Paiement à la livraison</p>
              <p className="text-gray-400 text-sm">Vous payez uniquement à la réception de votre commande. Aucun paiement en ligne requis.</p>
            </div>

            {errors.submit && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl">
                {errors.submit}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00d4aa] text-[#0a0a0a] font-bold py-4 rounded-xl hover:bg-[#00b894] transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Traitement...' : `Confirmer la commande — ${total.toLocaleString('fr-DZ')} DA`}
            </button>
          </form>

          {/* Order Summary */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 h-fit">
            <h2 className="font-bold text-white text-lg mb-6">Votre commande</h2>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-[#1a1a1a]">
                    <Image
                      src={item.imageUrl || '/images/placeholder.svg'}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs line-clamp-2">{item.name}</p>
                    <p className="text-gray-400 text-xs">x{item.quantity}</p>
                  </div>
                  <p className="text-[#00d4aa] text-sm font-medium flex-shrink-0">
                    {(item.price * item.quantity).toLocaleString('fr-DZ')} DA
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Sous-total</span>
                <span>{subtotal.toLocaleString('fr-DZ')} DA</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>Livraison ({form.wilaya || '—'})</span>
                <span className={shippingCost === 0 ? 'text-[#00d4aa]' : ''}>
                  {shippingCost === 0 ? 'Gratuit' : `${shippingCost.toLocaleString('fr-DZ')} DA`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-white text-lg pt-2">
                <span>Total</span>
                <span className="text-[#00d4aa]">{total.toLocaleString('fr-DZ')} DA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
