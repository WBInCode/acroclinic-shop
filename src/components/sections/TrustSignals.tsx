import { Award, Shield, Zap } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'

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
    <section className="container mx-auto px-4 py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {signals.map((signal, index) => {
          const Icon = signal.icon
          return (
            <motion.div
              key={signal.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="backdrop-blur-md bg-card/70 border-[#1a1a1a] p-8 text-center hover:border-brand-gold/50 transition-all duration-300 group">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center group-hover:bg-brand-gold/20 transition-colors">
                    <Icon className="w-8 h-8 text-brand-gold" />
                  </div>
                </div>
                <h3 className="font-[family-name:var(--font-heading)] font-semibold text-lg text-brand-gold mb-2 tracking-tight">
                  {signal.title}
                </h3>
                <p className="text-white/70 text-sm font-[family-name:var(--font-body)]">
                  {signal.description}
                </p>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
