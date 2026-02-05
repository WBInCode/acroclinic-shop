import { ShoppingCart, Heart, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export interface Product {
  id: string
  name: string
  price: number
  image: string
  images?: string[] // Galeria zdjęć produktu
  sizes?: string[] // Dostępne rozmiary
  description?: string // Opis produktu
  features?: string[] // Cechy produktu
  materials?: string // Skład materiałowy
  badge?: 'NEW' | 'LIMITED'
  category: 'clothing' | 'accessories'
  isBestseller?: boolean
}

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product, selectedSize?: string, quantity?: number) => void
  onProductClick?: (product: Product) => void
  onToggleWishlist?: (product: Product) => void
  isInWishlist?: boolean
  index?: number
}

// Spójne animacje
const ease = [0.22, 1, 0.36, 1] as const

export function ProductCard({ product, onAddToCart, onProductClick, onToggleWishlist, isInWishlist = false, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showSizeModal, setShowSizeModal] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    // Jeśli produkt jest odzieżą i ma rozmiary, pokaż modal
    if (product.category === 'clothing' && product.sizes && product.sizes.length > 0) {
      setShowSizeModal(true)
      setSelectedSize(product.sizes[0] || '')
      setQuantity(1)
    } else {
      // Dla akcesoriów dodaj od razu
      onAddToCart(product, undefined, 1)
    }
  }

  const handleConfirmAddToCart = () => {
    if (product.category === 'clothing' && !selectedSize) {
      return // Nie dodawaj jeśli nie wybrano rozmiaru
    }
    
    onAddToCart(product, selectedSize || undefined, quantity)
    setShowSizeModal(false)
    setSelectedSize('')
    setQuantity(1)
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
            className={`absolute top-4 right-4 z-30 w-9 h-9 flex items-center justify-center backdrop-blur-sm rounded-full transition-all duration-300 border ${
              isInWishlist 
                ? 'bg-brand-gold/20 border-brand-gold/60 hover:bg-brand-gold/30' 
                : 'bg-black/40 border-brand-gold/30 hover:bg-black/60 hover:border-brand-gold/50'
            }`}
            onClick={handleToggleWishlist}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart 
              className={`w-4 h-4 transition-colors duration-300 ${
                isInWishlist 
                  ? 'text-brand-gold fill-brand-gold' 
                  : 'text-brand-gold/60 hover:text-brand-gold'
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

      {/* Modal wyboru rozmiaru i ilości */}
      <AnimatePresence>
        {showSizeModal && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSizeModal(false)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              className="relative bg-black/95 border border-white/20 text-white max-w-md w-full rounded-lg p-6"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowSizeModal(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="font-[family-name:var(--font-heading)] text-2xl text-brand-gold mb-6">
                {product.name}
              </h3>
          
              <div className="space-y-6">
                {/* Wybór rozmiaru */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white/80">Rozmiar</label>
                    <div className="flex gap-2 flex-wrap">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 border rounded-md transition-all ${
                            selectedSize === size
                              ? 'border-brand-gold bg-brand-gold/20 text-brand-gold'
                              : 'border-white/20 text-white/60 hover:border-white/40 hover:text-white'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Wybór ilości */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/80">Ilość</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 border border-white/20 rounded-md hover:border-brand-gold hover:text-brand-gold transition-all"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 border border-white/20 rounded-md hover:border-brand-gold hover:text-brand-gold transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Podsumowanie */}
                <div className="pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-white/60">Cena za sztukę:</span>
                    <span className="font-bold text-brand-gold">{product.price} PLN</span>
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-white/80 font-medium">Razem:</span>
                    <span className="font-bold text-2xl text-brand-gold">{(product.price * quantity).toFixed(2)} PLN</span>
                  </div>
                  
                  <Button
                    onClick={handleConfirmAddToCart}
                    disabled={product.category === 'clothing' && !selectedSize}
                    className="w-full btn-primary"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Dodaj do koszyka
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
