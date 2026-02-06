import { motion } from 'framer-motion'

export function MarqueeText() {
  const text = "ACRO CLINIC  ◆  PREMIUM EQUIPMENT  ◆  PROFESSIONAL GEAR  ◆  "
  
  return (
    <motion.div 
      className="relative overflow-hidden py-10 my-20 border-y border-white/[0.06]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="flex whitespace-nowrap">
        <motion.div
          className="flex"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <span 
              key={i}
              className="text-2xl md:text-3xl text-white/[0.08] tracking-[0.3em] uppercase px-8"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}
            >
              {text}
            </span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

