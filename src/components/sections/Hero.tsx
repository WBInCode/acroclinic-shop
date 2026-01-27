import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

// Spójne animacje - te same parametry wszędzie
const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
}

const ease = [0.22, 1, 0.36, 1] as const

// Particles for background
const particles = [...Array(12)].map((_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 10 + 8,
  delay: Math.random() * 5,
}))

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dekoracyjne linie */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Pionowa linia środkowa */}
        <motion.div
          className="absolute left-1/2 top-0 w-px h-full -translate-x-1/2"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(212,175,55,0.3) 30%, rgba(212,175,55,0.3) 70%, transparent)' }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, delay: 0.5, ease }}
        />
        
        {/* Pozioma linia */}
        <motion.div
          className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.2) 30%, rgba(212,175,55,0.2) 70%, transparent)' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.7, ease }}
        />

        {/* Narożniki */}
        <motion.div
          className="absolute top-20 left-20 w-24 h-24 border-l-2 border-t-2 border-brand-gold/30"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1, ease }}
        />
        <motion.div
          className="absolute top-20 right-20 w-24 h-24 border-r-2 border-t-2 border-brand-gold/30"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.1, ease }}
        />
        <motion.div
          className="absolute bottom-32 left-20 w-24 h-24 border-l-2 border-b-2 border-brand-gold/30"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.2, ease }}
        />
        <motion.div
          className="absolute bottom-32 right-20 w-24 h-24 border-r-2 border-b-2 border-brand-gold/30"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.3, ease }}
        />
      </div>

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={`hero-p-${particle.id}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: 'rgba(212,175,55,0.6)',
            boxShadow: '0 0 10px rgba(212,175,55,0.4)',
          }}
          animate={{
            y: [0, -100],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Centralne światło */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 50%)',
          filter: 'blur(80px)',
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease }}
      />
      
      {/* Pulsujące pierścienie */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-brand-gold/20 pointer-events-none"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-brand-gold/10 pointer-events-none"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0, 0.2],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Główna treść */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Mały napis nad tytułem */}
        <motion.div
          className="mb-6"
          {...fadeUp}
          transition={{ duration: 0.8, ease, delay: 0.2 }}
        >
          <span className="inline-block px-4 py-2 text-xs uppercase tracking-[0.3em] text-brand-gold/80 border border-brand-gold/20 rounded-full font-[family-name:var(--font-body)]">
            Premium Equipment
          </span>
        </motion.div>

        {/* Główny tytuł */}
        <motion.h1
          className="font-[family-name:var(--font-heading)] font-black text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-[0.9] tracking-tight"
          {...fadeUp}
          transition={{ duration: 0.8, ease, delay: 0.4 }}
        >
          <span className="block">ACRO</span>
          <span className="block text-brand-gold" style={{ textShadow: '0 0 60px rgba(212,175,55,0.4)' }}>
            CLINIC
          </span>
        </motion.h1>

        {/* Linia pod tytułem */}
        <motion.div
          className="w-24 h-0.5 bg-gradient-to-r from-transparent via-brand-gold to-transparent mx-auto mb-8"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease, delay: 0.6 }}
        />

        {/* Podtytuł */}
        <motion.p
          className="text-lg md:text-xl text-white/60 mb-12 max-w-xl mx-auto leading-relaxed font-[family-name:var(--font-body)] font-light"
          {...fadeUp}
          transition={{ duration: 0.8, ease, delay: 0.7 }}
        >
          Profesjonalny sprzęt akrobatyczny dla wymagających sportowców
        </motion.p>

        {/* Przycisk */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.8, ease, delay: 0.9 }}
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
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <motion.div
          className="flex flex-col items-center gap-3 text-white/40"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-[family-name:var(--font-body)]">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  )
}
