import { motion } from 'framer-motion'

export type Category = 'all' | 'clothing' | 'accessories' | 'bestsellers'

interface CategoryPillsProps {
  activeCategory: Category
  onCategoryChange: (category: Category) => void
}

export function CategoryPills({ activeCategory, onCategoryChange }: CategoryPillsProps) {
  const categories: { id: Category; label: string }[] = [
    { id: 'all', label: 'Wszystko' },
    { id: 'clothing', label: 'Ubrania' },
    { id: 'accessories', label: 'Akcesoria' },
    { id: 'bestsellers', label: 'Bestsellery' },
  ]

  return (
    <motion.div 
      className="flex flex-wrap gap-6 justify-center mb-16"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {categories.map((category, index) => {
        const isActive = activeCategory === category.id
        
        return (
          <motion.button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className={`relative px-1 py-2 text-xs tracking-[0.2em] uppercase transition-all duration-300 ${
              isActive 
                ? 'text-brand-gold' 
                : 'text-white/40 hover:text-white/70'
            }`}
            style={{ fontFamily: "'Lato', sans-serif", fontWeight: 400 }}
          >
            {category.label}
            {/* Elegancka linia pod aktywną kategorią */}
            {isActive && (
              <motion.div
                className="absolute -bottom-1 left-0 right-0 h-px bg-brand-gold"
                layoutId="categoryUnderline"
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              />
            )}
          </motion.button>
        )
      })}
    </motion.div>
  )
}

