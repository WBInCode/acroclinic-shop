import { motion } from 'framer-motion'

interface SplashScreenProps {
  onEnterShop: () => void
}

const ease = [0.22, 1, 0.36, 1] as const

export function SplashScreen({ onEnterShop }: SplashScreenProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Tło gradientowe */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(212,175,55,0.1) 0%, transparent 50%)',
        }}
      />

      {/* Pulsująca poświata */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 60%)',
          filter: 'blur(60px)',
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
            width: 180 + ring * 100,
            height: 180 + ring * 100,
            borderColor: `rgba(212,175,55,${0.3 - ring * 0.08})`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 1, 
            delay: 0.2 + ring * 0.15,
            ease,
          }}
        />
      ))}

      {/* Fale rozchodzące się */}
      {[1, 2, 3].map((wave) => (
        <motion.div
          key={`wave-${wave}`}
          className="absolute rounded-full border"
          style={{
            width: 100,
            height: 100,
            borderColor: 'rgba(212,175,55,0.4)',
          }}
          animate={{ 
            scale: [0, 6], 
            opacity: [0.5, 0] 
          }}
          transition={{
            duration: 3,
            delay: wave * 1,
            repeat: Infinity,
            ease: 'easeOut',
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
          transition={{ duration: 0.8, ease }}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(212,175,55,0.5) 0%, transparent 60%)',
              filter: 'blur(40px)',
              transform: 'scale(1.5)',
            }}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          
          <img
            src="/images/logo.png"
            alt="Acro Clinic Logo"
            className="w-40 h-40 md:w-56 md:h-56 object-contain relative z-10"
            style={{ filter: 'drop-shadow(0 0 30px rgba(212,175,55,0.5))' }}
          />
        </motion.div>

        {/* Nazwa */}
        <motion.h1
          className="font-[family-name:var(--font-heading)] font-black text-4xl md:text-6xl text-white mb-3 tracking-tight"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease, delay: 0.2 }}
        >
          ACRO <span className="text-brand-gold">CLINIC</span>
        </motion.h1>

        {/* Linia */}
        <motion.div
          className="w-24 h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent mb-5"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease, delay: 0.4 }}
        />

        {/* Opis */}
        <motion.p
          className="text-white/50 text-sm md:text-base mb-8 font-[family-name:var(--font-body)] max-w-sm text-center px-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease, delay: 0.5 }}
        >
          Sprzęt i akcesoria dla pasjonatów akrobatyki
        </motion.p>

        {/* Przycisk */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease, delay: 0.6 }}
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
