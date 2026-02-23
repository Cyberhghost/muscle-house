'use client';

import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

interface Settings {
  id: number;
  freeShippingAll: boolean;
  deliveryApiKey?: string | null;
  deliveryApiUrl?: string | null;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deliveryApiKey: settings.deliveryApiKey,
        deliveryApiUrl: settings.deliveryApiUrl,
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div className="text-center py-10 text-[#00d4aa]">Chargement...</div>;
  if (!settings) return null;

  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-8">Paramètres</h1>

      <div className="max-w-xl space-y-6">
        {/* API Delivery */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold text-white mb-5">Configuration API Livraison</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Clé API</label>
              <input
                type="password"
                value={settings.deliveryApiKey || ''}
                onChange={(e) => setSettings({ ...settings, deliveryApiKey: e.target.value })}
                placeholder="sk_live_..."
                className="w-full bg-[#0a0a0a] border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#00d4aa] transition-colors"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">URL API</label>
              <input
                type="url"
                value={settings.deliveryApiUrl || ''}
                onChange={(e) => setSettings({ ...settings, deliveryApiUrl: e.target.value })}
                placeholder="https://api.livraison.dz"
                className="w-full bg-[#0a0a0a] border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#00d4aa] transition-colors"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-[#00d4aa] text-[#0a0a0a] font-bold px-6 py-3 rounded-xl hover:bg-[#00b894] transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? 'Sauvegarde...' : saved ? '✓ Sauvegardé' : 'Sauvegarder'}
            </button>
          </div>
        </div>

        {/* Admin Info */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold text-white mb-3">Informations</h2>
          <div className="text-sm text-gray-400 space-y-2">
            <p>Version: 1.0.0</p>
            <p>Stack: Next.js 14 + TypeScript + Prisma + PostgreSQL</p>
            <p>Hébergement: Hostinger Business</p>
          </div>
        </div>
      </div>
    </div>
  );
}
