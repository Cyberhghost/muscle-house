'use client';

import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

interface ShippingFee {
  id: number;
  wilaya: string;
  fee: number;
}

export default function AdminShipping() {
  const [fees, setFees] = useState<ShippingFee[]>([]);
  const [freeShippingAll, setFreeShippingAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/shipping').then((r) => r.json()),
      fetch('/api/settings').then((r) => r.json()),
    ]).then(([feesData, settingsData]) => {
      setFees(feesData);
      setFreeShippingAll(settingsData.freeShippingAll);
      setLoading(false);
    });
  }, []);

  const saveFee = async (wilaya: string, fee: number) => {
    setSaving(wilaya);
    await fetch('/api/shipping', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wilaya, fee }),
    });
    setSaving(null);
  };

  const toggleFreeShipping = async () => {
    const newVal = !freeShippingAll;
    setFreeShippingAll(newVal);
    await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ freeShippingAll: newVal }),
    });
  };

  if (loading) return <div className="text-center py-10 text-[#00d4aa]">Chargement...</div>;

  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-8">Gestion Livraison</h1>

      {/* Free Shipping Toggle */}
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium">Livraison gratuite globale</p>
            <p className="text-gray-400 text-sm mt-1">Activer la livraison gratuite pour toutes les commandes</p>
          </div>
          <button
            onClick={toggleFreeShipping}
            className={`relative w-14 h-7 rounded-full transition-all ${freeShippingAll ? 'bg-[#00d4aa]' : 'bg-gray-700'}`}
          >
            <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all ${freeShippingAll ? 'left-8' : 'left-1'}`} />
          </button>
        </div>
      </div>

      {/* Fees Table */}
      <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="font-bold text-white">Frais par wilaya</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr className="text-gray-400">
                <th className="text-left px-4 py-3 font-medium">Wilaya</th>
                <th className="text-left px-4 py-3 font-medium">Frais (DA)</th>
                <th className="text-right px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((fee) => (
                <FeeRow key={fee.id} fee={fee} saving={saving === fee.wilaya} onSave={saveFee} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FeeRow({ fee, saving, onSave }: { fee: ShippingFee; saving: boolean; onSave: (wilaya: string, fee: number) => void }) {
  const [value, setValue] = useState(fee.fee.toString());

  return (
    <tr className="border-t border-white/5">
      <td className="px-4 py-2 text-white">{fee.wilaya}</td>
      <td className="px-4 py-2">
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          min="0"
          className="bg-[#0a0a0a] border border-white/20 rounded-lg px-3 py-1 text-white text-sm w-28 focus:outline-none focus:border-[#00d4aa]"
        />
      </td>
      <td className="px-4 py-2">
        <button
          onClick={() => onSave(fee.wilaya, parseFloat(value))}
          disabled={saving}
          className="flex items-center gap-1 ml-auto bg-[#00d4aa]/10 text-[#00d4aa] px-3 py-1 rounded-lg text-xs hover:bg-[#00d4aa]/20 disabled:opacity-50"
        >
          <Save size={12} />
          {saving ? '...' : 'Sauver'}
        </button>
      </td>
    </tr>
  );
}
