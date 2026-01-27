import { ShoppingCart, User, Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

interface NavigationProps {
  cartCount: number
  wishlistCount?: number
  onCartClick?: () => void
  onWishlistClick?: () => void
}

const ease = [0.22, 1, 0.36, 1] as const

export function Navigation({ cartCount, wishlistCount = 0, onCartClick, onWishlistClick }: NavigationProps) {
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
      
      <div className="relative container mx-auto px-8 h-24 flex items-center justify-between">
        {/* Logo */}
        <motion.a 
          href="#"
          className="flex items-center gap-5 group"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease }}
        >
          {/* Logo container with glow */}
          <div className="relative">
            <div className="absolute inset-0 bg-brand-gold/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img 
              src="/images/logo.png" 
              alt="Acro Clinic" 
              className="relative h-14 w-14 object-contain"
            />
          </div>
          
          {/* Text with decorative elements */}
          <div className="hidden sm:flex flex-col">
            <span className="font-[family-name:var(--font-heading)] font-black text-2xl tracking-[0.2em] leading-none">
              <span className="text-white group-hover:text-white/90 transition-colors">ACRO</span>
              <span className="text-brand-gold ml-2">CLINIC</span>
            </span>
            <span className="text-[10px] text-white/30 tracking-[0.4em] uppercase mt-1">Premium Sportswear</span>
          </div>
        </motion.a>

        {/* Icons */}
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease }}
        >
          {/* Wishlist button */}
          <button 
            onClick={onWishlistClick}
            className="relative group p-4 rounded-full hover:bg-white/5 transition-all duration-300"
            aria-label="Ulubione"
          >
            <Heart className="w-6 h-6 text-white/60 group-hover:text-brand-gold transition-colors duration-300" />
            {wishlistCount > 0 && (
              <span className="absolute top-2 right-2 h-5 w-5 flex items-center justify-center bg-brand-gold text-black text-[10px] font-bold rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]">
                {wishlistCount}
              </span>
            )}
          </button>
          
          {/* Separator */}
          <div className="w-px h-6 bg-white/10 mx-2" />
          
          {/* Cart button */}
          <button 
            onClick={onCartClick}
            className="relative group p-4 rounded-full hover:bg-white/5 transition-all duration-300"
            aria-label="Koszyk"
          >
            <ShoppingCart className="w-6 h-6 text-white/60 group-hover:text-brand-gold transition-colors duration-300" />
            {cartCount > 0 && (
              <span className="absolute top-2 right-2 h-5 w-5 flex items-center justify-center bg-brand-gold text-black text-[10px] font-bold rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]">
                {cartCount}
              </span>
            )}
          </button>
        </motion.div>
      </div>
    </motion.nav>
  )
}
