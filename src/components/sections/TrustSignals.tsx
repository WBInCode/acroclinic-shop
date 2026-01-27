import { Award, Shield, Zap } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'

// Spójne animacje
const ease = [0.22, 1, 0.36, 1] as const

export function TrustSignals() {
  const signals = [
    {
      icon: Award,
      title: 'PREMIUM ATELIER',
      description: 'Najwyższa jakość materiałów i wykonania',
    },
    {
      icon: Shield,
      title: 'ELITE CLINIC',
      description: 'Wsparcie eksperckie i doradztwo',
    },
    {
      icon: Zap,
      title: 'PRIORITY ACCESS',
      description: 'Pierwszeństwo do limitowanych kolekcji',
    },
  ]

  return (
    <motion.section 
      className="container mx-auto px-4 py-24 relative"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease }}
    >
      {/* Section title */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease }}
      >
        <span className="text-xs uppercase tracking-[0.3em] text-brand-gold/60 font-[family-name:var(--font-body)] block mb-4">Nasza obietnica</span>
        <h2 className="font-[family-name:var(--font-heading)] font-bold text-3xl md:text-4xl text-white uppercase tracking-tight">
          DLACZEGO <span className="text-brand-gold">MY?</span>
        </h2>
        <motion.div
          className="w-16 h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent mx-auto mt-6"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease, delay: 0.2 }}
        />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {signals.map((signal, index) => {
          const Icon = signal.icon
          return (
            <motion.div
              key={signal.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease, delay: index * 0.15 }}
            >
              <Card className="relative bg-white/[0.02] border-white/10 p-10 text-center hover:border-brand-gold/40 transition-all duration-500 group overflow-hidden"
              >
                {/* Hover glow */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'radial-gradient(circle at center, rgba(212,175,55,0.08) 0%, transparent 70%)' }}
                />
                
                <div className="flex justify-center mb-8 relative">
                  <motion.div 
                    className="w-16 h-16 rounded-full border border-brand-gold/30 flex items-center justify-center group-hover:border-brand-gold/60 group-hover:bg-brand-gold/10 transition-all duration-500"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Icon className="w-7 h-7 text-brand-gold" />
                  </motion.div>
                </div>
                
                <h3 className="font-[family-name:var(--font-heading)] font-bold text-base text-white mb-3 uppercase tracking-wide relative">
                  {signal.title}
                </h3>
                <p className="text-white/50 text-sm font-[family-name:var(--font-body)] leading-relaxed relative">
                  {signal.description}
                </p>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </motion.section>
  )
}
