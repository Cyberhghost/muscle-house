import type { Metadata } from 'next';
import TrackingClient from './TrackingClient';

export const metadata: Metadata = {
  title: 'Suivi de commande',
  description: 'Suivez votre commande en temps réel',
};

export default function TrackingPage() {
  return <TrackingClient />;
}
