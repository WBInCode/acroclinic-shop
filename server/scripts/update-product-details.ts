import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Pełne dane produktów
const productDetails: Record<string, {
  description: string;
  features: string[];
  materials: string;
}> = {
  // ODZIEŻ
  'koszulka-bokserka': {
    description: 'Profesjonalna koszulka bokserka idealna do treningów akrobatyki i tańca. Wykonana z oddychających materiałów premium, zapewnia pełną swobodę ruchów.',
    features: ['Oddychający materiał', 'Szybkoschnący', 'Wygodny krój', 'Płaskie szwy'],
    materials: '92% Poliester, 8% Elastan',
  },
  't-shirt-dzieciecy': {
    description: 'T-shirt dziecięcy zaprojektowany z myślą o młodych akrobatach. Wygodny krój pozwala na wykonywanie nawet najbardziej skomplikowanych figur.',
    features: ['Miękka bawełna', 'Wzmocnione szwy', 'Nadruk z logo', 'Łatwy w praniu'],
    materials: '95% Bawełna, 5% Elastan',
  },
  'longsleeve-dzieciecy': {
    description: 'Longsleeve dziecięcy na chłodniejsze dni treningowe. Doskonale sprawdza się podczas rozgrzewki i stretching.',
    features: ['Długi rękaw', 'Ciepły materiał', 'Elastyczny', 'Z logo Acro Clinic'],
    materials: '90% Bawełna, 10% Elastan',
  },
  'spodenki-kolarki': {
    description: 'Spodenki kolarki idealne do treningu akrobatyki. Przylegający krój nie ogranicza ruchów podczas ćwiczeń.',
    features: ['Przylegający krój', 'Antypoślizgowy brzeg', 'Szybkoschnące', 'Wygodny pas'],
    materials: '88% Nylon, 12% Elastan',
  },
  'top-sportowy': {
    description: 'Top sportowy zapewniający optymalne wsparcie podczas treningów. Wygodny i stylowy.',
    features: ['Wsparcie podczas ćwiczeń', 'Oddychający', 'Elastyczny', 'Modny design'],
    materials: '85% Poliamid, 15% Elastan',
  },
  'legginsy': {
    description: 'Legginsy treningowe to połączenie stylu i funkcjonalności. Wysoki stan zapewnia komfort, a elastyczny materiał pozwala na pełen zakres ruchu.',
    features: ['Wysoki stan', 'Kieszeń na telefon', 'Antypoślizgowy pas', 'Modelujący krój'],
    materials: '78% Nylon, 22% Elastan',
  },
  'dresy-jogger-dzieciece': {
    description: 'Dresy jogger dziecięce - wygodne i stylowe spodnie na trening i na co dzień. Idealne do rozgrzewki.',
    features: ['Ściągacze przy kostkach', 'Kieszenie', 'Miękka dzianina', 'Elastyczny pas'],
    materials: '80% Bawełna, 20% Poliester',
  },
  'bluza-regular-dziecieca': {
    description: 'Bluza regular dziecięca - ciepła i wygodna na chłodniejsze dni. Z nadrukiem logo Acro Clinic.',
    features: ['Kaptur', 'Kieszeń kangurka', 'Ciepła dzianina', 'Nadruk z logo'],
    materials: '70% Bawełna, 30% Poliester',
  },
  // TAŚMY GIMNASTYCZNE
  'tasma-gimnastyczna-fioletowa': {
    description: 'Taśma gimnastyczna do rozciągania 90cm - idealna do ćwiczeń rozciągających i zwiększania elastyczności. Wykonana z wytrzymałej gumy lateksowej.',
    features: ['Długość 90cm', 'Wytrzymała guma', 'Antypoślizgowa', 'Lekka i poręczna'],
    materials: '100% Lateks naturalny',
  },
  'tasma-gimnastyczna-rozowa': {
    description: 'Taśma gimnastyczna do rozciągania 90cm - idealna do ćwiczeń rozciągających i zwiększania elastyczności. Wykonana z wytrzymałej gumy lateksowej.',
    features: ['Długość 90cm', 'Wytrzymała guma', 'Antypoślizgowa', 'Lekka i poręczna'],
    materials: '100% Lateks naturalny',
  },
  'tasma-gimnastyczna-zielona': {
    description: 'Taśma gimnastyczna do rozciągania 90cm - idealna do ćwiczeń rozciągających i zwiększania elastyczności. Wykonana z wytrzymałej gumy lateksowej.',
    features: ['Długość 90cm', 'Wytrzymała guma', 'Antypoślizgowa', 'Lekka i poręczna'],
    materials: '100% Lateks naturalny',
  },
  // KOSTKI DO JOGI
  'kostka-do-jogi-czarna': {
    description: 'Kostka piankowa do jogi - niezbędny sprzęt do ćwiczeń jogi i stretching. Zapewnia stabilność i wsparcie podczas wykonywania pozycji.',
    features: ['Lekka pianka EVA', 'Antypoślizgowa', 'Łatwa do czyszczenia', 'Wysoka gęstość'],
    materials: '100% Pianka EVA',
  },
  'kostka-do-jogi-niebieska': {
    description: 'Kostka piankowa do jogi - niezbędny sprzęt do ćwiczeń jogi i stretching. Zapewnia stabilność i wsparcie podczas wykonywania pozycji.',
    features: ['Lekka pianka EVA', 'Antypoślizgowa', 'Łatwa do czyszczenia', 'Wysoka gęstość'],
    materials: '100% Pianka EVA',
  },
  'kostka-do-jogi-rozowa': {
    description: 'Kostka piankowa do jogi - niezbędny sprzęt do ćwiczeń jogi i stretching. Zapewnia stabilność i wsparcie podczas wykonywania pozycji.',
    features: ['Lekka pianka EVA', 'Antypoślizgowa', 'Łatwa do czyszczenia', 'Wysoka gęstość'],
    materials: '100% Pianka EVA',
  },
  'kostka-do-jogi-szara': {
    description: 'Kostka piankowa do jogi - niezbędny sprzęt do ćwiczeń jogi i stretching. Zapewnia stabilność i wsparcie podczas wykonywania pozycji.',
    features: ['Lekka pianka EVA', 'Antypoślizgowa', 'Łatwa do czyszczenia', 'Wysoka gęstość'],
    materials: '100% Pianka EVA',
  },
};

async function updateProductDetails() {
  console.log('🔄 Aktualizacja szczegółów produktów...\n');

  let updated = 0;
  let notFound = 0;

  for (const [slug, details] of Object.entries(productDetails)) {
    try {
      const product = await prisma.product.update({
        where: { slug },
        data: {
          description: details.description,
          features: details.features,
          materials: details.materials,
        },
      });
      console.log(`✅ ${product.name}`);
      updated++;
    } catch (error: any) {
      if (error.code === 'P2025') {
        console.log(`⚠️  Nie znaleziono: ${slug}`);
        notFound++;
      } else {
        console.error(`❌ Błąd dla ${slug}:`, error.message);
      }
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`🎉 ZAKOŃCZONO!`);
  console.log(`   ✅ Zaktualizowano: ${updated}`);
  console.log(`   ⚠️  Nie znaleziono: ${notFound}`);
  console.log(`${'='.repeat(50)}\n`);

  await prisma.$disconnect();
}

updateProductDetails();
