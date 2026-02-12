import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Updating yoga block product descriptions...');

    const blocks = [
        {
            slug: 'kostka-do-jogi-czarna',
            name: 'Kostka do Jogi 4FIZJO Czarna z Pianki EVA',
            color: 'czarny',
        },
        {
            slug: 'kostka-do-jogi-niebieska',
            name: 'Kostka do Jogi 4FIZJO Niebieska z Pianki EVA',
            color: 'niebieski',
        },
        {
            slug: 'kostka-do-jogi-rozowa',
            name: 'Kostka do Jogi 4FIZJO Różowa z Pianki EVA',
            color: 'różowy',
        },
        {
            slug: 'kostka-do-jogi-szara',
            name: 'Kostka do Jogi 4FIZJO Szara z Pianki EVA',
            color: 'szary',
        },
    ];

    for (const block of blocks) {
        const description = `Dopiero zaczynasz swoją przygodę z jogą? A może marzysz o pięknych wygięciach, szpagatach i smukłej rozciągniętej sylwetce? Jeśli wszystko się zgadza, to znaczy, że potrzebujesz jeszcze tylko jednej rzeczy – kostki do jogi 4FIZJO z pianki EVA. Jest to praktyczny i przydatny przedmiot, który pozwoli Ci na bezpieczne i stabilne wykonywanie pozycji rozciągających i asan w jodze.
Chcesz się dowiedzieć więcej? Koniecznie sprawdź, czym się charakteryzuje nasza profesjonalna kostka do jogi 4FIZJO!

Kostka do ćwiczeń jogi i pilatesu
Kostka do jogi to jeden z najczęściej wykorzystywanych akcesoriów przy ćwiczeniach jogi, pilatesu czy treningu fitness. Zapoznaj się z parametrami produktu, aby wybrać model odpowiedni do swoich potrzeb.

Parametry:
✔️ Kolor: ${block.color}
✔️ Materiał: pianka EVA
✔️ Wymiary: 23 × 15 × 7,6 cm
✔️ Waga: ok. 160 g

Kostka do jogi – zwiększ intensywność wykonywanych ćwiczeń
Kostka do jogi i ćwiczeń fitness od 4FIZJO została stworzona z myślą zarówno o początkujących, jak i zaawansowanych joginach. Jest idealna do wykorzystania na różnych poziomach trudności. Sprawdzi się jako doskonała pomoc przy poprawnym wykonywaniu asan i innych ćwiczeń rozciągających. Kostka do jogi:
▶️ To lekki piankowy klocek, który zapewnia stabilizację i równowagę podczas treningu
▶️ Ma możliwość regulowania wysokości położenia rąk poprzez ustawienie na różnych bokach
▶️ Pozwala modyfikować poziom trudności asan
▶️ Polecana jest do ćwiczeń w pozycjach stojących, leżących, siedzących, czy też asan jogi
▶️ Jest pomocą dla osób początkujących i mniej rozciągniętych chcących wejść w bardziej wymagające pozycje
▶️ Osobom zaawansowanym służy jako przedłużenie rąk w pozycjach stojących np. w skłonie do przodu
▶️ Sprawdzi się podczas ćwiczeń indywidualnych w domu, zajęć grupowych na siłowni oraz w profesjonalnych szkołach jogi

Wytrzymałość, bezpieczeństwo i najlepsze wykonanie kostki do jogi
Kostka do jogi 4FIZJO jest klasycznym piankowym klockiem, który został wykonany z jakościowej pianki EVA. Spełnia też wszystkie warunki dla wysokiej jakości sprzętu i akcesoriów do jogi. Tym samym zaletami kostki są niezwykła lekkość oraz to, że materiał nie uczula. Co więcej, wysoka gęstość wykorzystanej pianki sprawia, że produkt jest wytrzymały, a do tego się nie odkształca. To zapewnia stabilne podparcie podczas wykonywania ćwiczeń i kolejnych asan. Powierzchnia kostki jest antypoślizgowa, co zapewnia wygodny chwyt.`;

        try {
            const updated = await prisma.product.update({
                where: { slug: block.slug },
                data: {
                    name: block.name,
                    description: description,
                },
            });
            console.log(`✅ Updated: ${updated.name}`);
        } catch (error) {
            console.error(`❌ Failed to update ${block.slug}:`, error);
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
