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
  stock?: number
}

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product, selectedSize?: string, quantity?: number) => void
  onProductClick?: (product: Product) => void
  onToggleWishlist?: (product: Product) => void
  isInWishlist?: boolean
  index?: number
}

// Spójne animacje - eleganckie
const ease = [0.4, 0, 0.2, 1] as const

export function ProductCard({ product, onAddToCart, onProductClick, onToggleWishlist, isInWishlist = false, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showSizeModal, setShowSizeModal] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)

  const isOutOfStock = product.stock === 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (isOutOfStock) return

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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: index * 0.08 }}
    >
      <motion.div
        className="group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        {/* Product card - clean minimal design */}
        <div className={`rounded-2xl overflow-hidden bg-[#111] border border-white/[0.06] transition-all duration-500 ${isOutOfStock ? 'opacity-60 grayscale' : 'hover:border-brand-gold/20'}`}>

          {/* Image */}
          <div className="relative aspect-[3/4] overflow-hidden">
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              animate={{ scale: isHovered ? 1.03 : 1 }}
              transition={{ duration: 0.5 }}
            />

            {/* Badge */}
            {product.badge && (
              <div className="absolute top-4 left-4">
                <span
                  className="px-3 py-1.5 bg-brand-gold text-black text-[10px] font-semibold tracking-wider uppercase rounded-full"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  {product.badge}
                </span>
              </div>
            )}

            {/* Wishlist */}
            <button
              className={`absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 ${isInWishlist
                ? 'bg-brand-gold text-black'
                : 'bg-black/60 text-white hover:bg-brand-gold hover:text-black'
                }`}
              onClick={handleToggleWishlist}
            >
              <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
            </button>

            {/* Out of stock sash */}
            {isOutOfStock && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] bg-neutral-900/95 text-white py-2 -rotate-45 flex items-center justify-center z-20 border-y border-white/10 shadow-xl backdrop-blur-sm pointer-events-none">
                <span className="text-xs font-bold tracking-[0.3em] uppercase opacity-90" style={{ fontFamily: "'Lato', sans-serif" }}>
                  Niedostępny
                </span>
              </div>
            )}

            {/* Add to cart - appears on hover */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              transition={{ duration: 0.25 }}
            >
              <button
                disabled={isOutOfStock}
                className={`w-full py-3 text-black text-xs font-semibold tracking-wider uppercase rounded-full transition-all ${isOutOfStock
                    ? 'hidden' // Hide button if banner is present to avoid clutter, or keep it?
                    : 'bg-brand-gold hover:bg-brand-gold/80 hover:shadow-lg hover:shadow-brand-gold/30'
                  }`}
                style={{ fontFamily: "'Lato', sans-serif" }}
                onClick={handleAddToCart}
              >
                Dodaj do koszyka
              </button>
            </motion.div>
          </div>

          {/* Info */}
          <div className="p-4">
            <h3
              className="text-white text-sm mb-2 line-clamp-1"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              {product.name}
            </h3>
            <p
              className="text-brand-gold text-lg font-semibold"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {product.price.toFixed(2)} <span className="text-sm font-normal">zł</span>
            </p>
          </div>
        </div>

        {/* Mobile button */}
        <button
          disabled={isOutOfStock}
          className={`md:hidden w-full mt-3 py-3 text-black text-xs font-semibold tracking-wider uppercase rounded-full ${isOutOfStock
            ? 'bg-white/10 cursor-not-allowed text-white/40'
            : 'bg-brand-gold'
            }`}
          style={{ fontFamily: "'Lato', sans-serif" }}
          onClick={handleAddToCart}
        >
          {isOutOfStock ? 'Tymczasowo niedostępny' : 'Dodaj do koszyka'}
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
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
            <motion.div
              className="relative bg-[#0a0a0a] border border-white/10 text-white max-w-md w-full p-8 rounded-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowSizeModal(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h3
                className="text-3xl text-white mb-2 font-light"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {product.name}
              </h3>
              <div className="w-12 h-px bg-brand-gold/40 mb-8" />

              <div className="space-y-8">
                {/* Wybór rozmiaru */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="space-y-4">
                    <label
                      className="text-xs tracking-[0.2em] uppercase text-white/50"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      Rozmiar
                    </label>
                    <div className="flex gap-3 flex-wrap">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-12 h-12 border rounded-lg text-sm transition-all duration-300 ${selectedSize === size
                            ? 'border-brand-gold bg-brand-gold/10 text-brand-gold'
                            : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white'
                            }`}
                          style={{ fontFamily: "'Lato', sans-serif" }}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Wybór ilości */}
                <div className="space-y-4">
                  <label
                    className="text-xs tracking-[0.2em] uppercase text-white/50"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    Ilość
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 border rounded-lg border-white/10 text-white/50 hover:border-brand-gold hover:text-brand-gold transition-all"
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <span
                      className="text-2xl w-16 text-center text-white"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 border rounded-lg border-white/10 text-white/50 hover:border-brand-gold hover:text-brand-gold transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Podsumowanie */}
                <div className="pt-6 border-t border-white/10">
                  <div className="flex justify-between items-center mb-6">
                    <span
                      className="text-white/40 text-sm"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      Razem
                    </span>
                    <span
                      className="text-3xl text-brand-gold font-light"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {(product.price * quantity).toFixed(2)} PLN
                    </span>
                  </div>

                  <button
                    onClick={handleConfirmAddToCart}
                    disabled={product.category === 'clothing' && !selectedSize}
                    className="w-full py-4 rounded-full bg-brand-gold text-black text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:bg-brand-gold/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: "'Lato', sans-serif", fontWeight: 500 }}
                  >
                    Dodaj do koszyka
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

