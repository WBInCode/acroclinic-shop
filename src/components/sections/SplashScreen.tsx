import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface SplashScreenProps {
  onEnterShop: () => void
}

const ease = [0.22, 1, 0.36, 1] as const

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

export function SplashScreen({ onEnterShop }: SplashScreenProps) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsReady(true), 100)
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-[#080808] flex flex-col items-center justify-center overflow-hidden">
      
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
        
        {/* Acro Clinic - główny tytuł NA GÓRZE */}
        <motion.h1
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.span 
            className="text-white text-4xl sm:text-5xl md:text-6xl inline-block"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease }}
          >
            Acro
          </motion.span>
          <span className="inline-block w-3" />
          <motion.span 
            className="text-brand-gold text-4xl sm:text-5xl md:text-6xl italic inline-block"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5, ease }}
          >
            Clinic
          </motion.span>
        </motion.h1>

        {/* Ramka z zaokrąglonymi rogami */}
        <motion.div 
          className="relative px-12 sm:px-20 md:px-32 lg:px-40 py-16 md:py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* Jedna spójna zaokrąglona ramka */}
          <motion.div
            className="absolute inset-0 border-2 border-brand-gold"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            style={{
              borderRadius: '2.5rem',
              boxShadow: '0 0 40px rgba(212,175,55,0.15), inset 0 0 40px rgba(212,175,55,0.05)'
            }}
          />

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
        </motion.div>

        {/* Przycisk - elegancki z animacją */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <motion.button
            className="relative px-14 py-4 rounded-full text-brand-gold text-xs tracking-[0.25em] uppercase overflow-hidden group border border-brand-gold/50 hover:border-brand-gold hover:bg-brand-gold transition-all duration-300"
            style={{ fontFamily: "'Lato', sans-serif", fontWeight: 500 }}
            onClick={onEnterShop}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Text */}
            <span className="relative z-10 group-hover:text-black transition-colors duration-300">
              Odkryj Kolekcję
            </span>
          </motion.button>
        </motion.div>
      </div>

      {/* Elegancka winieta */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(8,8,8,0.9) 100%)',
        }}
      />
    </div>
  )
}
