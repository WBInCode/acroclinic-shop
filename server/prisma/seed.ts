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
      name: 'Taśma Gimnastyczna do Rozciągania 4FIZJO Czarno-Fioletowa 90 cm',
      slug: 'tasma-gimnastyczna-fioletowa',
      description: `Czujesz, że twoje ciało potrzebuje rozciągania? Albo może pragniesz zafundować sobie wymagający trening siłowy na mięśnie głębokie? Nieważne, jaki masz cel sportowy! W osiągnięciu wymarzonych efektów pomoże Ci gimnastyczna taśma do rozciągania i ćwiczeń 4FIZJO. Trening z gumami oporowymi możesz wykonać wszędzie – na siłowni, w klubie fitness, domu lub plenerze.

Taśma oporowa pozwala maksymalnie zaangażować do pracy zarówno obręcz barkową, jak i mięśnie nóg, pośladków. Do tego jest świetnym sposobem na urozmaicenie pilatesu, stretchingu czy treningu siłowego. Już teraz wzmocnij swoją koordynację oraz zbuduj wytrzymałość mięśniową i całego ciała.

Taśma gimnastyczna do rozciągania i stretchingu 90 cm
Dobierz odpowiedni rodzaj gimnastycznej gumy do rozciągania 4FIZJO, która spełni twoje oczekiwania. Zapoznaj się z parametrami produktu i wejdź na nowy poziom treningu!

Parametry:
✔️ Kolor: czarno-fioletowy
✔️ Materiał: bawełna, lateks
✔️ Szerokość: 4,2 cm
✔️ Długość: 90 cm
✔️ Grubość: 2 mm

Co wyróżnia gimnastyczne gumy do ćwiczeń 4FIZJO?
✅ Gumy do ćwiczeń gimnastycznych są wykonane z najlepszej jakości bawełny z domieszką lateksu.
✅ Model ma zwiększoną odporność na rozciąganie i jest sprężysty. Zapewnia bardzo dobry opór podczas ćwiczeń.
✅ Materiał, z którego wykonano gumę do ćwiczeń, nie traci swoich właściwości rozciągających.
✅ Gumy oporowe są idealne do przeprowadzenia stretchingu i treningu obwodowego. Angażują mięśnie do większej pracy.
✅ Taśma gimnastyczna 4FIZJO jest odpowiednia zarówno dla sportowców rekreacyjnych, jak i profesjonalnych.

Taśma gimnastyczna do ćwiczeń – wszechstronny trening z gumą do rozciągania
Taśma gimnastyczna 4FIZJO wyróżnia się uniwersalnym zastosowaniem. Trening przeprowadzony z tego rodzaju gumą do ćwiczeń zarówno wzmocni, jak i uelastyczni mięśnie. Może być pomocna przy zminimalizowaniu napięcia w obrębie obręczy barkowej i klatki piersiowej. Taśmę do rozciągania możesz wykorzystać do:
▶️ Fitnessu i gimnastyki
▶️ Jogi i pilatesu
▶️ Rozciągania i stretchingu
▶️ Ćwiczeń siłowych
▶️ Ćwiczeń stabilizujących
▶️ Treningu aktywizacyjnego
▶️ Rehabilitacji i ćwiczeń korekcyjnych

Wysoka jakość i wytrzymałość gumy do rozciągania 
Doskonała rozciągliwość i sprężystość gumy do rozciągania to zasługa wykorzystania wysokiej jakości materiałów. Zaletą zastosowanej bawełny z domieszką lateksu jest to, że nawet po wielu treningach nie traci swoich właściwości. Do tego minimalizuje ryzyko przetarć lub pęknięć. Po naciągnięciu taśma gimnastyczna wraca do swojego początkowego kształtu. Tym samym wykazuje odporność na odkształcenia. Daje to swobodę w doborze treningu.

Trening z gumą gimnastyczną 4FIZJO. Wielopoziomowa regulacja oporu 
Jakie ćwiczenia uwielbiasz wykonywać – siłowe, gimnastyczne, a może relaksujące? Niezależnie od wyboru, taśma do rozciągania 4FIZJO sprawdzi się w przypadku początkujących i zaawansowanych sportowców. Jest to doskonały sposób na zwiększenie efektywności ćwiczeń właśnie przez wielopoziomową regulację oporu. Guma do ćwiczeń jest podzielona na 8 równych części. To pozwala dobrać odpowiednią długość i siłę oporu do indywidualnego poziomu rozciągnięcia osoby ćwiczącej. Im mniejsza liczba pętli, tym większy będzie opór. Tym samym pozwala przeprowadzić intensywniejszy trening.`,
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
      name: 'Taśma Gimnastyczna do Rozciągania 4FIZJO Czarno-Różowa 90 cm',
      slug: 'tasma-gimnastyczna-rozowa',
      description: `Czujesz, że twoje ciało potrzebuje rozciągania? Albo może pragniesz zafundować sobie wymagający trening siłowy na mięśnie głębokie? Nieważne, jaki masz cel sportowy! W osiągnięciu wymarzonych efektów pomoże Ci gimnastyczna taśma do rozciągania i ćwiczeń 4FIZJO. Trening z gumami oporowymi możesz wykonać wszędzie – na siłowni, w klubie fitness, domu lub plenerze.

Taśma oporowa pozwala maksymalnie zaangażować do pracy zarówno obręcz barkową, jak i mięśnie nóg, pośladków. Do tego jest świetnym sposobem na urozmaicenie pilatesu, stretchingu czy treningu siłowego. Już teraz wzmocnij swoją koordynację oraz zbuduj wytrzymałość mięśniową i całego ciała.

Taśma gimnastyczna do rozciągania i stretchingu 90 cm
Dobierz odpowiedni rodzaj gimnastycznej gumy do rozciągania 4FIZJO, która spełni twoje oczekiwania. Zapoznaj się z parametrami produktu i wejdź na nowy poziom treningu!

Parametry:
✔️ Kolor: czarno-różowy
✔️ Materiał: bawełna, lateks
✔️ Szerokość: 4,2 cm
✔️ Długość: 90 cm
✔️ Grubość: 2 mm

Co wyróżnia gimnastyczne gumy do ćwiczeń 4FIZJO?
✅ Gumy do ćwiczeń gimnastycznych są wykonane z najlepszej jakości bawełny z domieszką lateksu.
✅ Model ma zwiększoną odporność na rozciąganie i jest sprężysty. Zapewnia bardzo dobry opór podczas ćwiczeń.
✅ Materiał, z którego wykonano gumę do ćwiczeń, nie traci swoich właściwości rozciągających.
✅ Gumy oporowe są idealne do przeprowadzenia stretchingu i treningu obwodowego. Angażują mięśnie do większej pracy.
✅ Taśma gimnastyczna 4FIZJO jest odpowiednia zarówno dla sportowców rekreacyjnych, jak i profesjonalnych.

Taśma gimnastyczna do ćwiczeń – wszechstronny trening z gumą do rozciągania
Taśma gimnastyczna 4FIZJO wyróżnia się uniwersalnym zastosowaniem. Trening przeprowadzony z tego rodzaju gumą do ćwiczeń zarówno wzmocni, jak i uelastyczni mięśnie. Może być pomocna przy zminimalizowaniu napięcia w obrębie obręczy barkowej i klatki piersiowej. Taśmę do rozciągania możesz wykorzystać do:
▶️ Fitnessu i gimnastyki
▶️ Jogi i pilatesu
▶️ Rozciągania i stretchingu
▶️ Ćwiczeń siłowych
▶️ Ćwiczeń stabilizujących
▶️ Treningu aktywizacyjnego
▶️ Rehabilitacji i ćwiczeń korekcyjnych

Wysoka jakość i wytrzymałość gumy do rozciągania 
Doskonała rozciągliwość i sprężystość gumy do rozciągania to zasługa wykorzystania wysokiej jakości materiałów. Zaletą zastosowanej bawełny z domieszką lateksu jest to, że nawet po wielu treningach nie traci swoich właściwości. Do tego minimalizuje ryzyko przetarć lub pęknięć. Po naciągnięciu taśma gimnastyczna wraca do swojego początkowego kształtu. Tym samym wykazuje odporność na odkształcenia. Daje to swobodę w doborze treningu.

Trening z gumą gimnastyczną 4FIZJO. Wielopoziomowa regulacja oporu 
Jakie ćwiczenia uwielbiasz wykonywać – siłowe, gimnastyczne, a może relaksujące? Niezależnie od wyboru, taśma do rozciągania 4FIZJO sprawdzi się w przypadku początkujących i zaawansowanych sportowców. Jest to doskonały sposób na zwiększenie efektywności ćwiczeń właśnie przez wielopoziomową regulację oporu. Guma do ćwiczeń jest podzielona na 8 równych części. To pozwala dobrać odpowiednią długość i siłę oporu do indywidualnego poziomu rozciągnięcia osoby ćwiczącej. Im mniejsza liczba pętli, tym większy będzie opór. Tym samym pozwala przeprowadzić intensywniejszy trening.`,
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
      name: 'Taśma Gimnastyczna do Rozciągania 4FIZJO Czarno-Zielona 90 cm',
      slug: 'tasma-gimnastyczna-zielona',
      description: `Czujesz, że twoje ciało potrzebuje rozciągania? Albo może pragniesz zafundować sobie wymagający trening siłowy na mięśnie głębokie? Nieważne, jaki masz cel sportowy! W osiągnięciu wymarzonych efektów pomoże Ci gimnastyczna taśma do rozciągania i ćwiczeń 4FIZJO. Trening z gumami oporowymi możesz wykonać wszędzie – na siłowni, w klubie fitness, domu lub plenerze.

Taśma oporowa pozwala maksymalnie zaangażować do pracy zarówno obręcz barkową, jak i mięśnie nóg, pośladków. Do tego jest świetnym sposobem na urozmaicenie pilatesu, stretchingu czy treningu siłowego. Już teraz wzmocnij swoją koordynację oraz zbuduj wytrzymałość mięśniową i całego ciała.

Taśma gimnastyczna do rozciągania i stretchingu 90 cm
Dobierz odpowiedni rodzaj gimnastycznej gumy do rozciągania 4FIZJO, która spełni twoje oczekiwania. Zapoznaj się z parametrami produktu i wejdź na nowy poziom treningu!

Parametry:
✔️ Kolor: czarno-zielony
✔️ Materiał: bawełna, lateks
✔️ Szerokość: 4,2 cm
✔️ Długość: 90 cm
✔️ Grubość: 2 mm

Co wyróżnia gimnastyczne gumy do ćwiczeń 4FIZJO?
✅ Gumy do ćwiczeń gimnastycznych są wykonane z najlepszej jakości bawełny z domieszką lateksu.
✅ Model ma zwiększoną odporność na rozciąganie i jest sprężysty. Zapewnia bardzo dobry opór podczas ćwiczeń.
✅ Materiał, z którego wykonano gumę do ćwiczeń, nie traci swoich właściwości rozciągających.
✅ Gumy oporowe są idealne do przeprowadzenia stretchingu i treningu obwodowego. Angażują mięśnie do większej pracy.
✅ Taśma gimnastyczna 4FIZJO jest odpowiednia zarówno dla sportowców rekreacyjnych, jak i profesjonalnych.

Taśma gimnastyczna do ćwiczeń – wszechstronny trening z gumą do rozciągania
Taśma gimnastyczna 4FIZJO wyróżnia się uniwersalnym zastosowaniem. Trening przeprowadzony z tego rodzaju gumą do ćwiczeń zarówno wzmocni, jak i uelastyczni mięśnie. Może być pomocna przy zminimalizowaniu napięcia w obrębie obręczy barkowej i klatki piersiowej. Taśmę do rozciągania możesz wykorzystać do:
▶️ Fitnessu i gimnastyki
▶️ Jogi i pilatesu
▶️ Rozciągania i stretchingu
▶️ Ćwiczeń siłowych
▶️ Ćwiczeń stabilizujących
▶️ Treningu aktywizacyjnego
▶️ Rehabilitacji i ćwiczeń korekcyjnych

Wysoka jakość i wytrzymałość gumy do rozciągania 
Doskonała rozciągliwość i sprężystość gumy do rozciągania to zasługa wykorzystania wysokiej jakości materiałów. Zaletą zastosowanej bawełny z domieszką lateksu jest to, że nawet po wielu treningach nie traci swoich właściwości. Do tego minimalizuje ryzyko przetarć lub pęknięć. Po naciągnięciu taśma gimnastyczna wraca do swojego początkowego kształtu. Tym samym wykazuje odporność na odkształcenia. Daje to swobodę w doborze treningu.

Trening z gumą gimnastyczną 4FIZJO. Wielopoziomowa regulacja oporu 
Jakie ćwiczenia uwielbiasz wykonywać – siłowe, gimnastyczne, a może relaksujące? Niezależnie od wyboru, taśma do rozciągania 4FIZJO sprawdzi się w przypadku początkujących i zaawansowanych sportowców. Jest to doskonały sposób na zwiększenie efektywności ćwiczeń właśnie przez wielopoziomową regulację oporu. Guma do ćwiczeń jest podzielona na 8 równych części. To pozwala dobrać odpowiednią długość i siłę oporu do indywidualnego poziomu rozciągnięcia osoby ćwiczącej. Im mniejsza liczba pętli, tym większy będzie opór. Tym samym pozwala przeprowadzić intensywniejszy trening.`,
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
    update: {
      password: adminPassword,
    },
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
        standardShippingCost: 19.90
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
        email: 'support@wb-partners.pl',
        phone: '570 034 367',
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
