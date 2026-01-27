import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from 'lucide-react'
import type { Product } from './ProductCard'

const ease = [0.22, 1, 0.36, 1] as const

interface WishlistPageProps {
  items: Product[]
  onContinueShopping: () => void
  onRemoveItem: (productId: string) => void
  onAddToCart: (product: Product) => void
  onProductClick: (product: Product) => void
}

export function WishlistPage({ 
  items, 
  onContinueShopping, 
  onRemoveItem, 
  onAddToCart,
  onProductClick 
}: WishlistPageProps) {
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
          onClick={onContinueShopping}
          className="inline-flex items-center gap-2 text-white/60 hover:text-brand-gold transition-colors duration-300 mb-8 group cursor-pointer"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-[family-name:var(--font-body)] text-xs uppercase tracking-widest">Kontynuuj zakupy</span>
        </motion.button>

        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <h1 className="font-[family-name:var(--font-heading)] font-bold text-3xl md:text-4xl text-white uppercase tracking-tight mb-2">
            Lista <span className="text-brand-gold">Życzeń</span>
          </h1>
          <p className="text-white/50 font-[family-name:var(--font-body)]">
            {items.length} {items.length === 1 ? 'produkt' : items.length < 5 ? 'produkty' : 'produktów'}
          </p>
        </motion.div>

        {items.length === 0 ? (
          /* Empty wishlist */
          <motion.div
            className="flex flex-col items-center justify-center text-center py-24 md:py-32"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center border-2 border-white/10 rounded-lg mb-8">
              <Heart className="w-12 h-12 md:w-14 md:h-14 text-white/20" />
            </div>
            <h2 className="font-[family-name:var(--font-heading)] font-bold text-xl md:text-2xl text-white mb-3">
              Twoja lista życzeń jest pusta
            </h2>
            <p className="text-white/40 font-[family-name:var(--font-body)] text-sm mb-10 max-w-xs">
              Dodaj ulubione produkty, aby je zapisać na później
            </p>
            <button onClick={onContinueShopping} className="btn-primary">
              Przeglądaj produkty
            </button>
          </motion.div>
        ) : (
          /* Wishlist grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease, delay: index * 0.05 }}
                  className="group relative bg-white/[0.02] border border-white/10 hover:border-brand-gold/30 transition-all duration-300"
                >
                  {/* Remove button */}
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-black/60 backdrop-blur-sm text-white/60 hover:text-red-500 hover:bg-black/80 transition-all duration-300 rounded-full"
                    aria-label="Usuń z listy życzeń"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Badge */}
                  {item.badge && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        item.badge === 'NEW' 
                          ? 'bg-brand-gold text-black' 
                          : 'bg-white text-black'
                      }`}>
                        {item.badge}
                      </span>
                    </div>
                  )}

                  {/* Image */}
                  <div 
                    className="aspect-square overflow-hidden cursor-pointer"
                    onClick={() => onProductClick(item)}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <p className="text-[10px] text-white/40 font-[family-name:var(--font-body)] uppercase tracking-widest mb-1">
                      {item.category === 'clothing' ? 'Odzież' : 'Akcesoria'}
                    </p>
                    <h3 
                      className="font-[family-name:var(--font-heading)] font-bold text-sm text-white uppercase mb-3 cursor-pointer hover:text-brand-gold transition-colors"
                      onClick={() => onProductClick(item)}
                    >
                      {item.name}
                    </h3>
                    
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-[family-name:var(--font-heading)] font-bold text-lg text-brand-gold">
                        {item.price.toFixed(2)} PLN
                      </span>
                      <button
                        onClick={() => onAddToCart(item)}
                        className="btn-primary btn-sm flex items-center gap-2"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Dodaj</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  )
}
