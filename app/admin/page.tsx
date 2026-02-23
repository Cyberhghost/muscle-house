'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Package, TrendingUp, Clock } from 'lucide-react';

interface DashboardData {
  todayOrders: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCategories: number;
  recentOrders: Array<{
    id: number;
    customerName: string;
    wilaya: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
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

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#00d4aa]">Chargement...</div>
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    { label: 'Commandes aujourd\'hui', value: data.todayOrders, icon: ShoppingBag, color: 'text-[#00d4aa]' },
    { label: 'Commandes en attente', value: data.pendingOrders, icon: Clock, color: 'text-yellow-400' },
    { label: 'Produits actifs', value: data.totalProducts, icon: Package, color: 'text-blue-400' },
    { label: 'Revenus totaux (DA)', value: data.totalRevenue.toLocaleString('fr-DZ'), icon: TrendingUp, color: 'text-green-400' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-[#111] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <Icon size={20} className={stat.color} />
              </div>
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-white">Commandes récentes</h2>
          <Link href="/admin/orders" className="text-[#00d4aa] text-sm hover:underline">
            Voir tout →
          </Link>
        </div>

        {data.recentOrders.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">Aucune commande pour le moment</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b border-white/10">
                  <th className="text-left pb-3 font-medium">#</th>
                  <th className="text-left pb-3 font-medium">Client</th>
                  <th className="text-left pb-3 font-medium">Wilaya</th>
                  <th className="text-left pb-3 font-medium">Total</th>
                  <th className="text-left pb-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                {data.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/2">
                    <td className="py-3 text-gray-400">#{order.id}</td>
                    <td className="py-3 text-white">{order.customerName}</td>
                    <td className="py-3 text-gray-400">{order.wilaya}</td>
                    <td className="py-3 text-[#00d4aa] font-medium">{order.totalAmount.toLocaleString('fr-DZ')} DA</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
