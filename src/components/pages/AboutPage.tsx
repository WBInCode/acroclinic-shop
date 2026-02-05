import { motion } from 'framer-motion'
import { ArrowLeft, Award, Users, Target, Heart } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

interface AboutPageProps {
  onBack: () => void
}

export function AboutPage({ onBack }: AboutPageProps) {
  const values = [
    
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
          <span className="text-xs uppercase tracking-[0.3em] text-brand-gold/60 font-[family-name:var(--font-body)] block mb-4">Poznaj nas</span>
          <h1 className="font-[family-name:var(--font-heading)] font-bold text-4xl md:text-5xl text-white uppercase tracking-tight mb-6">
            O <span className="text-brand-gold">Nas</span>
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent mx-auto" />
        </motion.div>

        {/* Story section */}
        <motion.div
          className="max-w-3xl mx-auto mb-24"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.2 }}
        >
          <div className="relative p-8 md:p-12 bg-white/[0.02] border border-white/10">
            <div className="absolute top-0 left-8 w-16 h-px bg-brand-gold" />
            <div className="absolute top-0 left-0 w-px h-16 bg-brand-gold" />
            
            <h2 className="font-[family-name:var(--font-heading)] font-bold text-2xl text-white mb-6">
              Nasza Historia
            </h2>
            <p className="text-white/60 font-[family-name:var(--font-body)] leading-relaxed mb-6">
              Acro Clinic to szkoła zajęć z akrobatyki i tańca z siedzibą w Kolbuszowej. Prowadzimy zajęcia w Szkole Podstawowej nr 1 im. Henryka Sienkiewicza, gdzie uczymy dzieci i młodzież sztuki ruchu, elastyczności i koordynacji.
            </p>
            <p className="text-white/60 font-[family-name:var(--font-body)] leading-relaxed mb-6">
              Organizujemy również półkolonie dla dzieci od 7 roku życia, gdzie zapewniamy wykwalifikowaną kadrę opiekunów i trenerów. Nasz program obejmuje treningi akrobatyki, tańca, szkolenia, warsztaty oraz zabawy psychoedukacyjne.
            </p>
            <p className="text-white/60 font-[family-name:var(--font-body)] leading-relaxed">
              Jako oficjalny partner WB Partners, oferujemy również wysokiej jakości sprzęt i akcesoria dla pasjonatów akrobatyki. Naszą misją jest wspieranie rozwoju każdego sportowca - od początkujących po zawodowców.
            </p>
            
            <div className="absolute bottom-0 right-8 w-16 h-px bg-brand-gold" />
            <div className="absolute bottom-0 right-0 w-px h-16 bg-brand-gold" />
          </div>
        </motion.div>

        
      </div>
    </motion.div>
  )
}
