'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart, Truck, Search, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems());
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f1d33]/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 font-bold text-xl tracking-tight">
            MUSCLE HOUSE DZ
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d4aa] inline-block ml-1"></span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium hover:text-[#00d4aa] transition-colors">
              Accueil
            </Link>
            <Link href="/categories" className="text-sm font-medium hover:text-[#00d4aa] transition-colors">
              Catégories
            </Link>
            <Link href="/promos" className="text-sm font-medium hover:text-[#00d4aa] transition-colors">
              Promos
            </Link>
            <Link href="/nouveautes" className="text-sm font-medium hover:text-[#00d4aa] transition-colors">
              Nouveautés
            </Link>
            <Link
              href="/tracking"
              className="flex items-center gap-1.5 text-sm font-medium hover:text-[#00d4aa] transition-colors"
            >
              <Truck size={16} className="text-[#00d4aa]" />
              Suivre mon colis
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:text-[#00d4aa] transition-colors"
              aria-label="Rechercher"
            >
              <Search size={20} />
            </button>

            <Link href="/tracking" className="p-2 hover:text-[#00d4aa] transition-colors md:hidden" aria-label="Suivi">
              <Truck size={20} />
            </Link>

            <Link href="/cart" className="relative p-2 hover:text-[#00d4aa] transition-colors" aria-label="Panier">
              <ShoppingCart size={20} />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#00d4aa] text-[#0f1d33] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 hover:text-[#00d4aa] transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="py-3 border-t border-white/10">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un produit..."
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#00d4aa] transition-colors"
                autoFocus
              />
              <button type="submit" className="bg-[#00d4aa] text-[#0f1d33] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#00b894] transition-colors">
                Rechercher
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 space-y-3">
            <Link href="/" onClick={() => setMenuOpen(false)} className="block text-sm font-medium hover:text-[#00d4aa] transition-colors py-2">
              Accueil
            </Link>
            <Link href="/categories" onClick={() => setMenuOpen(false)} className="block text-sm font-medium hover:text-[#00d4aa] transition-colors py-2">
              Catégories
            </Link>
            <Link href="/promos" onClick={() => setMenuOpen(false)} className="block text-sm font-medium hover:text-[#00d4aa] transition-colors py-2">
              Promos
            </Link>
            <Link href="/nouveautes" onClick={() => setMenuOpen(false)} className="block text-sm font-medium hover:text-[#00d4aa] transition-colors py-2">
              Nouveautés
            </Link>
            <Link
              href="/tracking"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-1.5 text-sm font-medium hover:text-[#00d4aa] transition-colors py-2"
            >
              <Truck size={16} className="text-[#00d4aa]" />
              Suivre mon colis
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}