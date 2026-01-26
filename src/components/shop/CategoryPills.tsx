import { Button } from '@/components/ui/button'

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
    <div className="flex flex-wrap gap-3 justify-center mb-12">
      {categories.map((category) => {
        const isActive = activeCategory === category.id
        
        return (
          <Button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            variant="outline"
            className={`
              relative px-6 py-3 rounded-full font-[family-name:var(--font-body)] font-semibold text-sm uppercase tracking-wide
              transition-all duration-300
              ${isActive 
                ? 'bg-brand-gold/20 text-brand-gold border-brand-gold hover:bg-brand-gold/30' 
                : 'bg-transparent text-white/70 border-[#1a1a1a] hover:bg-white/5 hover:text-white hover:border-white/20'
              }
            `}
          >
            {category.label}
            {isActive && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-brand-gold rounded-full" />
            )}
          </Button>
        )
      })}
    </div>
  )
}
