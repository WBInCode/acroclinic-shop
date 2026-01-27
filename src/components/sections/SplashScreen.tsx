import { motion } from 'framer-motion'

interface SplashScreenProps {
  onEnterShop: () => void
}

// Spójne animacje
const ease = [0.22, 1, 0.36, 1] as const

// Generuj losowe pozycje dla cząsteczek
const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  duration: Math.random() * 3 + 2,
  delay: Math.random() * 2,
}))

export function SplashScreen({ onEnterShop }: SplashScreenProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Gradient tło */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(212,175,55,0.08) 0%, transparent 50%)',
        }}
      />

      {/* Gwiazdy migające w tle */}
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: 3 + Math.random() * 4,
            height: 3 + Math.random() * 4,
            background: 'radial-gradient(circle, rgba(212,175,55,1) 0%, rgba(212,175,55,0.3) 50%, transparent 70%)',
            boxShadow: '0 0 8px rgba(212,175,55,0.8), 0 0 15px rgba(212,175,55,0.4)',
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.3, 1.2, 0.3],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            delay: Math.random() * 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Animowane cząsteczki */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-brand-gold/30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Animowana poświata */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 50%)',
          filter: 'blur(100px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Pierścienie */}
      {[1, 2, 3].map((ring) => (
        <motion.div
          key={ring}
          className="absolute rounded-full border"
          style={{
            width: 200 + ring * 120,
            height: 200 + ring * 120,
            borderColor: `rgba(212,175,55,${0.15 - ring * 0.04})`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 1.5, 
            delay: ring * 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}

      {/* Główna treść */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease }}
        >
          {/* Glow za logo */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 60%)',
              filter: 'blur(40px)',
              transform: 'scale(1.5)',
            }}
            animate={{
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          
          <img
            src="/images/logo.png"
            alt="Acro Clinic Logo"
            className="w-48 h-48 md:w-64 md:h-64 object-contain relative z-10"
            style={{ filter: 'drop-shadow(0 0 30px rgba(212,175,55,0.5))' }}
          />
        </motion.div>

        {/* Nazwa */}
        <motion.h1
          className="font-[family-name:var(--font-heading)] font-black text-4xl md:text-6xl text-white mb-2 tracking-tight"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease, delay: 0.3 }}
        >
          ACRO <span className="text-brand-gold">CLINIC</span>
        </motion.h1>

        {/* Linia */}
        <motion.div
          className="w-32 h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent mb-6"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease, delay: 0.5 }}
        />

        {/* Opis */}
        <motion.p
          className="text-white/50 text-sm md:text-base mb-10 font-[family-name:var(--font-body)] max-w-md text-center px-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease, delay: 0.6 }}
        >
          Sprzęt i akcesoria dla pasjonatów akrobatyki i tańca
        </motion.p>

        {/* Przycisk */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease, delay: 0.8 }}
        >
          <button onClick={onEnterShop} className="btn-primary btn-lg">
            Wejdź do sklepu
          </button>
        </motion.div>
      </div>

      {/* Winieta */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.8) 100%)',
        }}
      />
    </div>
  )
}
