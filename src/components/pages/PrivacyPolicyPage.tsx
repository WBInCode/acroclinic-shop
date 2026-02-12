import { motion } from 'framer-motion'
import { ArrowLeft, Shield, Eye, Database, Cookie, UserCheck, Mail } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

interface PrivacyPolicyPageProps {
    onBack: () => void
}

export function PrivacyPolicyPage({ onBack }: PrivacyPolicyPageProps) {
    const sections = [
        {
            icon: Shield,
            title: '1. Administrator danych',
            content: [
                'Administratorem danych osobowych jest WB Partners Sp. z o.o. z siedzibą w Rzeszowie.',
                'Kontakt z administratorem: support@wb-partners.pl.',
                'Administrator przetwarza dane osobowe zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO).'
            ]
        },
        {
            icon: Database,
            title: '2. Zakres zbieranych danych',
            content: [
                'Imię i nazwisko — do realizacji zamówień i wystawienia dokumentów sprzedaży.',
                'Adres e-mail — do komunikacji, realizacji zamówień i wysyłki newslettera (za zgodą).',
                'Adres dostawy — do wysłania zamówionych produktów.',
                'Numer telefonu — do kontaktu w sprawie zamówień i dostawy.',
                'Dane do płatności — przetwarzane przez operatora płatności PayU (nie są przechowywane przez nas).'
            ]
        },
        {
            icon: Eye,
            title: '3. Cel przetwarzania danych',
            content: [
                'Realizacja zamówień składanych w sklepie internetowym (art. 6 ust. 1 lit. b RODO).',
                'Obsługa konta użytkownika (art. 6 ust. 1 lit. b RODO).',
                'Wysyłka newslettera — wyłącznie po wyrażeniu dobrowolnej zgody (art. 6 ust. 1 lit. a RODO).',
                'Realizacja obowiązków prawnych, w tym podatkowych i rachunkowych (art. 6 ust. 1 lit. c RODO).',
                'Dochodzenie roszczeń lub obrona przed roszczeniami (art. 6 ust. 1 lit. f RODO).'
            ]
        },
        {
            icon: UserCheck,
            title: '4. Prawa użytkownika',
            content: [
                'Prawo dostępu do swoich danych osobowych.',
                'Prawo do sprostowania (poprawienia) danych.',
                'Prawo do usunięcia danych („prawo do bycia zapomnianym").',
                'Prawo do ograniczenia przetwarzania.',
                'Prawo do przenoszenia danych.',
                'Prawo do cofnięcia zgody w dowolnym momencie (nie wpływa na zgodność z prawem przetwarzania dokonanego przed cofnięciem).',
                'Prawo do wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych.'
            ]
        },
        {
            icon: Cookie,
            title: '5. Pliki cookies',
            content: [
                'Strona wykorzystuje pliki cookies w celu zapewnienia prawidłowego działania serwisu.',
                'Cookies sesyjne — niezbędne do funkcjonowania koszyka i logowania. Usuwane po zamknięciu przeglądarki.',
                'Cookies funkcjonalne — zapamiętują preferencje użytkownika (np. stan panelu bocznego).',
                'Użytkownik może zarządzać plikami cookies w ustawieniach swojej przeglądarki.',
                'Wyłączenie cookies może wpłynąć na funkcjonalność strony (np. brak możliwości logowania lub składania zamówień).'
            ]
        },
        {
            icon: Mail,
            title: '6. Newsletter',
            content: [
                'Subskrypcja newslettera jest dobrowolna i wymaga podwójnego potwierdzenia (double opt-in).',
                'Newsletter wysyłany jest za pośrednictwem usługi Resend.',
                'Użytkownik może w każdej chwili zrezygnować z newslettera klikając link rezygnacji w wiadomości e-mail lub poprzez panel użytkownika.',
                'Po rezygnacji adres e-mail zostanie usunięty z bazy newsletterowej.'
            ]
        }
    ]

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease }}
            className="min-h-screen pt-48 pb-32"
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
                            className="p-6 md:p-8 bg-white/[0.02] border border-white/10 hover:border-brand-gold/20 transition-colors duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease, delay: 0.2 + index * 0.1 }}
                        >
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 flex items-center justify-center border border-brand-gold/30 flex-shrink-0">
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
                    className="max-w-4xl mx-auto mt-12 p-6 bg-brand-gold/5 border border-brand-gold/20 text-center"
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
