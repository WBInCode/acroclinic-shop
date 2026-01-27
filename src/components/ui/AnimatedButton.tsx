import { motion, type Variants } from 'framer-motion'
import { ReactNode } from 'react'

// Spójne animacje
const ease = [0.22, 1, 0.36, 1] as const

interface AnimatedButtonProps {
  children: ReactNode
  onClick?: (e: React.MouseEvent) => void
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  fullWidth?: boolean
  disabled?: boolean
  icon?: ReactNode
}

const buttonVariants: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.03,
    transition: { duration: 0.2, ease }
  },
  tap: { 
    scale: 0.97,
    transition: { duration: 0.1, ease }
  }
}

const shineVariants: Variants = {
  initial: { x: '-100%', opacity: 0 },
  hover: { 
    x: '100%', 
    opacity: [0, 1, 1, 0],
    transition: { duration: 0.6, ease }
  }
}

const glowVariants: Variants = {
  initial: { opacity: 0 },
  hover: { 
    opacity: 1,
    transition: { duration: 0.3 }
  }
}

const fillVariants: Variants = {
  initial: { scaleX: 0 },
  hover: { 
    scaleX: 1,
    transition: { duration: 0.4, ease }
  }
}

export function AnimatedButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  fullWidth = false,
  disabled = false,
  icon
}: AnimatedButtonProps) {
  const sizeClasses = {
    sm: 'px-6 py-3 text-xs',
    md: 'px-10 py-4 text-sm',
    lg: 'px-12 py-5 text-base'
  }

  const baseClasses = `
    relative overflow-hidden
    font-[family-name:var(--font-heading)] font-bold uppercase tracking-widest
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
  `

  if (variant === 'primary') {
    return (
      <motion.button
        className={`${baseClasses} bg-brand-gold text-black ${className}`}
        onClick={disabled ? undefined : onClick}
        variants={buttonVariants}
        initial="initial"
        whileHover={disabled ? undefined : "hover"}
        whileTap={disabled ? undefined : "tap"}
      >
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none"
          variants={shineVariants}
        />
        
        {/* Glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: '0 0 30px rgba(212,175,55,0.5), inset 0 0 20px rgba(255,255,255,0.1)' }}
          variants={glowVariants}
        />
        
        <span className="relative z-10 flex items-center justify-center gap-3">
          {icon}
          {children}
        </span>
      </motion.button>
    )
  }

  if (variant === 'secondary') {
    return (
      <motion.button
        className={`${baseClasses} bg-transparent border-2 border-brand-gold text-brand-gold group ${className}`}
        onClick={disabled ? undefined : onClick}
        variants={buttonVariants}
        initial="initial"
        whileHover={disabled ? undefined : "hover"}
        whileTap={disabled ? undefined : "tap"}
      >
        {/* Fill background */}
        <motion.div
          className="absolute inset-0 bg-brand-gold origin-left"
          variants={fillVariants}
        />
        
        {/* Glow on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: '0 0 30px rgba(212,175,55,0.3)' }}
          variants={glowVariants}
        />
        
        <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-black transition-colors duration-300">
          {icon}
          {children}
        </span>
      </motion.button>
    )
  }

  // Ghost variant
  return (
    <motion.button
      className={`${baseClasses} bg-white/5 border border-white/20 text-white/70 hover:text-white hover:border-white/40 ${className}`}
      onClick={disabled ? undefined : onClick}
      variants={buttonVariants}
      initial="initial"
      whileHover={disabled ? undefined : "hover"}
      whileTap={disabled ? undefined : "tap"}
    >
      {/* Subtle glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 20px rgba(255,255,255,0.05)' }}
        variants={glowVariants}
      />
      
      <span className="relative z-10 flex items-center justify-center gap-3">
        {icon}
        {children}
      </span>
    </motion.button>
  )
}

// Prosty przycisk z efektem ripple
export function RippleButton({
  children,
  onClick,
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <motion.button
      className={`relative overflow-hidden ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease }}
    >
      <motion.span
        className="absolute inset-0 bg-white/10 rounded-full"
        initial={{ scale: 0, opacity: 0.5 }}
        whileTap={{ 
          scale: 4, 
          opacity: 0,
          transition: { duration: 0.5, ease: 'easeOut' }
        }}
        style={{ transformOrigin: 'center' }}
      />
      {children}
    </motion.button>
  )
}
