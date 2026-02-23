import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-[#00d4aa] text-8xl font-black mb-6">404</p>
        <h1 className="text-3xl font-bold text-white mb-3">Page introuvable</h1>
        <p className="text-gray-400 mb-8">La page que vous cherchez n&apos;existe pas ou a été déplacée.</p>
        <Link
          href="/"
          className="bg-[#00d4aa] text-[#0a0a0a] font-bold px-8 py-4 rounded-xl hover:bg-[#00b894] transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
