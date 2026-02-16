import { motion } from 'framer-motion'
import { ArrowLeft, Shield, Eye, Database, Cookie, UserCheck, Mail, FileText, Clock, Users, Lock, RefreshCw } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

interface PrivacyPolicyPageProps {
    onBack: () => void
}

export function PrivacyPolicyPage({ onBack }: PrivacyPolicyPageProps) {
    const sections = [
        {
            icon: Shield,
            title: '1. Informacje ogólne',
            content: [
                'Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych przekazanych przez Użytkowników w związku z korzystaniem z serwisu WB Trade.',
                'Administratorem danych osobowych jest WB PARTNERS Sp. z o.o. z siedzibą w Rzeszowie, ul. Juliusza Słowackiego 24/11, 35-060 Rzeszów, wpisana do rejestru przedsiębiorców KRS pod numerem 0001151642, NIP: 5170455185, REGON: 540735769.'
            ]
        },
        {
            icon: Database,
            title: '2. Zakres zbieranych danych',
            content: [
                'Zbieramy następujące dane osobowe:',
                'Imię i nazwisko',
                'Adres e-mail',
                'Numer telefonu',
                'Adres dostawy',
                'Dane rozliczeniowe (w przypadku faktur)',
                'Historia zamówień',
                'Dane dotyczące aktywności w serwisie'
            ]
        },
        {
            icon: Eye,
            title: '3. Cel przetwarzania danych',
            content: [
                'Dane osobowe przetwarzane są w celu:',
                'Realizacji zamówień i umów sprzedaży',
                'Obsługi reklamacji i zwrotów',
                'Kontaktu z klientem w sprawach związanych z zamówieniem',
                'Wysyłki newslettera (za zgodą użytkownika)',
                'Prowadzenia analiz i statystyk',
                'Wypełnienia obowiązków prawnych (np. podatkowych)'
            ]
        },
        {
            icon: FileText,
            title: '4. Podstawa prawna przetwarzania',
            content: [
                'Przetwarzamy dane osobowe na podstawie:',
                'Art. 6 ust. 1 lit. a RODO – zgoda użytkownika',
                'Art. 6 ust. 1 lit. b RODO – niezbędność do wykonania umowy',
                'Art. 6 ust. 1 lit. c RODO – wypełnienie obowiązku prawnego',
                'Art. 6 ust. 1 lit. f RODO – prawnie uzasadniony interes administratora'
            ]
        },
        {
            icon: Clock,
            title: '5. Okres przechowywania danych',
            content: [
                'Dane osobowe przechowywane są przez okres niezbędny do realizacji celów, dla których zostały zebrane, a następnie przez okres wymagany przepisami prawa (np. przepisami podatkowymi – 5 lat od końca roku, w którym powstał obowiązek podatkowy).',
                'Dane przetwarzane na podstawie zgody przechowujemy do momentu jej wycofania.'
            ]
        },
        {
            icon: UserCheck,
            title: '6. Prawa użytkownika',
            content: [
                'Każdy użytkownik ma prawo do:',
                'Dostępu do swoich danych osobowych',
                'Sprostowania nieprawidłowych danych',
                'Usunięcia danych („prawo do bycia zapomnianym")',
                'Ograniczenia przetwarzania',
                'Przenoszenia danych',
                'Sprzeciwu wobec przetwarzania',
                'Wycofania zgody w dowolnym momencie',
                'Wniesienia skargi do organu nadzorczego (UODO)'
            ]
        },
        {
            icon: Users,
            title: '7. Odbiorcy danych',
            content: [
                'Dane osobowe mogą być przekazywane następującym podmiotom:',
                'Firmom kurierskim i pocztowym (w celu dostawy zamówień)',
                'Operatorom płatności (w celu realizacji płatności)',
                'Dostawcom usług IT i hostingu',
                'Biurom rachunkowym i kancelariom prawnym',
                'Organom państwowym (na podstawie przepisów prawa)'
            ]
        },
        {
            icon: Cookie,
            title: '8. Pliki cookies',
            content: [
                'Serwis wykorzystuje pliki cookies w celu:',
                'Utrzymania sesji użytkownika',
                'Zapamiętania zawartości koszyka',
                'Prowadzenia analiz statystycznych',
                'Personalizacji treści i reklam',
                'Użytkownik może w każdej chwili zmienić ustawienia przeglądarki dotyczące cookies. Szczegółowe informacje znajdują się w ustawieniach przeglądarki internetowej.'
            ]
        },
        {
            icon: Lock,
            title: '9. Bezpieczeństwo danych',
            content: [
                'Stosujemy odpowiednie środki techniczne i organizacyjne w celu ochrony danych osobowych przed nieuprawnionym dostępem, utratą lub zniszczeniem.',
                'Wykorzystujemy szyfrowanie SSL, kontrolę dostępu oraz regularne kopie zapasowe.'
            ]
        },
        {
            icon: Mail,
            title: '10. Kontakt',
            content: [
                'W sprawach związanych z ochroną danych osobowych można kontaktować się:',
                'E-mail: support@wb-partners.pl',
                'Telefon: +48 570 034 367',
                'Adres: WB PARTNERS Sp. z o.o., ul. Juliusza Słowackiego 24/11, 35-060 Rzeszów'
            ]
        },
        {
            icon: RefreshCw,
            title: '11. Zmiany polityki prywatności',
            content: [
                'Administrator zastrzega sobie prawo do wprowadzania zmian w Polityce Prywatności.',
                'O wszelkich zmianach użytkownicy będą informowani poprzez publikację nowej wersji na stronie internetowej.',
                'Korzystanie z serwisu po wprowadzeniu zmian oznacza ich akceptację.'
            ]
        }
    ]

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease }}
            className="min-h-screen pt-64 pb-32"
        >
            <div className="container mx-auto px-4">
                {/* Back button */}
                <motion.button
                    onClick={onBack}
                    className="inline-flex items-center gap-2 text-white/60 hover:text-brand-gold transition-colors duration-300 mb-12 group cursor-pointer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease }}
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                    <span className="font-[family-name:var(--font-body)] text-xs uppercase tracking-widest">Powrót</span>
                </motion.button>

                {/* Header */}
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease }}
                >
                    <span className="text-xs uppercase tracking-[0.3em] text-brand-gold/60 font-[family-name:var(--font-body)] block mb-4">Informacje prawne</span>
                    <h1 className="font-[family-name:var(--font-heading)] font-bold text-4xl md:text-5xl text-white uppercase tracking-tight mb-6">
                        Polityka <span className="text-brand-gold">Prywatności</span>
                    </h1>
                    <div className="w-24 h-px bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent mx-auto mb-6" />
                    <p className="text-white/40 text-sm font-[family-name:var(--font-body)]">
                        Ostatnia aktualizacja: Luty 2026
                    </p>
                </motion.div>

                {/* Sections */}
                <div className="max-w-4xl mx-auto space-y-8">
                    {sections.map((section, index) => (
                        <motion.div
                            key={section.title}
                            className="p-6 md:p-8 bg-white/[0.02] border border-white/10 rounded-2xl hover:border-brand-gold/20 transition-colors duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease, delay: 0.2 + index * 0.1 }}
                        >
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 flex items-center justify-center border border-brand-gold/30 rounded-xl flex-shrink-0">
                                    <section.icon className="w-5 h-5 text-brand-gold" />
                                </div>
                                <h2 className="font-[family-name:var(--font-heading)] font-bold text-lg text-white">
                                    {section.title}
                                </h2>
                            </div>

                            <ul className="space-y-3 pl-16">
                                {section.content.map((item, idx) => (
                                    <li key={idx} className="text-white/60 font-[family-name:var(--font-body)] leading-relaxed flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 bg-brand-gold/60 rounded-full mt-2 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Contact note */}
                <motion.div
                    className="max-w-4xl mx-auto mt-12 p-6 bg-brand-gold/5 border border-brand-gold/20 rounded-2xl text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease, delay: 0.8 }}
                >
                    <p className="text-white/60 font-[family-name:var(--font-body)]">
                        W sprawie ochrony danych osobowych prosimy o kontakt:
                        <a href="mailto:support@wb-partners.pl" className="text-brand-gold hover:underline ml-1">
                            support@wb-partners.pl
                        </a>
                    </p>
                </motion.div>
            </div>
        </motion.div>
    )
}
