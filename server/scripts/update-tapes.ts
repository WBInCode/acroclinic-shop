import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Updating tape product descriptions...');

    const tapes = [
        {
            slug: 'tasma-gimnastyczna-rozowa',
            name: 'Taśma Gimnastyczna do Rozciągania 4FIZJO Czarno-Różowa 90 cm',
            color: 'czarno-różowy',
        },
        {
            slug: 'tasma-gimnastyczna-zielona',
            name: 'Taśma Gimnastyczna do Rozciągania 4FIZJO Czarno-Zielona 90 cm',
            color: 'czarno-zielony',
        },
        {
            slug: 'tasma-gimnastyczna-fioletowa',
            name: 'Taśma Gimnastyczna do Rozciągania 4FIZJO Czarno-Fioletowa 90 cm',
            color: 'czarno-fioletowy',
        },
    ];

    for (const tape of tapes) {
        const description = `Czujesz, że twoje ciało potrzebuje rozciągania? Albo może pragniesz zafundować sobie wymagający trening siłowy na mięśnie głębokie? Nieważne, jaki masz cel sportowy! W osiągnięciu wymarzonych efektów pomoże Ci gimnastyczna taśma do rozciągania i ćwiczeń 4FIZJO. Trening z gumami oporowymi możesz wykonać wszędzie – na siłowni, w klubie fitness, domu lub plenerze.

Taśma oporowa pozwala maksymalnie zaangażować do pracy zarówno obręcz barkową, jak i mięśnie nóg, pośladków. Do tego jest świetnym sposobem na urozmaicenie pilatesu, stretchingu czy treningu siłowego. Już teraz wzmocnij swoją koordynację oraz zbuduj wytrzymałość mięśniową i całego ciała.

Taśma gimnastyczna do rozciągania i stretchingu 90 cm
Dobierz odpowiedni rodzaj gimnastycznej gumy do rozciągania 4FIZJO, która spełni twoje oczekiwania. Zapoznaj się z parametrami produktu i wejdź na nowy poziom treningu!

Parametry:
✔️ Kolor: ${tape.color}
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
Jakie ćwiczenia uwielbiasz wykonywać – siłowe, gimnastyczne, a może relaksujące? Niezależnie od wyboru, taśma do rozciągania 4FIZJO sprawdzi się w przypadku początkujących i zaawansowanych sportowców. Jest to doskonały sposób na zwiększenie efektywności ćwiczeń właśnie przez wielopoziomową regulację oporu. Guma do ćwiczeń jest podzielona na 8 równych części. To pozwala dobrać odpowiednią długość i siłę oporu do indywidualnego poziomu rozciągnięcia osoby ćwiczącej. Im mniejsza liczba pętli, tym większy będzie opór. Tym samym pozwala przeprowadzić intensywniejszy trening.`;

        try {
            const updated = await prisma.product.update({
                where: { slug: tape.slug },
                data: {
                    name: tape.name,
                    description: description,
                },
            });
            console.log(`✅ Updated: ${updated.name}`);
        } catch (error) {
            console.error(`❌ Failed to update ${tape.slug}:`, error);
        }
    }

    console.log('🎉 Update completed!');
}

main()
    .catch((e) => {
        console.error('❌ Update failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
