import { Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ContactSection() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="backdrop-blur-md bg-brand-gold/10 border border-brand-gold/30 rounded-lg p-12 text-center">
        <h2 className="font-[family-name:var(--font-heading)] font-bold text-3xl md:text-4xl text-white mb-4 tracking-tight">
          POTRZEBUJESZ POMOCY?
        </h2>
        <p className="text-white/80 text-lg mb-8 font-[family-name:var(--font-body)]">
          Nasz zespół ekspertów jest gotowy, aby pomóc Ci wybrać idealne wyposażenie
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
          <a
            href="tel:512206471"
            className="flex items-center gap-3 text-brand-gold hover:text-brand-gold/80 transition-colors"
          >
            <Phone className="w-6 h-6" />
            <span className="font-[family-name:var(--font-heading)] font-semibold text-2xl tracking-tight">
              512 206 471
            </span>
          </a>

          <div className="hidden md:block w-px h-8 bg-brand-gold/30" />

          <a
            href="mailto:kontakt@acroclinic.pl"
            className="flex items-center gap-3 text-white/80 hover:text-white transition-colors"
          >
            <Mail className="w-5 h-5" />
            <span className="font-[family-name:var(--font-body)] font-medium">
              kontakt@acroclinic.pl
            </span>
          </a>
        </div>

        <Button
          size="lg"
          className="bg-brand-gold hover:bg-brand-gold/90 text-black font-[family-name:var(--font-body)] font-semibold text-sm uppercase tracking-wider px-8 py-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(219,166,10,0.6)] hover:scale-105"
        >
          UMÓW KONSULTACJĘ
        </Button>
      </div>
    </section>
  )
}
