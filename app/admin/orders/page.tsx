'use client';

import { useState, useEffect, useCallback } from 'react';
import { Eye } from 'lucide-react';

interface Order {
  id: number;
  customerName: string;
  phone: string;
  wilaya: string;
  totalAmount: number;
  status: string;
  trackingNumber?: string | null;
  createdAt: string;
  items: Array<{ product: { name: string }; quantity: number; price: number }>;
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-400',
  CONFIRMED: 'bg-blue-500/20 text-blue-400',
  SHIPPED: 'bg-purple-500/20 text-purple-400',
  IN_DELIVERY: 'bg-orange-500/20 text-orange-400',
  DELIVERED: 'bg-green-500/20 text-green-400',
  CANCELLED: 'bg-red-500/20 text-red-400',
};

const statusLabels: Record<string, string> = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmée',
  SHIPPED: 'Expédiée',
  IN_DELIVERY: 'En livraison',
  DELIVERED: 'Livrée',
  CANCELLED: 'Annulée',
};

const statusOptions = Object.entries(statusLabels);

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = useCallback(async () => {
    const params = filterStatus ? `?status=${filterStatus}` : '';
    const res = await fetch(`/api/orders${params}`);
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  }, [filterStatus]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
    if (selectedOrder?.id === id) setSelectedOrder((o) => o ? { ...o, status } : null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-white">Commandes</h1>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-[#111] border border-white/20 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[#00d4aa]"
        >
          <option value="">Tous les statuts</option>
          {statusOptions.map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10 text-[#00d4aa]">Chargement...</div>
      ) : (
        <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr className="text-gray-400">
                  <th className="text-left px-4 py-3 font-medium">#</th>
                  <th className="text-left px-4 py-3 font-medium">Client</th>
                  <th className="text-left px-4 py-3 font-medium">Wilaya</th>
                  <th className="text-left px-4 py-3 font-medium">Total</th>
                  <th className="text-left px-4 py-3 font-medium">Statut</th>
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-white/5 hover:bg-white/2">
                    <td className="px-4 py-3 text-gray-400">#{order.id}</td>
                    <td className="px-4 py-3 text-white">{order.customerName}</td>
                    <td className="px-4 py-3 text-gray-400">{order.wilaya}</td>
                    <td className="px-4 py-3 text-[#00d4aa] font-medium">{order.totalAmount.toLocaleString('fr-DZ')} DA</td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`px-2 py-1 rounded-lg text-xs font-medium cursor-pointer bg-transparent border-0 ${statusColors[order.status]}`}
                      >
                        {statusOptions.map(([key, label]) => (
                          <option key={key} value={key} className="bg-[#111] text-white">{label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString('fr-DZ')}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelectedOrder(order)} className="p-2 text-gray-400 hover:text-[#00d4aa] flex ml-auto">
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && (
            <div className="text-center py-10 text-gray-500">Aucune commande</div>
          )}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-white text-lg">Commande #{selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-gray-400 text-xs">Client</p><p className="text-white">{selectedOrder.customerName}</p></div>
                <div><p className="text-gray-400 text-xs">Téléphone</p><p className="text-white">{selectedOrder.phone}</p></div>
                <div><p className="text-gray-400 text-xs">Wilaya</p><p className="text-white">{selectedOrder.wilaya}</p></div>
                <div><p className="text-gray-400 text-xs">Total</p><p className="text-[#00d4aa] font-bold">{selectedOrder.totalAmount.toLocaleString('fr-DZ')} DA</p></div>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Articles</p>
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-white py-1">
                    <span>{item.product.name} x{item.quantity}</span>
                    <span className="text-[#00d4aa]">{(item.price * item.quantity).toLocaleString('fr-DZ')} DA</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-2">Changer le statut</p>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => updateStatus(selectedOrder.id, key)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${selectedOrder.status === key ? statusColors[key] : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
