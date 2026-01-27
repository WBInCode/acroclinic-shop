import { ShoppingCart, User, Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

interface NavigationProps {
  cartCount: number
  wishlistCount?: number
  onCartClick?: () => void
  onWishlistClick?: () => void
  onLogoClick?: () => void
}

const ease = [0.22, 1, 0.36, 1] as const

export function Navigation({ cartCount, wishlistCount = 0, onCartClick, onWishlistClick, onLogoClick }: NavigationProps) {
  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease }}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black/80 backdrop-blur-xl" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/5 via-transparent to-brand-gold/5" />
      
      {/* Bottom border with gold accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
      
      <div className="relative w-full max-w-7xl mx-auto px-4 h-[clamp(2.75rem,6vw,4rem)] flex items-center justify-between">
        {/* Logo */}
        <motion.button 
          onClick={onLogoClick}
          className="flex items-center gap-[clamp(0.4rem,1.5vw,1rem)] group cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease }}
          aria-label="Powrót do strony głównej"
        >
          {/* Logo container with glow */}
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-brand-gold/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img 
              src="/images/logo.png" 
              alt="Acro Clinic" 
              className="relative object-contain"
              style={{ height: 'clamp(1.5rem, 4vw, 2.5rem)', width: 'clamp(1.5rem, 4vw, 2.5rem)' }}
            />
          </div>
          
          {/* Text with decorative elements */}
          <div className="flex flex-col min-w-0">
            <span 
              className="font-[family-name:var(--font-heading)] font-black leading-none whitespace-nowrap"
              style={{ fontSize: 'clamp(0.75rem, 2vw, 1.25rem)', letterSpacing: 'clamp(0.05em, 0.4vw, 0.15em)' }}
            >
              <span className="text-white group-hover:text-white/90 transition-colors">ACRO</span>
              <span className="text-brand-gold" style={{ marginLeft: 'clamp(0.2rem, 0.4vw, 0.4rem)' }}>CLINIC</span>
            </span>
            <span 
              className="text-white/30 uppercase hidden min-[480px]:block"
              style={{ fontSize: 'clamp(0.4rem, 0.8vw, 0.5rem)', letterSpacing: 'clamp(0.1em, 0.4vw, 0.3em)', marginTop: 'clamp(0.1rem, 0.2vw, 0.2rem)' }}
            >
              Premium Sportswear
            </span>
          </div>
        </motion.button>

        {/* Icons */}
        <motion.div 
          className="flex items-center"
          style={{ gap: 'clamp(0.2rem, 0.75vw, 0.4rem)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease }}
        >
          {/* Wishlist button */}
          <button 
            onClick={onWishlistClick}
            className="relative group rounded-full hover:bg-white/5 transition-all duration-300"
            style={{ padding: 'clamp(0.375rem, 1vw, 0.625rem)' }}
            aria-label="Ulubione"
          >
            <Heart 
              className="text-white/60 group-hover:text-brand-gold transition-colors duration-300" 
              style={{ width: 'clamp(1rem, 2vw, 1.25rem)', height: 'clamp(1rem, 2vw, 1.25rem)' }}
            />
            {wishlistCount > 0 && (
              <span 
                className="absolute flex items-center justify-center bg-brand-gold text-black font-bold rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                style={{ 
                  top: 'clamp(0rem, 0.3vw, 0.25rem)', 
                  right: 'clamp(0rem, 0.3vw, 0.25rem)',
                  height: 'clamp(0.75rem, 1.5vw, 1rem)',
                  width: 'clamp(0.75rem, 1.5vw, 1rem)',
                  fontSize: 'clamp(0.4rem, 0.8vw, 0.5rem)'
                }}
              >
                {wishlistCount}
              </span>
            )}
          </button>
          
          {/* Separator */}
          <div 
            className="bg-white/10"
            style={{ width: '1px', height: 'clamp(0.75rem, 2vw, 1.25rem)', margin: '0 clamp(0.2rem, 0.5vw, 0.375rem)' }}
          />
          
          {/* Cart button */}
          <button 
            onClick={onCartClick}
            className="relative group rounded-full hover:bg-white/5 transition-all duration-300"
            style={{ padding: 'clamp(0.375rem, 1vw, 0.625rem)' }}
            aria-label="Koszyk"
          >
            <ShoppingCart 
              className="text-white/60 group-hover:text-brand-gold transition-colors duration-300"
              style={{ width: 'clamp(1rem, 2vw, 1.25rem)', height: 'clamp(1rem, 2vw, 1.25rem)' }}
            />
            {cartCount > 0 && (
              <span 
                className="absolute flex items-center justify-center bg-brand-gold text-black font-bold rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                style={{ 
                  top: 'clamp(0rem, 0.3vw, 0.25rem)', 
                  right: 'clamp(0rem, 0.3vw, 0.25rem)',
                  height: 'clamp(0.75rem, 1.5vw, 1rem)',
                  width: 'clamp(0.75rem, 1.5vw, 1rem)',
                  fontSize: 'clamp(0.4rem, 0.8vw, 0.5rem)'
                }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </motion.div>
      </div>
    </motion.nav>
  )
}
