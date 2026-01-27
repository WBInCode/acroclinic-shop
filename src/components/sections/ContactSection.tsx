import { Phone, Mail, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'

// Spójne animacje
const transition = { duration: 0.8, ease: [0.22, 1, 0.36, 1] }

interface ContactSectionProps {
  onContactClick?: () => void
}

export function ContactSection({ onContactClick }: ContactSectionProps) {
  return (
    <motion.section 
      className="container mx-auto px-4 py-24"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={transition}
    >
      <div className="max-w-2xl mx-auto text-center">
        <motion.span 
          className="text-xs uppercase tracking-[0.3em] text-brand-gold/60 font-[family-name:var(--font-body)] block mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ ...transition, delay: 0.1 }}
        >
          Kontakt
        </motion.span>
        
        <motion.h2 
          className="font-[family-name:var(--font-heading)] font-bold text-3xl md:text-4xl text-white mb-6 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...transition, delay: 0.2 }}
        >
          POTRZEBUJESZ POMOCY?
        </motion.h2>
        <motion.div
          className="w-16 h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent mx-auto mb-8"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ ...transition, delay: 0.3 }}
        />

        <motion.p 
          className="text-white/50 text-base mb-12 font-[family-name:var(--font-body)] font-light"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...transition, delay: 0.4 }}
        >
          Nasz zespół ekspertów jest gotowy, aby pomóc Ci wybrać idealne wyposażenie
        </motion.p>

        <motion.div 
          className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...transition, delay: 0.5 }}
        >
          <a
            href="tel:536200535"
            className="flex items-center gap-3 text-white hover:text-brand-gold transition-colors duration-300"
          >
            <Phone className="w-5 h-5 text-brand-gold" />
            <span className="font-[family-name:var(--font-heading)] font-semibold text-xl tracking-tight">
              536 200 535
            </span>
          </a>

          <div className="hidden md:block w-px h-6 bg-white/20" />

          <a
            href="mailto:acro.clinic.rk@gmail.com"
            className="flex items-center gap-3 text-white/60 hover:text-white transition-colors duration-300"
          >
            <Mail className="w-5 h-5 text-brand-gold/60" />
            <span className="font-[family-name:var(--font-body)]">
              acro.clinic.rk@gmail.com
            </span>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...transition, delay: 0.6 }}
        >
          <button 
            onClick={onContactClick}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Napisz do nas
          </button>
        </motion.div>
      </div>
    </motion.section>
  )
}
