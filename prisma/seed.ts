import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

// Adapter PostgreSQL (Prisma 7)
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

const wilayas = [
  { code: 1, name: "Adrar", fee: 800 },
  { code: 2, name: "Chlef", fee: 400 },
  { code: 3, name: "Laghouat", fee: 600 },
  { code: 4, name: "Oum El Bouaghi", fee: 500 },
  { code: 5, name: "Batna", fee: 500 },
  { code: 6, name: "Béjaïa", fee: 400 },
  { code: 7, name: "Biskra", fee: 600 },
  { code: 8, name: "Béchar", fee: 800 },
  { code: 9, name: "Blida", fee: 300 },
  { code: 10, name: "Bouira", fee: 350 },
  { code: 11, name: "Tamanrasset", fee: 1200 },
  { code: 12, name: "Tébessa", fee: 550 },
  { code: 13, name: "Tlemcen", fee: 500 },
  { code: 14, name: "Tiaret", fee: 450 },
  { code: 15, name: "Tizi Ouzou", fee: 350 },
  { code: 16, name: "Alger", fee: 250 },
  { code: 17, name: "Djelfa", fee: 550 },
  { code: 18, name: "Jijel", fee: 450 },
  { code: 19, name: "Sétif", fee: 450 },
  { code: 20, name: "Saïda", fee: 500 },
  { code: 21, name: "Skikda", fee: 450 },
  { code: 22, name: "Sidi Bel Abbès", fee: 500 },
  { code: 23, name: "Annaba", fee: 450 },
  { code: 24, name: "Guelma", fee: 500 },
  { code: 25, name: "Constantine", fee: 400 },
  { code: 26, name: "Médéa", fee: 350 },
  { code: 27, name: "Mostaganem", fee: 450 },
  { code: 28, name: "M'Sila", fee: 500 },
  { code: 29, name: "Mascara", fee: 450 },
  { code: 30, name: "Ouargla", fee: 700 },
  { code: 31, name: "Oran", fee: 400 },
  { code: 32, name: "El Bayadh", fee: 700 },
  { code: 33, name: "Illizi", fee: 1200 },
  { code: 34, name: "Bordj Bou Arréridj", fee: 450 },
  { code: 35, name: "Boumerdès", fee: 300 },
  { code: 36, name: "El Tarf", fee: 500 },
  { code: 37, name: "Tindouf", fee: 1200 },
  { code: 38, name: "Tissemsilt", fee: 500 },
  { code: 39, name: "El Oued", fee: 650 },
  { code: 40, name: "Khenchela", fee: 550 },
  { code: 41, name: "Souk Ahras", fee: 500 },
  { code: 42, name: "Tipaza", fee: 300 },
  { code: 43, name: "Mila", fee: 450 },
  { code: 44, name: "Aïn Defla", fee: 350 },
  { code: 45, name: "Naâma", fee: 700 },
  { code: 46, name: "Aïn Témouchent", fee: 500 },
  { code: 47, name: "Ghardaïa", fee: 700 },
  { code: 48, name: "Relizane", fee: 450 },
  { code: 49, name: "Timimoun", fee: 900 },
  { code: 50, name: "Bordj Badji Mokhtar", fee: 1200 },
  { code: 51, name: "Ouled Djellal", fee: 600 },
  { code: 52, name: "Béni Abbès", fee: 900 },
  { code: 53, name: "In Salah", fee: 1000 },
  { code: 54, name: "In Guezzam", fee: 1300 },
  { code: 55, name: "Touggourt", fee: 650 },
  { code: 56, name: "Djanet", fee: 1200 },
  { code: 57, name: "El M'Ghair", fee: 650 },
  { code: 58, name: "El Meniaa", fee: 700 },
];

async function main() {
  // Seed shipping fees
  for (const w of wilayas) {
    await prisma.shippingFee.upsert({
      where: { wilaya: w.name },
      update: { fee: w.fee },
      create: {
        wilaya: w.name,
        fee: w.fee,
      },
    });
  }

  // Seed default admin
  const hashedPassword = await bcrypt.hash("admin", 12);

  await prisma.admin.upsert({
    where: { email: "admin@email.com" },
    update: {},
    create: {
      email: "admin@email.com",
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
    { name: "Protéines", imageUrl: "/images/categories/proteines.jpg", displayOrder: 1 },
    { name: "Créatine", imageUrl: "/images/categories/creatine.jpg", displayOrder: 2 },
    { name: "Brûleurs de Graisses", imageUrl: "/images/categories/burners.jpg", displayOrder: 3 },
    { name: "Vitamines & Minéraux", imageUrl: "/images/categories/vitamins.jpg", displayOrder: 4 },
    { name: "Pré-Workout", imageUrl: "/images/categories/preworkout.jpg", displayOrder: 5 },
    { name: "Packs & Combos", imageUrl: "/images/categories/packs.jpg", displayOrder: 6 },
  ];

  for (const cat of categories) {
    const existing = await prisma.category.findFirst({
      where: { name: cat.name },
    });

    if (!existing) {
      await prisma.category.create({ data: cat });
    }
  }

  console.log("✅ Seed completed successfully!");
  console.log("Admin credentials: admin@email.com / admin");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });