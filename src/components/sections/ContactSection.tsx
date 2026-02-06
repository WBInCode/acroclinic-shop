import { Phone, Mail, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'

// Eleganckie animacje
const transition = { duration: 0.6, ease: [0.4, 0, 0.2, 1] }

interface ContactSectionProps {
  onContactClick?: () => void
}

export function ContactSection({ onContactClick }: ContactSectionProps) {
  return (
    <motion.section 
      className="container mx-auto px-6 py-32"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={transition}
    >
      <div className="max-w-2xl mx-auto text-center">
        <motion.span 
          className="text-xs tracking-[0.4em] uppercase text-brand-gold/50 block mb-6"
          style={{ fontFamily: "'Lato', sans-serif" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ ...transition, delay: 0.1 }}
        >
          Kontakt
        </motion.span>
        
        <motion.h2 
          className="text-4xl md:text-5xl text-white font-light mb-8"
          style={{ fontFamily: "'Playfair Display', serif" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...transition, delay: 0.2 }}
        >
          Potrzebujesz <span className="text-brand-gold italic">pomocy?</span>
        </motion.h2>
        
        <motion.div
          className="flex items-center justify-center gap-4 mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ ...transition, delay: 0.3 }}
        >
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-brand-gold/30" />
          <div className="w-1.5 h-1.5 rotate-45 border border-brand-gold/40" />
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-brand-gold/30" />
        </motion.div>

        <motion.p 
          className="text-white/40 text-base mb-14 font-light tracking-wide"
          style={{ fontFamily: "'Lato', sans-serif" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...transition, delay: 0.4 }}
        >
          Nasz zespół ekspertów jest gotowy, aby pomóc Ci wybrać idealne wyposażenie
        </motion.p>

        <motion.div 
          className="flex flex-col md:flex-row items-center justify-center gap-10 mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...transition, delay: 0.5 }}
        >
          <a
            href="tel:570034367"
            className="flex items-center gap-3 group"
          >
            <Phone className="w-4 h-4 text-brand-gold/60" />
            <span 
              className="text-white/70 group-hover:text-brand-gold transition-colors duration-300 text-lg tracking-wide"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              570 034 367
            </span>
          </a>

          <div className="hidden md:block w-px h-6 bg-white/10" />

          <a
            href="mailto:support@wb-partners.pl"
            className="flex items-center gap-3 group"
          >
            <Mail className="w-4 h-4 text-brand-gold/60" />
            <span 
              className="text-white/50 group-hover:text-white/80 transition-colors duration-300 text-sm tracking-wide"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              support@wb-partners.pl
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
            className="btn-secondary inline-flex items-center gap-3"
          >
            <MessageCircle className="w-4 h-4" />
            Napisz do nas
          </button>
        </motion.div>
      </div>
    </motion.section>
  )
}

