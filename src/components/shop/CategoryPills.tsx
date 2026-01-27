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
    { id: 'accessories', label: 'Akcesoria Treningowe' },
    { id: 'bestsellers', label: 'Bestsellery' },
  ]

  return (
    <motion.div 
      className="flex flex-wrap gap-3 justify-center mb-12"
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
            className={`btn-pill ${isActive ? 'active' : ''}`}
          >
            {category.label}
          </motion.button>
        )
      })}
    </motion.div>
  )
}
