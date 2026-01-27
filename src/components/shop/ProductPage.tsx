import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ShoppingCart, Shield, Truck, RotateCcw, Star, Check, Heart } from 'lucide-react'
import { useState } from 'react'
import type { Product } from './ProductCard'

// Spójne animacje
const ease = [0.22, 1, 0.36, 1] as const

interface ProductPageProps {
  product: Product
  onBack: () => void
  onAddToCart: (product: Product) => void
  onToggleWishlist?: (product: Product) => void
  isInWishlist?: boolean
}

// Rozszerzone dane produktów z opisami
const productDetails: Record<string, {
  description: string
  features: string[]
  materials: string
  sizes?: string[]
  rating: number
  reviews: number
}> = {
  '1': {
    description: 'Profesjonalny jersey treningowy zaprojektowany z myślą o najwyższym komforcie podczas intensywnych sesji akrobatycznych. Wykonany z oddychających materiałów premium, zapewnia pełną swobodę ruchów.',
    features: ['Oddychający materiał', 'Szybkoschnący', 'Antypoślizgowe wstawki', 'Płaskie szwy'],
    materials: '92% Poliester, 8% Elastan',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.9,
    reviews: 127
  },
  '2': {
    description: 'Szorty treningowe Pro Performance to idealne rozwiązanie dla wymagających sportowców. Elastyczna konstrukcja pozwala na wykonywanie nawet najbardziej skomplikowanych figur akrobatycznych.',
    features: ['4-way stretch', 'Wbudowana kieszeń', 'Wzmocnione szwy', 'Odporność na ścieranie'],
    materials: '88% Nylon, 12% Elastan',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.8,
    reviews: 89
  },
  '3': {
    description: 'Kostka piankowa najwyższej jakości, idealna do ćwiczeń jogi i stretching. Gęsta pianka EVA zapewnia stabilność i trwałość przez długie lata użytkowania.',
    features: ['Pianka EVA wysokiej gęstości', 'Antypoślizgowa powierzchnia', 'Lekka konstrukcja', 'Łatwa do czyszczenia'],
    materials: '100% Pianka EVA',
    rating: 4.7,
    reviews: 234
  },
  '4': {
    description: 'Kompletny zestaw taśm oporowych o różnych poziomach oporu. Idealny do rozgrzewki, rehabilitacji i budowania siły mięśni stabilizujących.',
    features: ['5 poziomów oporu', 'Naturalna guma latex', 'Torba do przechowywania', 'Instrukcja ćwiczeń'],
    materials: '100% Natural Latex',
    rating: 4.6,
    reviews: 156
  },
  '5': {
    description: 'Top kompresyjny Athletic zapewnia optymalne wsparcie podczas treningów siłowych i akrobatycznych. Technologia kompresji wspomaga krążenie i regenerację mięśni.',
    features: ['Technologia kompresji', 'Ochrona UV', 'Termoaktywny', 'Bezszwowa konstrukcja'],
    materials: '85% Poliamid, 15% Elastan',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.8,
    reviews: 78
  },
  '6': {
    description: 'Profesjonalne rękawiczki treningowe z wzmocnionymi dłońmi. Zapewniają doskonały chwyt na drążku i ochronę przed odciskami.',
    features: ['Wzmocnione dłonie', 'Oddychający materiał', 'Regulowane zapięcie', 'Ochrona nadgarstka'],
    materials: 'Skóra syntetyczna, Neopren',
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.5,
    reviews: 112
  },
  '7': {
    description: 'Legginsy Performance to połączenie stylu i funkcjonalności. Wysoki stan zapewnia komfort, a elastyczny materiał pozwala na pełen zakres ruchu.',
    features: ['Wysoki stan', 'Kieszeń na telefon', 'Antypoślizgowy pas', 'Modelujący krój'],
    materials: '78% Nylon, 22% Elastan',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.9,
    reviews: 203
  },
  '8': {
    description: 'Mata do jogi Elite to profesjonalne rozwiązanie dla zaawansowanych praktykujących. Extra grubość 6mm zapewnia komfort nawet podczas długich sesji.',
    features: ['Grubość 6mm', 'Dwustronna tekstura', 'Pasek do noszenia', 'Biodegradowalna'],
    materials: 'Naturalna guma, TPE',
    rating: 4.8,
    reviews: 167
  }
}

export function ProductPage({ product, onBack, onAddToCart, onToggleWishlist, isInWishlist = false }: ProductPageProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  
  const details = productDetails[product.id] || {
    description: 'Profesjonalny produkt dla wymagających sportowców.',
    features: ['Najwyższa jakość', 'Trwałość', 'Komfort użytkowania'],
    materials: 'Premium materials',
    rating: 4.5,
    reviews: 50
  }

  // Symulowane dodatkowe zdjęcia (w prawdziwej aplikacji byłyby różne)
  const images = [
    product.image,
    product.image.replace('w=600', 'w=601'), // Trick do symulacji różnych zdjęć
    product.image.replace('w=600', 'w=602'),
  ]

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product)
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
      className="min-h-screen pt-24 pb-32"
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
            <div className="relative aspect-square overflow-hidden bg-white/[0.02] border border-white/10 mb-4">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease }}
                />
              </AnimatePresence>
              
              {/* Badge */}
              {product.badge && (
                <div className="absolute top-6 left-6 z-10">
                  <span className={`px-4 py-2 text-xs font-bold uppercase tracking-wider ${
                    product.badge === 'NEW' 
                      ? 'bg-brand-gold text-black' 
                      : 'bg-white/10 text-white border border-white/20'
                  }`}>
                    {product.badge}
                  </span>
                </div>
              )}

              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-brand-gold/30" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-brand-gold/30" />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {images.map((img, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-20 h-20 overflow-hidden border-2 transition-colors ${
                    activeImage === idx ? 'border-brand-gold' : 'border-white/10 hover:border-white/30'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
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

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(details.rating) ? 'text-brand-gold fill-brand-gold' : 'text-white/20'}`}
                  />
                ))}
              </div>
              <span className="text-white/60 text-sm font-[family-name:var(--font-body)]">
                {details.rating} ({details.reviews} opinii)
              </span>
            </div>

            {/* Price */}
            <div className="mb-8">
              <span className="font-[family-name:var(--font-heading)] font-bold text-4xl text-brand-gold">
                {product.price} PLN
              </span>
            </div>

            {/* Description */}
            <p className="text-white/60 font-[family-name:var(--font-body)] leading-relaxed mb-8">
              {details.description}
            </p>

            {/* Divider */}
            <div className="w-full h-px bg-white/10 mb-8" />

            {/* Sizes */}
            {details.sizes && (
              <div className="mb-8">
                <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-[family-name:var(--font-body)] block mb-4">
                  Rozmiar
                </span>
                <div className="flex flex-wrap gap-3">
                  {details.sizes.map((size) => (
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
                Dodaj do koszyka
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`w-14 h-14 flex items-center justify-center border-2 transition-all duration-300 ${
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
              {details.features.map((feature, idx) => (
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
                {details.materials}
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
