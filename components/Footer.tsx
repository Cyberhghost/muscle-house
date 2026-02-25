import Link from 'next/link';
import { Phone, MapPin, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0a1628] border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* À propos */}
          <div>
            <h3 className="text-[#00d4aa] font-bold text-lg mb-4">
              MUSCLE HOUSE DZ<span className="text-white">.</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Votre spécialiste en compléments alimentaires et nutrition sportive en Algérie. Produits 100% authentiques,
              livraison rapide dans les 48 wilayas.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-[#00d4aa] flex-shrink-0" />
                <a href="tel:+213561727883" className="hover:text-[#00d4aa] transition-colors">
                  0561 72 78 83
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-[#00d4aa] flex-shrink-0" />
                <a href="tel:+213557532895" className="hover:text-[#00d4aa] transition-colors">
                  0557 53 28 95
                </a>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-[#00d4aa] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
                <a href="https://wa.me/213561727883" target="_blank" rel="noopener noreferrer" className="hover:text-[#00d4aa] transition-colors">
                  WhatsApp 1
                </a>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-[#00d4aa] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
                <a href="https://wa.me/213557532895" target="_blank" rel="noopener noreferrer" className="hover:text-[#00d4aa] transition-colors">
                  WhatsApp 2
                </a>
              </div>
            </div>
          </div>

          {/* Notre magasin */}
          <div>
            <h4 className="font-semibold text-white mb-4">Notre Magasin</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <a
                href="https://share.google/IySlRsGSU7mvHTsgf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#00d4aa] transition-colors"
              >
                <MapPin size={14} className="text-[#00d4aa] flex-shrink-0" />
                Voir sur Google Maps
              </a>
              <p className="text-gray-500 text-xs mt-2">Algérie — Livraison 48 wilayas</p>
              <Link href="/tracking" className="block hover:text-[#00d4aa] transition-colors mt-2">
                Suivre ma commande
              </Link>
            </div>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h4 className="font-semibold text-white mb-4">Réseaux Sociaux</h4>
            <div className="space-y-3">
              <a
                href="https://www.facebook.com/share/17foL6TEka/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#00d4aa] transition-colors"
              >
                <Facebook size={16} className="text-[#00d4aa]" />
                Facebook
              </a>
              <a
                href="https://www.instagram.com/muscle.house_dz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#00d4aa] transition-colors"
              >
                <Instagram size={16} className="text-[#00d4aa]" />
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-xs text-gray-500">
            © 2025 Muscle House DZ — Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  );
}