import { ProductCard, type Product } from './ProductCard'
import { CategoryPills, type Category } from './CategoryPills'
import { useState } from 'react'
import { motion } from 'framer-motion'

// Spójne animacje
const transition = { duration: 0.8, ease: [0.22, 1, 0.36, 1] }

interface ProductGridProps {
  products: Product[]
  onAddToCart: (product: Product) => void
  onProductClick?: (product: Product) => void
  onToggleWishlist?: (product: Product) => void
  isInWishlist?: (productId: string) => boolean
}

export function ProductGrid({ products, onAddToCart, onProductClick, onToggleWishlist, isInWishlist }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('all')

  const filteredProducts = products.filter((product) => {
    if (activeCategory === 'all') return true
    if (activeCategory === 'bestsellers') return product.isBestseller
    return product.category === activeCategory
  })

  return (
    <section 
      id="products"
      className="container mx-auto px-4 py-24 relative"
    >
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={transition}
      >
        <span className="text-xs uppercase tracking-[0.3em] text-brand-gold/60 font-[family-name:var(--font-body)] block mb-4">Produkty</span>
        <h2 className="font-[family-name:var(--font-heading)] font-bold text-3xl md:text-4xl text-white mb-4 tracking-tight uppercase">
          NASZA <span className="text-brand-gold">KOLEKCJA</span>
        </h2>
        <motion.div
          className="w-16 h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent mx-auto mt-6"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ ...transition, delay: 0.2 }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ ...transition, delay: 0.3 }}
      >
        <CategoryPills
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </motion.div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/40 text-base font-[family-name:var(--font-body)]">
            Brak produktów w tej kategorii
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onProductClick={onProductClick}
              onToggleWishlist={onToggleWishlist}
              isInWishlist={isInWishlist?.(product.id)}
              index={index}
            />
          ))}  
        </div>
      )}
    </section>
  )
}
