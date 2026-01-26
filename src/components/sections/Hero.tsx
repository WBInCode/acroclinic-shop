import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black z-10" />
        <img
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1920&h=1080&fit=crop"
          alt="Elite Athlete Training"
          className="w-full h-full object-cover opacity-40"
        />
      </div>

      <div className="container mx-auto px-4 z-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-[family-name:var(--font-heading)] font-bold text-4xl md:text-6xl tracking-tight uppercase"
          >
            <span className="text-white">WEJDŹ DO GRY</span>
            <br />
            <span className="text-brand-gold">ACRO EDITION</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto font-[family-name:var(--font-body)]"
          >
            Sprzęt treningowy dla elity. Premium jakość dla maksymalnej wydajności.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Button
              size="lg"
              className="bg-brand-gold hover:bg-brand-gold/90 text-black font-[family-name:var(--font-body)] font-semibold text-sm uppercase tracking-wider px-8 py-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(219,166,10,0.6)] hover:scale-105"
            >
              SPRAWDŹ KOLEKCJĘ
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 border-2 border-brand-gold rounded-full flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-brand-gold rounded-full" />
        </motion.div>
      </div>
    </section>
  )
}
