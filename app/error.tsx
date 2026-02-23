'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-[#e53e3e] text-6xl font-black mb-6">!</p>
        <h1 className="text-3xl font-bold text-white mb-3">Quelque chose s&apos;est mal passé</h1>
        <p className="text-gray-400 mb-8">Une erreur inattendue est survenue.</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-[#00d4aa] text-[#0a0a0a] font-bold px-8 py-4 rounded-xl hover:bg-[#00b894] transition-colors"
          >
            Réessayer
          </button>
          <Link
            href="/"
            className="border border-white/20 text-white px-8 py-4 rounded-xl hover:bg-white/5 transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
