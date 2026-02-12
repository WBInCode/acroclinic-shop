import { motion } from 'framer-motion'
import { ArrowLeft, FileText, Shield, Truck, CreditCard, RotateCcw } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

interface TermsPageProps {
  onBack: () => void
}

export function TermsPage({ onBack }: TermsPageProps) {
  const sections = [
    {
      icon: FileText,
      title: '1. Postanowienia ogólne',
      content: [
        'Sklep internetowy Acro Clinic prowadzony jest przez firmę WB Partners Sp. z o.o. z siedzibą w Rzeszowie.',
        'Regulamin określa zasady korzystania ze sklepu, składania zamówień, dostawy oraz reklamacji.',
        'Korzystanie ze sklepu oznacza akceptację niniejszego regulaminu.'
      ]
    },
    {
      icon: CreditCard,
      title: '2. Składanie zamówień',
      content: [
        'Zamówienia można składać 24 godziny na dobę, 7 dni w tygodniu.',
        'Ceny podane w sklepie są cenami brutto i zawierają podatek VAT.',
        'Sklep zastrzega sobie prawo do zmiany cen produktów, przy czym zmiana nie dotyczy zamówień już złożonych.',
        'Warunkiem realizacji zamówienia jest prawidłowe wypełnienie formularza zamówienia.'
      ]
    },
    {
      icon: Shield,
      title: '3. Płatności',
      content: [
        'Akceptowane metody płatności: przelew bankowy, płatność kartą, BLIK, PayPal.',
        'Płatność należy uiścić w ciągu 7 dni od złożenia zamówienia.',
        'W przypadku braku płatności zamówienie zostanie anulowane.',
        'Wszystkie transakcje są szyfrowane i bezpieczne.'
      ]
    },
    {
      icon: Truck,
      title: '4. Dostawa',
      content: [
        'Dostawa realizowana jest na terenie całej Polski.',
        'Czas realizacji zamówienia wynosi od 1 do 5 dni roboczych w przypadku akcesorii. W przypadku sprzętu sportowego czas realizacji może wynosić do 21 dni roboczych ze względu na realizacje ciuchów w szwalni.',
        'Koszt dostawy jest podawany przy składaniu zamówienia.'
      ]
    },
    {
      icon: RotateCcw,
      title: '5. Zwroty i reklamacje',
      content: [
        'Klient ma prawo odstąpić od umowy w ciągu 14 dni bez podania przyczyny.',
        'Zwracany towar musi być nieużywany, w oryginalnym opakowaniu.',
        'Reklamacje rozpatrywane są w ciągu 14 dni roboczych.',
        'Koszty zwrotu towaru ponosi kupujący, chyba że towar był wadliwy.'
      ]
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease }}
      className="min-h-screen pt-36 pb-32"
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
            <span className="text-brand-gold">Regulamin</span>
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent mx-auto mb-6" />
          <p className="text-white/40 text-sm font-[family-name:var(--font-body)]">
            Ostatnia aktualizacja: Styczeń 2026
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
            W przypadku pytań dotyczących regulaminu, prosimy o kontakt: 
            <a href="mailto:support@wb-partners.pl" className="text-brand-gold hover:underline ml-1">
              support@wb-partners.pl
            </a>
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
