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
      sizes: ['116', '122', '128', '134', '140', '146', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
      badge: 'NEW',
      isBestseller: true,
      categoryId: clothingCategory?.id,
      images: [
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770194040/Bluzka_-_1_zkenzs.png', isMain: true, position: 0 },
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770194035/Bluzka_-_2_dp04xv.png', position: 1 }
      ],
    },
    {
      name: 'T-shirt Dziecięcy',
      slug: 't-shirt-dzieciecy',
      description: 'Oddychający t-shirt dla aktywnych dzieci.',
      price: 89.99,
      stock: 75,
      sizes: ['116', '122', '128', '134', '140', '146', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
      isBestseller: true,
      categoryId: clothingCategory?.id,
      images: [
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770194043/T-Shirt_-_2_bqqboy.png', isMain: true, position: 0 },
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770194042/T-Shirt_-_1_lf6osl.png', position: 1 }
      ],
    },
    {
      name: 'Longsleeve Dziecięcy',
      slug: 'longsleeve-dzieciecy',
      description: 'Ciepły longsleeve z długim rękawem.',
      price: 99.99,
      stock: 40,
      sizes: ['116', '122', '128', '134', '140', '146', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
      categoryId: clothingCategory?.id,
      images: [
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770194045/sweter_-_1_nrswcw.png', isMain: true, position: 0 },
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770194041/sweter_-_2_gnc7up.png', position: 1 }
      ],
    },
    {
      name: 'Spodenki Kolarki',
      slug: 'spodenki-kolarki',
      description: 'Elastyczne spodenki kolarki do ćwiczeń.',
      price: 89.99,
      stock: 60,
      sizes: ['116', '122', '128', '134', '140', '146', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
      badge: 'NEW',
      isBestseller: true,
      categoryId: clothingCategory?.id,
      images: [
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770194039/spodenki_-_1_m2wbhf.png', isMain: true, position: 0 },
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770194038/spodenki_-_2_xc4ns9.png', position: 1 }
      ],
    },
    {
      name: 'Top Sportowy',
      slug: 'top-sportowy',
      description: 'Lekki top sportowy dla dziewczynek.',
      price: 99.99,
      stock: 45,
      sizes: ['116', '122', '128', '134', '140', '146', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
      categoryId: clothingCategory?.id,
      images: [
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770194046/top_-_1_xesh5a.png', isMain: true, position: 0 },
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770194044/top_-_2_uzhoy3.png', position: 1 }
      ],
    },
    {
      name: 'Legginsy',
      slug: 'legginsy',
      description: 'Wygodne legginsy do treningu.',
      price: 144.99,
      stock: 55,
      sizes: ['116', '122', '128', '134', '140', '146', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
      badge: 'LIMITED',
      isBestseller: true,
      categoryId: clothingCategory?.id,
      images: [
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770194041/legginsy_1_v4fwac.png', isMain: true, position: 0 },
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770194037/legginsy_2_iuduhu.png', position: 1 }
      ],
    },
    {
      name: 'Dresy Jogger Dziecięce',
      slug: 'dresy-jogger-dzieciece',
      description: 'Wygodne dresy jogger dla dzieci.',
      price: 149.99,
      stock: 35,
      sizes: ['116', '122', '128', '134', '140', '146', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
      categoryId: clothingCategory?.id,
      images: [
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770194039/spodnie_-_1_vdy1ba.png', isMain: true, position: 0 },
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770194036/spodnie_-_2_cwsriw.png', position: 1 }
      ],
    },
    {
      name: 'Bluza Regular Dziecięca',
      slug: 'bluza-regular-dziecieca',
      description: 'Klasyczna bluza dla dzieci.',
      price: 159.99,
      stock: 30,
      sizes: ['116', '122', '128', '134', '140', '146', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
      badge: 'LIMITED',
      categoryId: clothingCategory?.id,
      images: [
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770194034/Bluza_-_2_srgyqk.png', isMain: true, position: 0 },
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770194034/Bluza_-_1_ekfs6y.png', position: 1 }
      ],
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
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770193789/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-fioletowa-415_1_cfhcxv.webp', isMain: true, position: 0 },
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770193788/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-fioletowa-415_2_tsabic.webp', position: 1 },
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770193788/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-fioletowa-415_3_nsbxyh.webp', position: 2 },
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770193790/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-fioletowa-415_4_tqpwxb.webp', position: 3 },
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770193790/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-fioletowa-415_5_jm22gw.webp', position: 4 },
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
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770193791/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-rozowa-416_1_aqtera.webp', isMain: true, position: 0 },
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770193789/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-rozowa-416_2_vrbwty.webp', position: 1 },
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770193791/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-rozowa-416_3_qfurmx.webp', position: 2 },
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770193792/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-rozowa-416_4_ok0sjs.webp', position: 3 },
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770193792/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-rozowa-416_6_ruugdo.webp', position: 4 },
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
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770193793/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-zielona-414_1_itsnhe.webp', isMain: true, position: 0 },
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770193792/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-zielona-414_2_tqcu0g.webp', position: 1 },
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770193794/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-zielona-414_4_lrrjwo.webp', position: 2 },
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770193794/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-zielona-414_5_waqjva.webp', position: 3 },
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770193794/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-zielona-414_6_lvj6hv.webp', position: 4 },
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
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770193798/pol_pl_Kostka-piankowa-do-jogi-czarna-74_1_k6lzl2.webp', isMain: true, position: 0 },
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770193798/pol_pl_Kostka-piankowa-do-jogi-czarna-74_2_exdo8m.webp', position: 1 },
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770193800/pol_pl_Kostka-piankowa-do-jogi-czarna-74_5_gjdxw3.webp', position: 2 },
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770193797/pol_pm_Kostka-piankowa-do-jogi-czarna-74_8_srsrzd.webp', position: 3 },
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
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770193798/pol_pl_Kostka-piankowa-do-jogi-niebieska-73_1_vwqpxj.webp', isMain: true, position: 0 },
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770193801/pol_pl_Kostka-piankowa-do-jogi-niebieska-73_2_zojxrv.webp', position: 1 },
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770193800/pol_pl_Kostka-piankowa-do-jogi-niebieska-73_9_fgfj5d.webp', position: 2 },
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770193802/pol_pl_Kostka-piankowa-do-jogi-niebieska-73_10_ahjwhq.webp', position: 3 },
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
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770193802/pol_pl_Kostka-piankowa-do-jogi-rozowa-290_1_yg8bde.webp', isMain: true, position: 0 },
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770193802/pol_pl_Kostka-piankowa-do-jogi-rozowa-290_2_mo2s4c.webp', position: 1 },
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770193803/pol_pl_Kostka-piankowa-do-jogi-rozowa-290_4_mpx1lf.webp', position: 2 },
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770193803/pol_pl_Kostka-piankowa-do-jogi-rozowa-290_6_thajhh.webp', position: 3 },
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
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770193804/pol_pl_Kostka-piankowa-do-jogi-szara-291_1_igjvsv.webp', isMain: true, position: 0 },
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770193805/pol_pl_Kostka-piankowa-do-jogi-szara-291_2_po89uk.webp', position: 1 },
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770193805/pol_pl_Kostka-piankowa-do-jogi-szara-291_5_bsof0u.webp', position: 2 },
        { url: 'https://res.cloudinary.com/dpseab5qy/image/upload/v1770193806/pol_pl_Kostka-piankowa-do-jogi-szara-291_8_ne9kzi.webp', position: 3 },
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
