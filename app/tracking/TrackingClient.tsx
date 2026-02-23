'use client';

import { useState } from 'react';
import { Search, Package, CheckCircle, Truck, MapPin, Clock } from 'lucide-react';

const statusSteps = [
  { key: 'PENDING', label: 'En attente', icon: Clock, description: 'Commande reçue' },
  { key: 'CONFIRMED', label: 'Confirmée', icon: CheckCircle, description: 'Commande confirmée' },
  { key: 'SHIPPED', label: 'Expédiée', icon: Package, description: 'Remise au transporteur' },
  { key: 'IN_DELIVERY', label: 'En livraison', icon: Truck, description: 'En cours de livraison' },
  { key: 'DELIVERED', label: 'Livrée', icon: MapPin, description: 'Commande livrée' },
];

interface OrderData {
  id: number;
  customerName: string;
  wilaya: string;
  status: string;
  trackingNumber?: string | null;
  createdAt: string;
  items: Array<{ productName: string; quantity: number; price: number }>;
  totalAmount: number;
}

export default function TrackingClient() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`/api/tracking?number=${encodeURIComponent(trackingNumber.trim())}`);
      if (!res.ok) {
        setError('Commande introuvable. Vérifiez votre numéro de suivi.');
        return;
      }
      const data = await res.json();
      setOrder(data);
    } catch {
      setError('Erreur de connexion. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = order
    ? statusSteps.findIndex((s) => s.key === order.status)
    : -1;

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-4xl font-black text-white mb-3">
          SUIVI COMMANDE<span className="text-[#00d4aa]">.</span>
        </h1>
        <p className="text-gray-400 mb-10">Entrez votre numéro de commande ou de suivi</p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-10">
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Ex: CMD-2025-001 ou numéro de tracking"
            className="flex-1 bg-[#111] border border-white/20 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#00d4aa] transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#00d4aa] text-[#0a0a0a] font-bold px-6 py-4 rounded-xl hover:bg-[#00b894] transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Search size={18} />
            {loading ? 'Recherche...' : 'Suivre'}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-4 rounded-xl mb-8">
            {error}
          </div>
        )}

        {/* Order Result */}
        {order && (
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-gray-400 text-sm">Commande #{order.id}</p>
                <p className="text-white font-bold text-lg">{order.customerName}</p>
                <p className="text-gray-400 text-sm">{order.wilaya}</p>
              </div>
              <div className="text-right">
                <p className="text-[#00d4aa] font-bold text-lg">{order.totalAmount.toLocaleString('fr-DZ')} DA</p>
                <p className="text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString('fr-DZ')}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const Icon = step.icon;

                return (
                  <div key={step.key} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCompleted
                            ? 'bg-[#00d4aa] text-[#0a0a0a]'
                            : 'bg-[#1a1a1a] text-gray-600 border border-white/10'
                        } ${isCurrent ? 'ring-2 ring-[#00d4aa] ring-offset-2 ring-offset-[#111]' : ''}`}
                      >
                        <Icon size={18} />
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div
                          className={`w-0.5 h-8 mt-1 ${
                            index < currentStepIndex ? 'bg-[#00d4aa]' : 'bg-white/10'
                          }`}
                        />
                      )}
                    </div>
                    <div className="pt-2">
                      <p className={`font-medium text-sm ${isCompleted ? 'text-white' : 'text-gray-600'}`}>
                        {step.label}
                      </p>
                      <p className={`text-xs ${isCompleted ? 'text-gray-400' : 'text-gray-700'}`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Items */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Articles commandés</h3>
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-300">{item.productName} x{item.quantity}</span>
                    <span className="text-[#00d4aa]">{(item.price * item.quantity).toLocaleString('fr-DZ')} DA</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
