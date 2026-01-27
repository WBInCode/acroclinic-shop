import { motion } from 'framer-motion'

export function MarqueeText() {
  const text = "ACRO CLINIC • PREMIUM EQUIPMENT • PROFESSIONAL GEAR • "
  
  return (
    <motion.div 
      className="relative overflow-hidden py-8 my-16 border-y border-white/10"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex whitespace-nowrap">
        <motion.div
          className="flex"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <span 
              key={i}
              className="font-[family-name:var(--font-heading)] font-light text-2xl md:text-4xl text-white/20 tracking-[0.1em] uppercase px-4"
            >
              {text}
            </span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}
