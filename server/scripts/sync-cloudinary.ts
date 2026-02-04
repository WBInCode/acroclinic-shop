// Synchronizacja po nazwach plików
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Mapowanie nazw plików na dane produktów
const PRODUCT_MAPPING: Record<string, {
  name: string;
  slug: string;
  description: string;
  price: number;
  category: 'clothing' | 'accessories';
  badge?: string;
  isBestseller?: boolean;
}> = {
  // ODZIEŻ
  'bluza': {
    name: 'Bluza Regular Dziecięca',
    slug: 'bluza-regular-dziecieca',
    description: 'Klasyczna bluza dla dzieci, idealna do treningu i na co dzień.',
    price: 159.99,
    category: 'clothing',
    badge: 'LIMITED',
  },
  'bluzka': {
    name: 'Koszulka Bokserka',
    slug: 'koszulka-bokserka',
    description: 'Wygodna koszulka bokserka dla dzieci, idealna do treningu akrobatyki.',
    price: 99.99,
    category: 'clothing',
    badge: 'NEW',
    isBestseller: true,
  },
  'legginsy': {
    name: 'Legginsy',
    slug: 'legginsy',
    description: 'Wygodne legginsy do treningu, elastyczny materiał.',
    price: 144.99,
    category: 'clothing',
    badge: 'LIMITED',
    isBestseller: true,
  },
  'spodenki': {
    name: 'Spodenki Kolarki',
    slug: 'spodenki-kolarki',
    description: 'Elastyczne spodenki kolarki do ćwiczeń.',
    price: 89.99,
    category: 'clothing',
    badge: 'NEW',
    isBestseller: true,
  },
  'spodnie': {
    name: 'Dresy Jogger Dziecięce',
    slug: 'dresy-jogger-dzieciece',
    description: 'Wygodne dresy jogger dla dzieci.',
    price: 149.99,
    category: 'clothing',
  },
  'sweter': {
    name: 'Longsleeve Dziecięcy',
    slug: 'longsleeve-dzieciecy',
    description: 'Ciepły longsleeve z długim rękawem.',
    price: 99.99,
    category: 'clothing',
  },
  't-shirt': {
    name: 'T-shirt Dziecięcy',
    slug: 't-shirt-dzieciecy',
    description: 'Oddychający t-shirt dla aktywnych dzieci.',
    price: 89.99,
    category: 'clothing',
    isBestseller: true,
  },
  'top': {
    name: 'Top Sportowy',
    slug: 'top-sportowy',
    description: 'Lekki top sportowy dla dziewczynek.',
    price: 99.99,
    category: 'clothing',
  },

  // GUMY (taśmy gimnastyczne)
  'guma-fioletowa': {
    name: 'Taśma Gimnastyczna Fioletowa',
    slug: 'tasma-gimnastyczna-fioletowa',
    description: 'Elastyczna taśma gimnastyczna do rozciągania, 90 cm.',
    price: 49.99,
    category: 'accessories',
    badge: 'NEW',
  },
  'guma-rozowa': {
    name: 'Taśma Gimnastyczna Różowa',
    slug: 'tasma-gimnastyczna-rozowa',
    description: 'Elastyczna taśma gimnastyczna do rozciągania, 90 cm.',
    price: 49.99,
    category: 'accessories',
    isBestseller: true,
  },
  'guma-zielona': {
    name: 'Taśma Gimnastyczna Zielona',
    slug: 'tasma-gimnastyczna-zielona',
    description: 'Elastyczna taśma gimnastyczna do rozciągania, 90 cm.',
    price: 49.99,
    category: 'accessories',
  },

  // KOSTKI (do jogi)
  'kostka-czarna': {
    name: 'Kostka do Jogi Czarna',
    slug: 'kostka-do-jogi-czarna',
    description: 'Piankowa kostka do jogi i ćwiczeń.',
    price: 39.99,
    category: 'accessories',
  },
  'kostka-niebieska': {
    name: 'Kostka do Jogi Niebieska',
    slug: 'kostka-do-jogi-niebieska',
    description: 'Piankowa kostka do jogi i ćwiczeń.',
    price: 39.99,
    category: 'accessories',
    isBestseller: true,
  },
  'kostka-rozowa': {
    name: 'Kostka do Jogi Różowa',
    slug: 'kostka-do-jogi-rozowa',
    description: 'Piankowa kostka do jogi i ćwiczeń.',
    price: 39.99,
    category: 'accessories',
    badge: 'NEW',
  },
  'kostka-szara': {
    name: 'Kostka do Jogi Szara',
    slug: 'kostka-do-jogi-szara',
    description: 'Piankowa kostka do jogi i ćwiczeń.',
    price: 39.99,
    category: 'accessories',
  },
  // Długie nazwy z Cloudinary - KOSTKI
  'pol-pl-kostka-piankowa-do-jogi-szara-291': {
    name: 'Kostka do Jogi Szara',
    slug: 'kostka-do-jogi-szara',
    description: 'Piankowa kostka do jogi i ćwiczeń.',
    price: 39.99,
    category: 'accessories',
  },
  'pol-pm-kostka-piankowa-do-jogi-czarna-74': {
    name: 'Kostka do Jogi Czarna',
    slug: 'kostka-do-jogi-czarna',
    description: 'Piankowa kostka do jogi i ćwiczeń.',
    price: 39.99,
    category: 'accessories',
  },
  'pol-pl-kostka-piankowa-do-jogi-czarna-74': {
    name: 'Kostka do Jogi Czarna',
    slug: 'kostka-do-jogi-czarna',
    description: 'Piankowa kostka do jogi i ćwiczeń.',
    price: 39.99,
    category: 'accessories',
  },
  'pol-pl-kostka-piankowa-do-jogi-rozowa-290': {
    name: 'Kostka do Jogi Różowa',
    slug: 'kostka-do-jogi-rozowa',
    description: 'Piankowa kostka do jogi i ćwiczeń.',
    price: 39.99,
    category: 'accessories',
    badge: 'NEW',
  },
  'pol-pl-kostka-piankowa-do-jogi-niebieska-73': {
    name: 'Kostka do Jogi Niebieska',
    slug: 'kostka-do-jogi-niebieska',
    description: 'Piankowa kostka do jogi i ćwiczeń.',
    price: 39.99,
    category: 'accessories',
    isBestseller: true,
  },
  // Długie nazwy z Cloudinary - GUMY/TAŚMY
  'pol-pl-tasma-gimnastyczna-do-rozciagania-90-cm-fioletowa-415': {
    name: 'Taśma Gimnastyczna Fioletowa',
    slug: 'tasma-gimnastyczna-fioletowa',
    description: 'Elastyczna taśma gimnastyczna do rozciągania, 90 cm.',
    price: 49.99,
    category: 'accessories',
    badge: 'NEW',
  },
  'pol-pl-tasma-gimnastyczna-do-rozciagania-90-cm-rozowa-416': {
    name: 'Taśma Gimnastyczna Różowa',
    slug: 'tasma-gimnastyczna-rozowa',
    description: 'Elastyczna taśma gimnastyczna do rozciągania, 90 cm.',
    price: 49.99,
    category: 'accessories',
    isBestseller: true,
  },
  'pol-pl-tasma-gimnastyczna-do-rozciagania-90-cm-zielona-414': {
    name: 'Taśma Gimnastyczna Zielona',
    slug: 'tasma-gimnastyczna-zielona',
    description: 'Elastyczna taśma gimnastyczna do rozciągania, 90 cm.',
    price: 49.99,
    category: 'accessories',
  },
};

