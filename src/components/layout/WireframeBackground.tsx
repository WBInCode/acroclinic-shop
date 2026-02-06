import { motion } from 'framer-motion'

export function WireframeBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0a0a0a]">
      {/* Subtelny gradient górny - złoty blask */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 100% 40% at 50% 0%, rgba(212,175,55,0.04) 0%, transparent 60%)',
        }}
      />
      
      {/* Subtelny gradient dolny */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 30% at 50% 100%, rgba(212,175,55,0.02) 0%, transparent 50%)',
        }}
      />

      {/* Elegancka winieta */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 20%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* Delikatna tekstura szumu */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
