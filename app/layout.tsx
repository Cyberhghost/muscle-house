import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Muscle House DZ — Compléments Sportifs Premium',
    template: '%s | Muscle House DZ',
  },
  description:
    'Compléments alimentaires et nutrition sportive 100% authentiques. Livraison rapide 48 wilayas. Support WhatsApp direct.',
  keywords: ['compléments sportifs', 'nutrition sportive', 'protéines', 'Algérie', 'muscle house'],
  openGraph: {
    title: 'Muscle House DZ — Compléments Sportifs Premium',
    description: 'Compléments alimentaires 100% authentiques. Livraison rapide 48 wilayas.',
    url: 'https://musclehouse.dz',
    siteName: 'Muscle House DZ',
    locale: 'fr_DZ',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="font-sans bg-[#0f1d33] text-white">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}