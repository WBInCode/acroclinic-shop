import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
}

const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32">
      {/* Dekoracyjne linie */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute left-1/2 top-0 w-px h-full -translate-x-1/2"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(212,175,55,0.2) 30%, rgba(212,175,55,0.2) 70%, transparent)' }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease }}
        />
        
        <motion.div
          className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.15) 30%, rgba(212,175,55,0.15) 70%, transparent)' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease }}
        />

        {/* Narożniki */}
        <motion.div
          className="absolute top-36 left-16 w-20 h-20 border-l-2 border-t-2 border-brand-gold/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        />
        <motion.div
          className="absolute top-36 right-16 w-20 h-20 border-r-2 border-t-2 border-brand-gold/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        />
        <motion.div
          className="absolute bottom-24 left-16 w-20 h-20 border-l-2 border-b-2 border-brand-gold/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        />
        <motion.div
          className="absolute bottom-24 right-16 w-20 h-20 border-r-2 border-b-2 border-brand-gold/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        />
      </div>

      {/* Centralne światło */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 50%)',
          filter: 'blur(60px)',
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease }}
      />
      
      {/* Pulsujące pierścienie */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full border border-brand-gold/15 pointer-events-none"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-brand-gold/10 pointer-events-none"
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0, 0.15] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />

      {/* Główna treść */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          className="mb-6"
          {...fadeUp}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
        >
          <span className="inline-block px-4 py-2 text-xs uppercase tracking-[0.25em] text-brand-gold/70 border border-brand-gold/20 rounded-full">
            Premium Equipment
          </span>
        </motion.div>

        <motion.h1
          className="font-[family-name:var(--font-heading)] font-black text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-[0.95] tracking-tight"
          {...fadeUp}
          transition={{ duration: 0.6, ease, delay: 0.2 }}
        >
          <span className="block">ACRO</span>
          <span className="block text-brand-gold">CLINIC</span>
        </motion.h1>

        <motion.div
          className="w-20 h-0.5 bg-gradient-to-r from-transparent via-brand-gold to-transparent mx-auto mb-6"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease, delay: 0.4 }}
        />

        <motion.p
          className="text-lg md:text-xl text-white/50 mb-10 max-w-lg mx-auto leading-relaxed font-[family-name:var(--font-body)]"
          {...fadeUp}
          transition={{ duration: 0.6, ease, delay: 0.5 }}
        >
          Profesjonalny sprzęt akrobatyczny dla wymagających sportowców
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, ease, delay: 0.6 }}
        >
          <button
            className="btn-secondary"
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Odkryj Kolekcję
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 text-white/30"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  )
}
