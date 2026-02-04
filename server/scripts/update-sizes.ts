import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Rozmiary
const allSizes = ['116', '122', '128', '134', '140', '146', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

// Mapowanie slug -> rozmiary (wszystkie ciuchy mają pełen zakres)
const productSizes: Record<string, string[]> = {
  'koszulka-bokserka': allSizes,
  'spodenki-kolarki': allSizes,
  'legginsy': allSizes,
  'top-sportowy': allSizes,
  't-shirt-dzieciecy': allSizes,
  'longsleeve-dzieciecy': allSizes,
  'dresy-jogger-dzieciece': allSizes,
  'bluza-regular-dziecieca': allSizes,
};

async function updateSizes() {
  console.log('🔄 Aktualizacja rozmiarów produktów...\n');

  for (const [slug, sizes] of Object.entries(productSizes)) {
    try {
      const updated = await prisma.product.update({
        where: { slug },
        data: { sizes },
      });
      console.log(`✅ ${updated.name}: ${sizes.join(', ')}`);
    } catch (error: any) {
      if (error.code === 'P2025') {
        console.log(`⚠️  Nie znaleziono produktu: ${slug}`);
      } else {
        console.error(`❌ Błąd dla ${slug}:`, error.message);
      }
    }
  }

  // Podsumowanie
  const productsWithSizes = await prisma.product.count({
    where: { sizes: { isEmpty: false } },
  });

  console.log(`\n${'='.repeat(50)}`);
  console.log(`🎉 ZAKOŃCZONO!`);
  console.log(`   📦 Produktów z rozmiarami: ${productsWithSizes}`);
  console.log(`${'='.repeat(50)}\n`);

  await prisma.$disconnect();
}

updateSizes();
