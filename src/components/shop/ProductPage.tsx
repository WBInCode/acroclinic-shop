import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ShoppingCart, Shield, Truck, RotateCcw, Check, Heart, ShieldCheck, Gem, CalendarClock } from 'lucide-react'
import { useState } from 'react'
import type { Product } from './ProductCard'
import { getEstimatedClothingShipDate, getEstimatedAccessoriesDelivery } from '@/components/layout/OrderCountdown'

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

  const isOutOfStock = product.stock === 0

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
      className="min-h-screen pt-24 md:pt-48 pb-32" // Increased pt-40 -> pt-48
    >
      <div className="container mx-auto px-4">
        {/* Back button */}
        <motion.button
          onClick={onBack}
          className="flex items-center gap-2 text-white/60 hover:text-brand-gold transition-colors mb-12 group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-[family-name:var(--font-body)] text-sm uppercase tracking-wider">Wróć do sklepu</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: Images & Actions (Sticky) */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.1 }}
            className={`lg:sticky lg:top-48 lg:h-fit max-w-xl mx-auto w-full ${isOutOfStock ? 'grayscale opacity-75' : ''}`} // Increased top-36 -> top-48
          >
            <div className="flex gap-4 mb-8">
              {/* Thumbnails (Left side) */}
              <div className="flex flex-col gap-3 w-20 flex-shrink-0">
                {images.map((img, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-full aspect-square overflow-hidden rounded-xl bg-[#0c0c0c] p-1 transition-all ${activeImage === idx ? 'ring-2 ring-brand-gold' : 'ring-1 ring-white/10 hover:ring-white/30'
                      }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
                  </motion.button>
                ))}
              </div>

              {/* Main image (Right side) */}
              <div className="flex-1 relative aspect-square overflow-hidden rounded-2xl bg-[#0c0c0c] p-4">
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
                    <span className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider ${product.badge === 'NEW'
                      ? 'bg-brand-gold text-black'
                      : 'bg-black/60 text-white backdrop-blur-sm'
                      }`} style={{ fontFamily: "'Lato', sans-serif" }}>
                      {product.badge}
                    </span>
                  </div>
                )}

                {/* Out of stock sash */}
                {isOutOfStock && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] bg-neutral-900/95 text-white py-3 -rotate-45 flex items-center justify-center z-20 border-y border-white/10 shadow-xl backdrop-blur-sm pointer-events-none">
                    <span className="text-sm font-bold tracking-[0.3em] uppercase opacity-90" style={{ fontFamily: "'Lato', sans-serif" }}>
                      Niedostępny
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Section (Below images) */}
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
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
              <div className="mb-6">
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
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-full font-semibold uppercase tracking-wider transition-all duration-300 ${isOutOfStock
                    ? 'bg-white/10 text-white/40 cursor-not-allowed py-4 text-xs'
                    : 'btn-primary'
                    }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{isOutOfStock ? 'Tymczasowo niedostępny' : 'Dodaj do koszyka'}</span>
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className={`w-14 h-14 flex items-center justify-center rounded-xl border-2 transition-all duration-300 ${isInWishlist
                    ? 'bg-red-500/20 border-red-500 text-red-500'
                    : 'border-white/10 text-white/40 hover:border-brand-gold hover:text-brand-gold'
                    }`}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right: Product info (Scrollable) */}
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
            <div className="mb-12 flex items-baseline gap-1">
              <span className="font-[family-name:var(--font-heading)] font-bold text-4xl text-brand-gold">
                {product.price}
              </span>
              <span className="font-[family-name:var(--font-heading)] text-xl text-brand-gold/80">PLN</span>
            </div>

            {/* Description */}
            <div className="prose prose-invert prose-lg max-w-none text-white/70 font-[family-name:var(--font-body)] leading-loose mb-12 whitespace-pre-line">
              <p>{description}</p>
            </div>

            {/* Separator */}
            <div className="w-24 h-1 bg-brand-gold/20 mb-12" />

            {/* Features */}
            <div className="space-y-4 mb-12">
              <h3 className="text-lg font-bold text-white mb-4">Cechy produktu</h3>
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-center gap-3 text-white/60"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease, delay: 0.4 + idx * 0.1 }}
                >
                  <div className="w-6 h-6 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-brand-gold" />
                  </div>
                  <span className="font-[family-name:var(--font-body)]">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Materials */}
            <div className="mb-12 p-6 bg-white/5 rounded-2xl border border-white/5">
              <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-[family-name:var(--font-body)] block mb-2">
                Materiały
              </span>
              <span className="text-white/80 font-[family-name:var(--font-body)] text-lg">
                {materials}
              </span>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
              <div className="text-center group">
                <div className="w-12 h-12 mx-auto mb-3 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-brand-gold/10 transition-colors">
                  <Gem className="w-6 h-6 text-brand-gold" />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-[family-name:var(--font-body)] block">
                  Najlepsza jakość
                </span>
              </div>
              <div className="text-center group">
                <div className="w-12 h-12 mx-auto mb-3 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-brand-gold/10 transition-colors">
                  <RotateCcw className="w-6 h-6 text-brand-gold" />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-[family-name:var(--font-body)] block">
                  30 dni zwrotu
                </span>
              </div>
              <div className="text-center group">
                <div className="w-12 h-12 mx-auto mb-3 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-brand-gold/10 transition-colors">
                  <Shield className="w-6 h-6 text-brand-gold" />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-[family-name:var(--font-body)] block">
                  Gwarancja
                </span>
              </div>
            </div>

            {/* Estimated delivery info */}
            <div className="flex items-start gap-3 p-4 mt-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
              <CalendarClock className="w-5 h-5 text-brand-gold/60 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-white/70 text-sm font-[family-name:var(--font-heading)] font-bold mb-1">Przewidywany czas dostawy</h4>
                {product.category === 'clothing' ? (
                  <p className="text-white/40 text-xs font-[family-name:var(--font-body)] leading-relaxed">
                    Szyta na zamówienie. Przewidywana dostawa ok. <span className="text-brand-gold/70">{getEstimatedClothingShipDate().toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}</span> (10 dni produkcja + 3 dni dostawa).
                  </p>
                ) : (
                  <p className="text-white/40 text-xs font-[family-name:var(--font-body)] leading-relaxed">
                    Wysyłka natychmiast. Dostawa: 1-3 dni robocze.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
