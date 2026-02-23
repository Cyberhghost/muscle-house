import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import CheckoutClient from './CheckoutClient';

export const metadata: Metadata = {
  title: 'Commander',
  description: 'Finalisez votre commande',
};

export default async function CheckoutPage() {
  const shippingFees = await prisma.shippingFee.findMany({
    orderBy: { wilaya: 'asc' },
  }).catch(() => []);

  const settings = await prisma.settings.findFirst().catch(() => null);

  return (
    <CheckoutClient
      shippingFees={shippingFees}
      freeShippingAll={settings?.freeShippingAll ?? false}
    />
  );
}
