import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, Truck, Shield, CreditCard, Lock } from 'lucide-react'
import type { Product } from './ProductCard'
import { PayULogo } from '@/components/ui/PayULogo'

// Spójne animacje
const ease = [0.22, 1, 0.36, 1] as const

export interface CartItem extends Product {
  quantity: number
  selectedSize?: string
}

interface CartPageProps {
  items: CartItem[]
  onContinueShopping: () => void
  onUpdateQuantity: (itemKey: string, quantity: number) => void
  onRemoveItem: (itemKey: string) => void
  onClearCart: () => void
  onCheckout?: () => void
}

// Helper do generowania unikalnego klucza
const getItemKey = (item: CartItem) => item.selectedSize ? `${item.id}-${item.selectedSize}` : item.id

export function CartPage({ items, onContinueShopping, onUpdateQuantity, onRemoveItem, onClearCart, onCheckout }: CartPageProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 300 ? 0 : 19.90
  const total = subtotal + shipping

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const hasOutOfStockItems = items.some(item => item.stock === 0)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease }}
      className="min-h-screen pt-40 pb-32"
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
            Twój <span className="text-brand-gold">Koszyk</span>
          </h1>
          <p className="text-white/50 font-[family-name:var(--font-body)]">
            {itemCount} {itemCount === 1 ? 'produkt' : itemCount < 5 ? 'produkty' : 'produktów'}
          </p>
        </motion.div>

        {items.length === 0 ? (
          /* Empty cart */
          <motion.div
            className="flex flex-col items-center justify-center text-center py-24 md:py-32"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center border-2 border-white/10 rounded-2xl mb-8">
              <ShoppingBag className="w-12 h-12 md:w-14 md:h-14 text-white/20" />
            </div>
            <h2 className="font-[family-name:var(--font-heading)] font-bold text-xl md:text-2xl text-white mb-3">
              Twój koszyk jest pusty
            </h2>
            <p className="text-white/40 font-[family-name:var(--font-body)] text-sm mb-10 max-w-xs">
              Dodaj produkty, aby rozpocząć zakupy
            </p>
            <button onClick={onContinueShopping} className="btn-primary">
              Przeglądaj produkty
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => {
                  const itemKey = getItemKey(item)
                  const isOutOfStock = item.stock === 0
                  return (
                    <motion.div
                      key={itemKey}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      transition={{ duration: 0.4, ease, delay: index * 0.05 }}
                      className={`flex gap-4 md:gap-6 p-4 md:p-6 rounded-2xl bg-[#0c0c0c] transition-colors ${isOutOfStock ? 'opacity-75 grayscale' : 'hover:bg-[#0e0e0e]'}`}
                    >
                      {/* Image */}
                      <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 overflow-hidden rounded-xl bg-[#0a0a0a] p-2 relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        {/* Out of stock sash */}
                        {isOutOfStock && (
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] bg-neutral-900/95 text-white py-1 -rotate-45 flex items-center justify-center z-20 border-y border-white/10 shadow-xl backdrop-blur-sm pointer-events-none">
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-90" style={{ fontFamily: "'Lato', sans-serif" }}>
                              Niedostępny
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-[family-name:var(--font-heading)] font-bold text-sm md:text-base text-white uppercase">
                              {item.name}
                            </h3>
                            <p className="text-xs text-white/40 font-[family-name:var(--font-body)] uppercase tracking-wider mt-1">
                              {item.category === 'clothing' ? 'Odzież' : 'Akcesoria'}
                              {item.selectedSize && <span className="ml-2">• Rozmiar: <span className="text-brand-gold">{item.selectedSize}</span></span>}
                              {isOutOfStock && <span className="ml-2 text-red-500 font-bold">• PRODUKT NIEDOSTĘPNY</span>}
                            </p>
                          </div>
                          <button
                            onClick={() => onRemoveItem(itemKey)}
                            className="text-white/40 hover:text-red-500 transition-colors p-2"
                            aria-label="Usuń"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
                          {/* Quantity controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onUpdateQuantity(itemKey, Math.max(1, item.quantity - 1))}
                              className="btn-qty w-8 h-8 text-sm"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-[family-name:var(--font-heading)] font-bold text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(itemKey, item.quantity + 1)}
                              className="btn-qty w-8 h-8 text-sm"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Price */}
                          <p className="font-[family-name:var(--font-heading)] font-bold text-lg flex items-baseline gap-1">
                            <span className="text-brand-gold">{(item.price * item.quantity).toFixed(2)}</span>
                            <span className="text-brand-gold/80 text-sm">PLN</span>
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>

              {/* Clear cart */}
              <motion.button
                onClick={onClearCart}
                className="text-white/40 hover:text-red-500 transition-colors text-sm font-[family-name:var(--font-body)] flex items-center gap-2 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Trash2 className="w-4 h-4" />
                Wyczyść koszyk
              </motion.button>
            </div>

            {/* Order summary */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.2 }}
            >
              <div className="sticky top-24 p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/10">
                <h2 className="font-[family-name:var(--font-heading)] font-bold text-lg text-white uppercase tracking-wide mb-6">
                  Podsumowanie
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-white/60 font-[family-name:var(--font-body)]">
                    <span>Produkty ({itemCount})</span>
                    <span>{subtotal.toFixed(2)} PLN</span>
                  </div>
                  <div className="flex justify-between text-white/60 font-[family-name:var(--font-body)]">
                    <span>Dostawa</span>
                    <span className={shipping === 0 ? 'text-green-500' : ''}>
                      {shipping === 0 ? 'GRATIS' : `${shipping.toFixed(2)} PLN`}
                    </span>
                  </div>

                </div>

                <div className="border-t border-white/10 pt-4 mb-6">
                  <div className="flex justify-between items-baseline">
                    <span className="font-[family-name:var(--font-heading)] font-bold text-white uppercase">Razem</span>
                    <span className="font-[family-name:var(--font-heading)] font-bold text-2xl text-brand-gold">
                      {total.toFixed(2)} PLN
                    </span>
                  </div>
                </div>

                <button
                  onClick={onCheckout}
                  disabled={items.length === 0 || hasOutOfStockItems}
                  className="btn-primary btn-full mb-4 disabled:opacity-50 disabled:cursor-not-allowed text-center justify-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  {hasOutOfStockItems ? 'Usuń niedostępne produkty' : 'Przejdź do płatności'}
                </button>

                {hasOutOfStockItems && (
                  <p className="text-red-500 text-xs text-center mb-4 font-[family-name:var(--font-body)]">
                    Niektóre produkty w koszyku są niedostępne. Usuń je, aby kontynuować.
                  </p>
                )}

                <button onClick={onContinueShopping} className="btn-secondary btn-full">
                  Kontynuuj zakupy
                </button>

                {/* Trust badges */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <Shield className="w-5 h-5 text-brand-gold mx-auto mb-2" />
                      <span className="text-[10px] text-white/40 font-[family-name:var(--font-body)] uppercase tracking-wider block">
                        Bezpieczne płatności
                      </span>
                    </div>
                    <div className="text-center">
                      <Lock className="w-5 h-5 text-brand-gold mx-auto mb-2" />
                      <span className="text-[10px] text-white/40 font-[family-name:var(--font-body)] uppercase tracking-wider block">
                        Szyfrowane SSL
                      </span>
                    </div>
                  </div>

                  {/* Payment Icons */}
                  <div className="flex justify-center items-center">
                    <div className="bg-white/10 rounded px-3 py-1.5">
                      <PayULogo size="sm" className="text-white/70" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
