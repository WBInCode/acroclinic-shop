import { ShoppingCart, Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { useState } from 'react'

export interface Product {
  id: string
  name: string
  price: number
  image: string
  badge?: 'NEW' | 'LIMITED'
  category: 'clothing' | 'accessories'
  isBestseller?: boolean
}

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  onProductClick?: (product: Product) => void
  onToggleWishlist?: (product: Product) => void
  isInWishlist?: boolean
  index?: number
}

// Spójne animacje
const ease = [0.22, 1, 0.36, 1] as const

export function ProductCard({ product, onAddToCart, onProductClick, onToggleWishlist, isInWishlist = false, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToCart(product)
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleWishlist?.(product)
  }

  const handleClick = () => {
    onProductClick?.(product)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, ease, delay: index * 0.08 }}
    >
      <motion.div
        className="group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.4, ease }}
      >
        {/* Image container */}
        <div className="relative aspect-square overflow-hidden bg-white/[0.02] border border-white/10 mb-4 group-hover:border-brand-gold/40 transition-colors duration-500">
          {/* Glow effect on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-10"
            style={{ boxShadow: 'inset 0 0 60px rgba(212,175,55,0.15)' }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />
          
          {/* Image */}
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            animate={{ 
              scale: isHovered ? 1.08 : 1,
            }}
            transition={{ duration: 0.6, ease }}
          />
          
          {/* Overlay */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
            animate={{ opacity: isHovered ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}
          />

          {/* Badge */}
          {product.badge && (
            <motion.div 
              className="absolute top-4 left-4 z-20"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="bg-brand-gold text-black border-none font-[family-name:var(--font-heading)] font-bold text-[10px] uppercase tracking-wider px-3 py-1">
                {product.badge}
              </Badge>
            </motion.div>
          )}

          {/* Wishlist button */}
          <motion.button
            className="absolute top-4 right-4 z-30 w-9 h-9 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-full transition-all duration-300 hover:bg-black/80"
            onClick={handleToggleWishlist}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart 
              className={`w-4 h-4 transition-colors duration-300 ${
                isInWishlist 
                  ? 'text-red-500 fill-red-500' 
                  : 'text-white/60 hover:text-white'
              }`} 
            />
          </motion.button>

          {/* Add to cart button */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              className="btn-primary btn-sm"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3, ease }}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4" />
              Dodaj
            </motion.button>
          </motion.div>

          {/* Corner accents on hover */}
          <motion.div
            className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-brand-gold z-20"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.5 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-brand-gold z-20"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.5 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          />
          <motion.div
            className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-brand-gold z-20"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.5 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          />
          <motion.div
            className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-brand-gold z-20"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.5 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          />
        </div>

        {/* Product info */}
        <div className="space-y-2">
          <h3 className="font-[family-name:var(--font-body)] font-medium text-sm text-white/80 group-hover:text-white transition-colors duration-300 line-clamp-1">
            {product.name}
          </h3>
          <motion.p 
            className="font-[family-name:var(--font-heading)] font-bold text-lg text-brand-gold"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {product.price} PLN
          </motion.p>
        </div>

        {/* Mobile add button */}
        <button
          className="md:hidden btn-primary btn-sm btn-full mt-4"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-4 h-4" />
          Dodaj do koszyka
        </button>
      </motion.div>
    </motion.div>
  )
}
