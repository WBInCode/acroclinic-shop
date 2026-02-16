import { motion } from 'framer-motion'

const ease = [0.4, 0, 0.2, 1] as const

// Animowane cząsteczki złota
function GoldParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-brand-gold/30 rounded-full"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: -10,
            opacity: 0
          }}
          animate={{
            y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 10,
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ paddingTop: 'clamp(100px, 15vh, 200px)' }}>

      {/* Animowany gradient tła */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(212,175,55,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Złote cząsteczki */}
      <GoldParticles />

      {/* Główna treść */}
      <div className="relative z-10 text-center px-4">



        {/* Treść wewnątrz ramki - LOGO */}
        <div className="flex flex-col items-center relative z-10">
          {/* Logo AC - duże, w środku ramki */}
          <motion.img
            src="/images/logo.png"
            alt="AC"
            className="w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-72 lg:h-72 object-contain mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1, ease }}
            style={{
              filter: 'drop-shadow(0 0 30px rgba(212,175,55,0.4))'
            }}
          />

          {/* Premium Sportswear */}
          <motion.p
            className="text-brand-gold text-xs md:text-sm tracking-[0.4em] uppercase mb-4"
            style={{ fontFamily: "'Lato', sans-serif", fontWeight: 400 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            Premium Sportswear
          </motion.p>

          {/* Podtytuł */}
          <motion.p
            className="text-white/40 text-xs md:text-sm tracking-[0.25em] uppercase"
            style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            Sprzęt i akcesoria dla pasjonatów akrobatyki
          </motion.p>
        </div>


        {/* Przycisk - pod ramką */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
        >
          <button
            className="px-10 py-3.5 rounded-full border border-brand-gold/60 text-brand-gold text-[11px] tracking-[0.2em] uppercase transition-all duration-300 hover:bg-brand-gold hover:text-black"
            style={{ fontFamily: "'Lato', sans-serif", fontWeight: 500 }}
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Odkryj Kolekcję
          </button>
        </motion.div>
      </div>
    </section >
  )
}
