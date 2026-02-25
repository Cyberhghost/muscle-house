import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: number;
  name: string;
  imageUrl: string;
}

export default function CategoriesSection({ categories }: { categories: Category[] }) {
  const defaultCategories = [
    { id: 1, name: 'Protéines', imageUrl: '/images/placeholder.svg' },
    { id: 2, name: 'Créatine', imageUrl: '/images/placeholder.svg' },
    { id: 3, name: 'Brûleurs de Graisses', imageUrl: '/images/placeholder.svg' },
    { id: 4, name: 'Vitamines & Minéraux', imageUrl: '/images/placeholder.svg' },
    { id: 5, name: 'Pré-Workout', imageUrl: '/images/placeholder.svg' },
    { id: 6, name: 'Packs & Combos', imageUrl: '/images/placeholder.svg' },
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <section className="bg-[#152238] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
            NOS CATÉGORIES
          </h2>
          <p className="text-gray-400">Trouvez les produits adaptés à vos objectifs</p>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {displayCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.id}`}
              className="flex-none snap-start w-48 sm:w-56 group"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-[#00d4aa] transition-all duration-300 hover:shadow-lg hover:shadow-[#00d4aa]/20">
                <Image
                  src={cat.imageUrl || '/images/placeholder.svg'}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="224px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1d33]/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-bold text-sm">{cat.name}</p>
                  <p className="text-[#00d4aa] text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Voir →
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/categories"
            className="inline-block border-2 border-[#00d4aa] text-[#00d4aa] font-bold px-8 py-3 rounded-lg hover:bg-[#00d4aa] hover:text-[#0f1d33] transition-all"
          >
            Toutes les catégories
          </Link>
        </div>
      </div>
    </section>
  );
}