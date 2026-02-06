import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ShoppingCart, Shield, Truck, RotateCcw, Check, Heart } from 'lucide-react'
import { useState } from 'react'
import type { Product } from './ProductCard'

// Spójne animacje
const ease = [0.22, 1, 0.36, 1] as const

interface ProductPageProps {
  product: Product
  onBack: () => void
  onAddToCart: (product: Product, selectedSize?: string) => void
  onToggleWishlist?: (product: Product) => void
  isInWishlist?: boolean
}

export function ProductPage({ product, onBack, onAddToCart, onToggleWishlist, isInWishlist = false }: ProductPageProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  
  // Używaj danych z produktu (z API) z fallbackiem
  const description = product.description || 'Profesjonalny produkt dla wymagających sportowców.'
  const features = product.features && product.features.length > 0 
    ? product.features 
    : ['Najwyższa jakość', 'Trwałość', 'Komfort użytkowania']
  const materials = product.materials || 'Premium materials'

  // Użyj rzeczywistych zdjęć z produktu lub pojedyncze zdjęcie główne
  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.image]

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product, selectedSize || undefined)
    }
  }

  const handleToggleWishlist = () => {
    onToggleWishlist?.(product)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease }}
      className="min-h-screen pt-36 pb-32"
    >
      <div className="container mx-auto px-4">
        {/* Back button */}
        <motion.button
          onClick={onBack}
          className="flex items-center gap-2 text-white/60 hover:text-brand-gold transition-colors mb-8 group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-[family-name:var(--font-body)] text-sm uppercase tracking-wider">Wróć do sklepu</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: Images */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.1 }}
          >
            {/* Main image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#0c0c0c] p-4 mb-4">
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={images[activeImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4, ease }}
                  />
                </AnimatePresence>
              </div>
              
              {/* Badge */}
              {product.badge && (
                <div className="absolute top-6 left-6 z-10">
                  <span className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    product.badge === 'NEW' 
                      ? 'bg-brand-gold text-black' 
                      : 'bg-black/60 text-white backdrop-blur-sm'
                  }`} style={{ fontFamily: "'Lato', sans-serif" }}>
                    {product.badge}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {images.map((img, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-20 h-20 overflow-hidden rounded-xl bg-[#0c0c0c] p-1 transition-all ${
                    activeImage === idx ? 'ring-2 ring-brand-gold' : 'ring-1 ring-white/10 hover:ring-white/30'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Right: Product info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
            className="flex flex-col"
          >
            {/* Category */}
            <span className="text-xs uppercase tracking-[0.3em] text-brand-gold/60 font-[family-name:var(--font-body)] mb-4">
              {product.category === 'clothing' ? 'Odzież' : 'Akcesoria'}
            </span>

            {/* Title */}
            <h1 className="font-[family-name:var(--font-heading)] font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-4 uppercase tracking-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mb-8 flex items-baseline gap-1">
              <span className="font-[family-name:var(--font-heading)] font-bold text-4xl text-brand-gold">
                {product.price}
              </span>
              <span className="font-[family-name:var(--font-heading)] text-xl text-brand-gold/80">PLN</span>
            </div>

            {/* Description */}
            <p className="text-white/60 font-[family-name:var(--font-body)] leading-relaxed mb-8">
              {description}
            </p>

            {/* Divider */}
            <div className="w-full h-px bg-white/10 mb-8" />

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-[family-name:var(--font-body)] block mb-4">
                  Rozmiar
                </span>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`btn-size ${selectedSize === size ? 'active' : ''}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-[family-name:var(--font-body)] block mb-4">
                Ilość
              </span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="btn-qty"
                >
                  −
                </button>
                <span className="w-12 text-center font-[family-name:var(--font-heading)] font-bold text-xl text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="btn-qty"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to cart and wishlist buttons */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                className="btn-primary flex-1"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Dodaj do koszyka</span>
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`w-14 h-14 flex items-center justify-center rounded-xl border-2 transition-all duration-300 ${
                  isInWishlist
                    ? 'bg-red-500/20 border-red-500 text-red-500'
                    : 'border-white/20 text-white/60 hover:border-brand-gold hover:text-brand-gold'
                }`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-8">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-center gap-3 text-white/60"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease, delay: 0.4 + idx * 0.1 }}
                >
                  <Check className="w-4 h-4 text-brand-gold" />
                  <span className="font-[family-name:var(--font-body)] text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Materials */}
            <div className="mb-8">
              <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-[family-name:var(--font-body)] block mb-2">
                Materiały
              </span>
              <span className="text-white/60 font-[family-name:var(--font-body)] text-sm">
                {materials}
              </span>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
              <div className="text-center">
                <Truck className="w-6 h-6 text-brand-gold mx-auto mb-2" />
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-[family-name:var(--font-body)]">
                  Darmowa dostawa
                </span>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 text-brand-gold mx-auto mb-2" />
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-[family-name:var(--font-body)]">
                  30 dni zwrotu
                </span>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 text-brand-gold mx-auto mb-2" />
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-[family-name:var(--font-body)]">
                  Gwarancja
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