// Funkcja do wyciągnięcia nazwy produktu z nazwy pliku
function extractProductName(publicId: string): string | null {
  const filename = publicId.split('/').pop() || publicId;
  
  // Wzorzec: nazwa_-_numer_losoweid (np. top_-_1_xesh5a -> top)
  const match1 = filename.match(/^(.+?)_-_\d+_/i);
  if (match1) {
    return match1[1].toLowerCase().replace(/_/g, '-');
  }
  
  // Wzorzec: nazwa_numer_losoweid (np. bluza_1_abc123 -> bluza)
  const match2 = filename.match(/^(.+?)_\d+_/i);
  if (match2) {
    return match2[1].toLowerCase().replace(/_/g, '-');
  }
  
  // Wzorzec bez losowego ID: nazwa_numer
  const match3 = filename.match(/^(.+?)_(\d+)$/i);
  if (match3) {
    return match3[1].toLowerCase().replace(/_/g, '-');
  }
  
  return null;
}

async function syncProducts() {
  console.log('🔄 Synchronizacja produktów z Cloudinary...\n');

  try {
    // Pobierz wszystkie zasoby
    const allResources = await cloudinary.api.resources({
      type: 'upload',
      max_results: 500,
    });

    console.log(`📊 Znaleziono ${allResources.resources.length} plików\n`);

    // Grupuj zdjęcia po nazwie produktu
    const productImages: Record<string, { publicId: string; url: string; number: number }[]> = {};

    for (const resource of allResources.resources) {
      const productName = extractProductName(resource.public_id);
      
      if (!productName) {
        console.log(`⚠️  Nie rozpoznano: ${resource.public_id}`);
        continue;
      }

      // Wyciągnij numer zdjęcia
      const numberMatch = resource.public_id.match(/_(\d+)_/);
      const number = numberMatch ? parseInt(numberMatch[1]) : 0;

      if (!productImages[productName]) {
        productImages[productName] = [];
      }

      productImages[productName].push({
        publicId: resource.public_id,
        url: resource.secure_url,
        number,
      });
    }

    console.log('\n📦 Znalezione produkty:');
    for (const [name, images] of Object.entries(productImages)) {
      const productInfo = PRODUCT_MAPPING[name];
      const status = productInfo ? '✅' : '❌ BRAK MAPOWANIA';
      console.log(`   ${status} ${name}: ${images.length} zdjęć`);
    }

    // Jeśli uruchomiono z --sync, zapisz do bazy
    if (process.argv.includes('--sync')) {
      console.log('\n🚀 Zapisywanie do bazy danych...\n');

      // Utwórz kategorie
      const clothingCategory = await prisma.category.upsert({
        where: { slug: 'clothing' },
        update: {},
        create: { name: 'Odzież', slug: 'clothing', description: 'Odzież sportowa dla dzieci', position: 1 },
      });

      const accessoriesCategory = await prisma.category.upsert({
        where: { slug: 'accessories' },
        update: {},
        create: { name: 'Akcesoria', slug: 'accessories', description: 'Akcesoria do ćwiczeń', position: 2 },
      });

      for (const [productKey, images] of Object.entries(productImages)) {
        const productInfo = PRODUCT_MAPPING[productKey];
        
        if (!productInfo) {
          console.log(`⏭️  Pomijam ${productKey} (brak mapowania)`);
          continue;
        }

        // Sortuj zdjęcia po numerze
        images.sort((a, b) => a.number - b.number);

        const categoryId = productInfo.category === 'clothing' 
          ? clothingCategory.id 
          : accessoriesCategory.id;

        // Upsert produkt
        const product = await prisma.product.upsert({
          where: { slug: productInfo.slug },
          update: {
            name: productInfo.name,
            description: productInfo.description,
            price: productInfo.price,
            badge: productInfo.badge || null,
            isBestseller: productInfo.isBestseller || false,
            categoryId,
          },
          create: {
            name: productInfo.name,
            slug: productInfo.slug,
            description: productInfo.description,
            price: productInfo.price,
            badge: productInfo.badge || null,
            isBestseller: productInfo.isBestseller || false,
            categoryId,
            stock: 50,
            isActive: true,
          },
        });

        // Usuń stare zdjęcia i dodaj nowe
        await prisma.productImage.deleteMany({ where: { productId: product.id } });
        
        await prisma.productImage.createMany({
          data: images.map((img, index) => ({
            productId: product.id,
            url: img.url,
            isMain: index === 0,
            position: index,
          })),
        });

        console.log(`✅ ${productInfo.name}: ${images.length} zdjęć`);
      }

      // Podsumowanie
      const productCount = await prisma.product.count();
      const imageCount = await prisma.productImage.count();

      console.log(`\n${'='.repeat(50)}`);
      console.log(`🎉 SYNCHRONIZACJA ZAKOŃCZONA!`);
      console.log(`   📦 Produktów: ${productCount}`);
      console.log(`   🖼️  Zdjęć: ${imageCount}`);
      console.log(`${'='.repeat(50)}\n`);
    } else {
      console.log('\n' + '='.repeat(50));
      console.log('Podgląd - aby zapisać do bazy uruchom z flagą --sync:');
      console.log('npx tsx scripts/sync-cloudinary.ts --sync');
      console.log('='.repeat(50) + '\n');
    }

  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await prisma.$disconnect();
  }
}

syncProducts();
