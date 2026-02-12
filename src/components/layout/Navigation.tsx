import { ShoppingCart, User, Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

interface NavigationProps {
  cartCount: number
  wishlistCount?: number
  onCartClick?: () => void
  onWishlistClick?: () => void
  onLogoClick?: () => void
  onUserClick?: () => void
  isAuthenticated?: boolean
}

const ease = [0.4, 0, 0.2, 1] as const

export function Navigation({ cartCount, wishlistCount = 0, onCartClick, onWishlistClick, onLogoClick, onUserClick, isAuthenticated = false }: NavigationProps) {
  return (
    <motion.nav 
      className="fixed left-0 right-0 z-50 top-[64px] md:top-[72px]"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease }}
    >
      {/* Eleganckie tło */}
      <div className="absolute inset-0 bg-[#0a0a0a]/95 backdrop-blur-md" />
      
      {/* Subtelna linia na dole */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />
      
      <div className="relative w-full max-w-7xl mx-auto px-6 h-[clamp(4rem,8vw,5rem)] flex items-center justify-between">
        {/* Logo */}
        <motion.button 
          onClick={onLogoClick}
          className="flex items-center gap-4 group cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease }}
          aria-label="Powrót do strony głównej"
        >
          {/* Logo image */}
          <div className="relative flex-shrink-0">
            <img 
              src="/images/logo.png" 
              alt="Acro Clinic" 
              className="relative object-contain h-8 w-8 md:h-16 md:w-16 opacity-90 group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>
          
          {/* Text - elegancka typografia */}
          <div className="flex flex-col min-w-0">
            <span 
              className="text-xl md:text-2xl font-light tracking-wide"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <span className="text-white/90 group-hover:text-white transition-colors duration-300">Acro</span>
              <span className="text-brand-gold italic ml-1">Clinic</span>
            </span>
          </div>
        </motion.button>

        {/* Icons - eleganckie, minimalistyczne */}
        <motion.div 
          className="flex items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease }}
        >
          {/* User button */}
          <button 
            onClick={onUserClick}
            className="relative group p-3 transition-all duration-300"
            aria-label="Konto użytkownika"
          >
            <User className="w-5 h-5 text-white/50 group-hover:text-brand-gold transition-colors duration-300" />
            {isAuthenticated && (
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-gold rounded-full" />
            )}
          </button>

          {/* Separator */}
          <div className="w-px h-4 bg-white/10 mx-1" />

          {/* Wishlist button */}
          <button 
            onClick={onWishlistClick}
            className="relative group p-3 transition-all duration-300"
            aria-label="Ulubione"
          >
            <Heart className="w-5 h-5 text-white/50 group-hover:text-brand-gold transition-colors duration-300" />
            {wishlistCount > 0 && (
              <span 
                className="absolute top-1.5 right-1.5 flex items-center justify-center w-4 h-4 bg-brand-gold text-[10px] text-black font-medium rounded-full"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                {wishlistCount}
              </span>
            )}
          </button>
          
          {/* Cart button */}
          <button 
            onClick={onCartClick}
            className="relative group p-3 transition-all duration-300"
            aria-label="Koszyk"
          >
            <ShoppingCart className="w-5 h-5 text-white/50 group-hover:text-brand-gold transition-colors duration-300" />
            {cartCount > 0 && (
              <span 
                className="absolute top-1.5 right-1.5 flex items-center justify-center w-4 h-4 bg-brand-gold text-[10px] text-black font-medium rounded-full"
                style={{ fontFamily: "'Lato', sans-serif" }}
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
