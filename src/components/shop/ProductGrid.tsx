import { ProductCard, type Product } from './ProductCard'
import { CategoryPills, type Category } from './CategoryPills'
import { useState } from 'react'

interface ProductGridProps {
  products: Product[]
  onAddToCart: (product: Product) => void
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('all')

  const filteredProducts = products.filter((product) => {
    if (activeCategory === 'all') return true
    if (activeCategory === 'bestsellers') return product.isBestseller
    return product.category === activeCategory
  })

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="font-[family-name:var(--font-heading)] font-bold text-3xl md:text-4xl text-white mb-4 tracking-tight uppercase">
          NASZA KOLEKCJA
        </h2>
        <p className="text-white/70 text-lg font-[family-name:var(--font-body)] max-w-2xl mx-auto">
          Odkryj sprzęt stworzony dla prawdziwych sportowców
        </p>
      </div>

      <CategoryPills
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/60 text-lg font-[family-name:var(--font-body)]">
            Brak produktów w tej kategorii
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </section>
  )
}
