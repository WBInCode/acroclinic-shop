import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Tworzenie kategorii
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'clothing' },
      update: {},
      create: {
        name: 'Odzież',
        slug: 'clothing',
        description: 'Odzież sportowa dla dzieci',
        position: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'accessories' },
      update: {},
      create: {
        name: 'Akcesoria',
        slug: 'accessories',
        description: 'Akcesoria do ćwiczeń',
        position: 2,
      },
    }),
  ]);

  console.log('✅ Categories created:', categories.length);

  // Tworzenie produktów
  const clothingCategory = categories.find(c => c.slug === 'clothing');
  const accessoriesCategory = categories.find(c => c.slug === 'accessories');

  const products = [
    // Odzież
    {
      name: 'Koszulka Bokserka',
      slug: 'koszulka-bokserka',
      description: 'Wygodna koszulka bokserka dla dzieci, idealna do treningu akrobatyki.',
      price: 99.99,
      stock: 50,
      badge: 'NEW',
      isBestseller: true,
      categoryId: clothingCategory?.id,
      images: [{ url: '/images/Bluzka - 1.png', isMain: true, position: 0 }],
    },
    {
      name: 'T-shirt Dziecięcy',
      slug: 't-shirt-dzieciecy',
      description: 'Oddychający t-shirt dla aktywnych dzieci.',
      price: 89.99,
      stock: 75,
      isBestseller: true,
      categoryId: clothingCategory?.id,
      images: [{ url: '/images/T-Shirt - 1.png', isMain: true, position: 0 }],
    },
    {
      name: 'Longsleeve Dziecięcy',
      slug: 'longsleeve-dzieciecy',
      description: 'Ciepły longsleeve z długim rękawem.',
      price: 99.99,
      stock: 40,
      categoryId: clothingCategory?.id,
      images: [{ url: '/images/sweter - 1.png', isMain: true, position: 0 }],
    },
    {
      name: 'Spodenki Kolarki',
      slug: 'spodenki-kolarki',
      description: 'Elastyczne spodenki kolarki do ćwiczeń.',
      price: 89.99,
      stock: 60,
      badge: 'NEW',
      isBestseller: true,
      categoryId: clothingCategory?.id,
      images: [{ url: '/images/spodenki - 1.png', isMain: true, position: 0 }],
    },
    {
      name: 'Top Sportowy',
      slug: 'top-sportowy',
      description: 'Lekki top sportowy dla dziewczynek.',
      price: 99.99,
      stock: 45,
      categoryId: clothingCategory?.id,
      images: [{ url: '/images/top - 1.png', isMain: true, position: 0 }],
    },
    {
      name: 'Legginsy',
      slug: 'legginsy',
      description: 'Wygodne legginsy do treningu.',
      price: 144.99,
      stock: 55,
      badge: 'LIMITED',
      isBestseller: true,
      categoryId: clothingCategory?.id,
      images: [{ url: '/images/legginsy 1.png', isMain: true, position: 0 }],
    },
    {
      name: 'Dresy Jogger Dziecięce',
      slug: 'dresy-jogger-dzieciece',
      description: 'Wygodne dresy jogger dla dzieci.',
      price: 149.99,
      stock: 35,
      categoryId: clothingCategory?.id,
      images: [{ url: '/images/spodnie - 1.png', isMain: true, position: 0 }],
    },
    {
      name: 'Bluza Regular Dziecięca',
      slug: 'bluza-regular-dziecieca',
      description: 'Klasyczna bluza dla dzieci.',
      price: 159.99,
      stock: 30,
      badge: 'LIMITED',
      categoryId: clothingCategory?.id,
      images: [{ url: '/images/Bluza - 1.png', isMain: true, position: 0 }],
    },
    // Akcesoria - Gumy
    {
      name: 'Taśma Gimnastyczna Fioletowa',
      slug: 'tasma-gimnastyczna-fioletowa',
      description: 'Elastyczna taśma gimnastyczna do rozciągania, 90 cm.',
      price: 49.99,
      stock: 100,
      badge: 'NEW',
      categoryId: accessoriesCategory?.id,
      images: [
        { url: '/images/gumy/Fioletowa/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-fioletowa-415_1.webp', isMain: true, position: 0 },
        { url: '/images/gumy/Fioletowa/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-fioletowa-415_2.webp', position: 1 },
        { url: '/images/gumy/Fioletowa/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-fioletowa-415_3.webp', position: 2 },
        { url: '/images/gumy/Fioletowa/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-fioletowa-415_4.webp', position: 3 },
        { url: '/images/gumy/Fioletowa/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-fioletowa-415_5.webp', position: 4 },
      ],
    },
    {
      name: 'Taśma Gimnastyczna Różowa',
      slug: 'tasma-gimnastyczna-rozowa',
      description: 'Elastyczna taśma gimnastyczna do rozciągania, 90 cm.',
      price: 49.99,
      stock: 80,
      isBestseller: true,
      categoryId: accessoriesCategory?.id,
      images: [
        { url: '/images/gumy/Rózowa/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-rozowa-416_1.webp', isMain: true, position: 0 },
        { url: '/images/gumy/Rózowa/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-rozowa-416_2.webp', position: 1 },
        { url: '/images/gumy/Rózowa/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-rozowa-416_3.webp', position: 2 },
        { url: '/images/gumy/Rózowa/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-rozowa-416_4.webp', position: 3 },
        { url: '/images/gumy/Rózowa/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-rozowa-416_6.webp', position: 4 },
      ],
    },
    {
      name: 'Taśma Gimnastyczna Zielona',
      slug: 'tasma-gimnastyczna-zielona',
      description: 'Elastyczna taśma gimnastyczna do rozciągania, 90 cm.',
      price: 49.99,
      stock: 90,
      categoryId: accessoriesCategory?.id,
      images: [
        { url: '/images/gumy/Zielona/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-zielona-414_1.webp', isMain: true, position: 0 },
        { url: '/images/gumy/Zielona/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-zielona-414_2.webp', position: 1 },
        { url: '/images/gumy/Zielona/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-zielona-414_4.webp', position: 2 },
        { url: '/images/gumy/Zielona/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-zielona-414_5.webp', position: 3 },
        { url: '/images/gumy/Zielona/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-zielona-414_6.webp', position: 4 },
      ],
    },
    // Akcesoria - Kostki
    {
      name: 'Kostka do Jogi Czarna',
      slug: 'kostka-do-jogi-czarna',
      description: 'Piankowa kostka do jogi i ćwiczeń.',
      price: 39.99,
      stock: 120,
      categoryId: accessoriesCategory?.id,
      images: [
        { url: '/images/kostki/Czarna/pol_pl_Kostka-piankowa-do-jogi-czarna-74_1.webp', isMain: true, position: 0 },
        { url: '/images/kostki/Czarna/pol_pl_Kostka-piankowa-do-jogi-czarna-74_2.webp', position: 1 },
        { url: '/images/kostki/Czarna/pol_pl_Kostka-piankowa-do-jogi-czarna-74_5.webp', position: 2 },
        { url: '/images/kostki/Czarna/pol_pm_Kostka-piankowa-do-jogi-czarna-74_8.webp', position: 3 },
      ],
    },
    {
      name: 'Kostka do Jogi Niebieska',
      slug: 'kostka-do-jogi-niebieska',
      description: 'Piankowa kostka do jogi i ćwiczeń.',
      price: 39.99,
      stock: 100,
      isBestseller: true,
      categoryId: accessoriesCategory?.id,
      images: [
        { url: '/images/kostki/Niebieska/pol_pl_Kostka-piankowa-do-jogi-niebieska-73_1.webp', isMain: true, position: 0 },
        { url: '/images/kostki/Niebieska/pol_pl_Kostka-piankowa-do-jogi-niebieska-73_2.webp', position: 1 },
        { url: '/images/kostki/Niebieska/pol_pl_Kostka-piankowa-do-jogi-niebieska-73_9.webp', position: 2 },
        { url: '/images/kostki/Niebieska/pol_pl_Kostka-piankowa-do-jogi-niebieska-73_10.webp', position: 3 },
      ],
    },
    {
      name: 'Kostka do Jogi Różowa',
      slug: 'kostka-do-jogi-rozowa',
      description: 'Piankowa kostka do jogi i ćwiczeń.',
      price: 39.99,
      stock: 85,
      badge: 'NEW',
      categoryId: accessoriesCategory?.id,
      images: [
        { url: '/images/kostki/Różowa/pol_pl_Kostka-piankowa-do-jogi-rozowa-290_1.webp', isMain: true, position: 0 },
        { url: '/images/kostki/Różowa/pol_pl_Kostka-piankowa-do-jogi-rozowa-290_2.webp', position: 1 },
        { url: '/images/kostki/Różowa/pol_pl_Kostka-piankowa-do-jogi-rozowa-290_4.webp', position: 2 },
        { url: '/images/kostki/Różowa/pol_pl_Kostka-piankowa-do-jogi-rozowa-290_6.webp', position: 3 },
      ],
    },
    {
      name: 'Kostka do Jogi Szara',
      slug: 'kostka-do-jogi-szara',
      description: 'Piankowa kostka do jogi i ćwiczeń.',
      price: 39.99,
      stock: 70,
      categoryId: accessoriesCategory?.id,
      images: [
        { url: '/images/kostki/Szara/pol_pl_Kostka-piankowa-do-jogi-szara-291_1.webp', isMain: true, position: 0 },
        { url: '/images/kostki/Szara/pol_pl_Kostka-piankowa-do-jogi-szara-291_2.webp', position: 1 },
        { url: '/images/kostki/Szara/pol_pl_Kostka-piankowa-do-jogi-szara-291_5.webp', position: 2 },
        { url: '/images/kostki/Szara/pol_pl_Kostka-piankowa-do-jogi-szara-291_8.webp', position: 3 },
      ],
    },
  ];

  for (const productData of products) {
    const { images, ...product } = productData;
    
    const createdProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });

    // Dodaj obrazy
    await prisma.productImage.deleteMany({
      where: { productId: createdProduct.id },
    });

    if (images) {
      await prisma.productImage.createMany({
        data: images.map((img, index) => ({
          productId: createdProduct.id,
          url: img.url,
          isMain: img.isMain || false,
          position: img.position ?? index,
        })),
      });
    }
  }

  console.log('✅ Products created:', products.length);

  // Tworzenie konta admina
  const adminPassword = await bcrypt.hash('Admin123!', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@acroclinic.pl' },
    update: {},
    create: {
      email: 'admin@acroclinic.pl',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'Acro Clinic',
      role: 'ADMIN',
      emailVerified: true,
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Tworzenie domyślnych ustawień
  await prisma.setting.upsert({
    where: { key: 'shipping' },
    update: {},
    create: {
      key: 'shipping',
      value: {
        freeShippingThreshold: 200,
        standardShippingCost: 15.99,
        expressShippingCost: 29.99,
      },
    },
  });

  await prisma.setting.upsert({
    where: { key: 'store' },
    update: {},
    create: {
      key: 'store',
      value: {
        name: 'Acro Clinic',
        email: 'kontakt@acroclinic.pl',
        phone: '+48 123 456 789',
        address: 'ul. Sportowa 1, 00-001 Warszawa',
      },
    },
  });

  console.log('✅ Settings created');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
