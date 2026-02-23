import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const wilayas = [
  { wilaya: 'Adrar', fee: 800 },
  { wilaya: 'Chlef', fee: 400 },
  { wilaya: 'Laghouat', fee: 600 },
  { wilaya: 'Oum El Bouaghi', fee: 500 },
  { wilaya: 'Batna', fee: 500 },
  { wilaya: 'Béjaïa', fee: 400 },
  { wilaya: 'Biskra', fee: 600 },
  { wilaya: 'Béchar', fee: 800 },
  { wilaya: 'Blida', fee: 300 },
  { wilaya: 'Bouira', fee: 350 },
  { wilaya: 'Tamanrasset', fee: 1200 },
  { wilaya: 'Tébessa', fee: 550 },
  { wilaya: 'Tlemcen', fee: 500 },
  { wilaya: 'Tiaret', fee: 450 },
  { wilaya: 'Tizi Ouzou', fee: 350 },
  { wilaya: 'Alger', fee: 250 },
  { wilaya: 'Djelfa', fee: 550 },
  { wilaya: 'Jijel', fee: 450 },
  { wilaya: 'Sétif', fee: 450 },
  { wilaya: 'Saïda', fee: 500 },
  { wilaya: 'Skikda', fee: 450 },
  { wilaya: 'Sidi Bel Abbès', fee: 500 },
  { wilaya: 'Annaba', fee: 450 },
  { wilaya: 'Guelma', fee: 500 },
  { wilaya: 'Constantine', fee: 400 },
  { wilaya: 'Médéa', fee: 350 },
  { wilaya: 'Mostaganem', fee: 450 },
  { wilaya: "M'Sila", fee: 500 },
  { wilaya: 'Mascara', fee: 450 },
  { wilaya: 'Ouargla', fee: 700 },
  { wilaya: 'Oran', fee: 400 },
  { wilaya: 'El Bayadh', fee: 700 },
  { wilaya: 'Illizi', fee: 1200 },
  { wilaya: 'Bordj Bou Arréridj', fee: 450 },
  { wilaya: 'Boumerdès', fee: 300 },
  { wilaya: 'El Tarf', fee: 500 },
  { wilaya: 'Tindouf', fee: 1200 },
  { wilaya: 'Tissemsilt', fee: 500 },
  { wilaya: 'El Oued', fee: 650 },
  { wilaya: 'Khenchela', fee: 550 },
  { wilaya: 'Souk Ahras', fee: 500 },
  { wilaya: 'Tipaza', fee: 300 },
  { wilaya: 'Mila', fee: 450 },
  { wilaya: 'Aïn Defla', fee: 350 },
  { wilaya: 'Naâma', fee: 700 },
  { wilaya: 'Aïn Témouchent', fee: 500 },
  { wilaya: 'Ghardaïa', fee: 700 },
  { wilaya: 'Relizane', fee: 450 },
];

async function main() {
  // Seed shipping fees
  for (const w of wilayas) {
    await prisma.shippingFee.upsert({
      where: { wilaya: w.wilaya },
      update: { fee: w.fee },
      create: w,
    });
  }

  // Seed default admin
  const hashedPassword = await bcrypt.hash('admin123', 12);
  await prisma.admin.upsert({
    where: { email: 'admin@musclehouse.dz' },
    update: {},
    create: {
      email: 'admin@musclehouse.dz',
      password: hashedPassword,
    },
  });

  // Seed settings
  const settingsCount = await prisma.settings.count();
  if (settingsCount === 0) {
    await prisma.settings.create({
      data: { freeShippingAll: false },
    });
  }

  // Seed sample categories
  const categories = [
    { name: 'Protéines', imageUrl: '/images/categories/proteines.jpg', displayOrder: 1 },
    { name: 'Créatine', imageUrl: '/images/categories/creatine.jpg', displayOrder: 2 },
    { name: 'Brûleurs de Graisses', imageUrl: '/images/categories/burners.jpg', displayOrder: 3 },
    { name: 'Vitamines & Minéraux', imageUrl: '/images/categories/vitamins.jpg', displayOrder: 4 },
    { name: 'Pré-Workout', imageUrl: '/images/categories/preworkout.jpg', displayOrder: 5 },
    { name: 'Packs & Combos', imageUrl: '/images/categories/packs.jpg', displayOrder: 6 },
  ];

  for (const cat of categories) {
    const existing = await prisma.category.findFirst({ where: { name: cat.name } });
    if (!existing) {
      await prisma.category.create({ data: cat });
    }
  }

  console.log('✅ Seed completed successfully!');
  console.log('Admin credentials: admin@musclehouse.dz / admin123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
