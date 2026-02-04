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

// Rozmiary
const childSizes = ['116', '122', '128', '134', '140', '146']
const adultSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

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
    description: 'Profesjonalna koszulka bokserka idealna do treningów akrobatyki i tańca. Wykonana z oddychających materiałów premium, zapewnia pełną swobodę ruchów.',
    features: ['Oddychający materiał', 'Szybkoschnący', 'Wygodny krój', 'Płaskie szwy'],
    materials: '92% Poliester, 8% Elastan',
    sizes: [...childSizes, ...adultSizes],
    rating: 4.9,
    reviews: 127
  },
  '2': {
    description: 'T-shirt dziecięcy zaprojektowany z myślą o młodych akrobatach. Wygodny krój pozwala na wykonywanie nawet najbardziej skomplikowanych figur.',
    features: ['Miękka bawełna', 'Wzmocnione szwy', 'Nadruk z logo', 'Łatwy w praniu'],
    materials: '95% Bawełna, 5% Elastan',
    sizes: childSizes,
    rating: 4.8,
    reviews: 89
  },
  '3': {
    description: 'Longsleeve dziecięcy na chłodniejsze dni treningowe. Doskonale sprawdza się podczas rozgrzewki i stretching.',
    features: ['Długi rękaw', 'Ciepły materiał', 'Elastyczny', 'Z logo Acro Clinic'],
    materials: '90% Bawełna, 10% Elastan',
    sizes: childSizes,
    rating: 4.7,
    reviews: 65
  },
  '4': {
    description: 'Spodenki kolarki idealne do treningu akrobatyki. Przylegający krój nie ogranicza ruchów podczas ćwiczeń.',
    features: ['Przylegający krój', 'Antypoślizgowy brzeg', 'Szybkoschnące', 'Wygodny pas'],
    materials: '88% Nylon, 12% Elastan',
    sizes: [...childSizes, ...adultSizes],
    rating: 4.8,
    reviews: 156
  },
  '5': {
    description: 'Top sportowy zapewniający optymalne wsparcie podczas treningów. Wygodny i stylowy.',
    features: ['Wsparcie podczas ćwiczeń', 'Oddychający', 'Elastyczny', 'Modny design'],
    materials: '85% Poliamid, 15% Elastan',
    sizes: adultSizes,
    rating: 4.8,
    reviews: 78
  },
  '6': {
    description: 'Legginsy treningowe to połączenie stylu i funkcjonalności. Wysoki stan zapewnia komfort, a elastyczny materiał pozwala na pełen zakres ruchu.',
    features: ['Wysoki stan', 'Kieszeń na telefon', 'Antypoślizgowy pas', 'Modelujący krój'],
    materials: '78% Nylon, 22% Elastan',
    sizes: [...childSizes, ...adultSizes],
    rating: 4.9,
    reviews: 203
  },
  '7': {
    description: 'Dresy jogger dziecięce - wygodne i stylowe spodnie na trening i na co dzień. Idealne do rozgrzewki.',
    features: ['Ściągacze przy kostkach', 'Kieszenie', 'Miękka dzianina', 'Elastyczny pas'],
    materials: '80% Bawełna, 20% Poliester',
    sizes: childSizes,
    rating: 4.6,
    reviews: 92
  },
  '8': {
    description: 'Bluza regular dziecięca - ciepła i wygodna na chłodniejsze dni. Z nadrukiem logo Acro Clinic.',
    features: ['Kaptur', 'Kieszeń kangurka', 'Ciepła dzianina', 'Nadruk z logo'],
    materials: '70% Bawełna, 30% Poliester',
    sizes: childSizes,
    rating: 4.8,
    reviews: 74
  },
  // Akcesoria - Taśmy gimnastyczne
  '9': {
    description: 'Taśma gimnastyczna do rozciągania 90cm - idealna do ćwiczeń rozciągających i zwiększania elastyczności. Wykonana z wytrzymałej gumy lateksowej.',
    features: ['Długość 90cm', 'Wytrzymała guma', 'Antypoślizgowa', 'Lekka i poręczna'],
    materials: '100% Lateks naturalny',
    rating: 4.9,
    reviews: 156
  },
  '10': {
    description: 'Taśma gimnastyczna do rozciągania 90cm - idealna do ćwiczeń rozciągających i zwiększania elastyczności. Wykonana z wytrzymałej gumy lateksowej.',
    features: ['Długość 90cm', 'Wytrzymała guma', 'Antypoślizgowa', 'Lekka i poręczna'],
    materials: '100% Lateks naturalny',
    rating: 4.8,
    reviews: 203
  },
  '11': {
    description: 'Taśma gimnastyczna do rozciągania 90cm - idealna do ćwiczeń rozciągających i zwiększania elastyczności. Wykonana z wytrzymałej gumy lateksowej.',
    features: ['Długość 90cm', 'Wytrzymała guma', 'Antypoślizgowa', 'Lekka i poręczna'],
    materials: '100% Lateks naturalny',
    rating: 4.7,
    reviews: 89
  },
  // Akcesoria - Kostki do jogi
  '12': {
    description: 'Kostka piankowa do jogi - niezbędny sprzęt do ćwiczeń jogi i stretching. Zapewnia stabilność i wsparcie podczas wykonywania pozycji.',
    features: ['Lekka pianka EVA', 'Antypoślizgowa', 'Łatwa do czyszczenia', 'Wysoka gęstość'],
    materials: '100% Pianka EVA',
    rating: 4.8,
    reviews: 134
  },
  '13': {
    description: 'Kostka piankowa do jogi - niezbędny sprzęt do ćwiczeń jogi i stretching. Zapewnia stabilność i wsparcie podczas wykonywania pozycji.',
    features: ['Lekka pianka EVA', 'Antypoślizgowa', 'Łatwa do czyszczenia', 'Wysoka gęstość'],
    materials: '100% Pianka EVA',
    rating: 4.9,
    reviews: 178
  },
  '14': {
    description: 'Kostka piankowa do jogi - niezbędny sprzęt do ćwiczeń jogi i stretching. Zapewnia stabilność i wsparcie podczas wykonywania pozycji.',
    features: ['Lekka pianka EVA', 'Antypoślizgowa', 'Łatwa do czyszczenia', 'Wysoka gęstość'],
    materials: '100% Pianka EVA',
    rating: 4.8,
    reviews: 112
  },
  '15': {
    description: 'Kostka piankowa do jogi - niezbędny sprzęt do ćwiczeń jogi i stretching. Zapewnia stabilność i wsparcie podczas wykonywania pozycji.',
    features: ['Lekka pianka EVA', 'Antypoślizgowa', 'Łatwa do czyszczenia', 'Wysoka gęstość'],
    materials: '100% Pianka EVA',
    rating: 4.7,
    reviews: 95
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

  // Użyj rzeczywistych zdjęć z produktu lub pojedyncze zdjęcie główne
  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.image]

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
