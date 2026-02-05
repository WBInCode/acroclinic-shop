import { motion } from 'framer-motion'

export function WireframeBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-black">
      {/* Górny gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 90% 50% at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 50%)',
        }}
      />
      
      {/* Dolny gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 70% 40% at 50% 100%, rgba(212,175,55,0.05) 0%, transparent 40%)',
        }}
      />

      {/* Animowana poświata górna */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px]"
        style={{
          background: 'radial-gradient(ellipse, rgba(212,175,55,0.06) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
        animate={{
          opacity: [0.4, 0.6, 0.4],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Subtelna siatka */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.02]">
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(212,175,55,1)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Winieta */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, rgba(0,0,0,0.3) 100%)',
        }}
      />
    </div>
  )
}
