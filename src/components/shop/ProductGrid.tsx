import { ProductCard, type Product } from './ProductCard'
import { CategoryPills, type Category } from './CategoryPills'
import { useState } from 'react'
import { motion } from 'framer-motion'

// Eleganckie animacje
const transition = { duration: 0.6, ease: [0.4, 0, 0.2, 1] }

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
      className="container mx-auto px-6 py-32 relative"
    >
      <motion.div 
        className="text-center mb-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={transition}
      >
        {/* Elegancki nagłówek sekcji */}
        <span 
          className="text-xs tracking-[0.4em] uppercase text-brand-gold/50 block mb-6"
          style={{ fontFamily: "'Lato', sans-serif" }}
        >
          Kolekcja
        </span>
        <h2 
          className="text-4xl md:text-5xl text-white font-light mb-6"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Nasza <span className="text-brand-gold italic">Kolekcja</span>
        </h2>
        
        {/* Elegancka linia z ornamentem */}
        <motion.div
          className="flex items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ ...transition, delay: 0.2 }}
        >
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-brand-gold/30" />
          <div className="w-1.5 h-1.5 rotate-45 border border-brand-gold/40" />
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-brand-gold/30" />
        </motion.div>
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
          <p 
            className="text-white/30 text-base"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            Brak produktów w tej kategorii
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
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

