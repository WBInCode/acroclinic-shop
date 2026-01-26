import { ShoppingCart } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useState } from 'react'

export interface Product {
  id: string
  name: string
  price: number
  image: string
  badge?: 'NEW' | 'LIMITED'
  category: 'clothing' | 'accessories'
  isBestseller?: boolean
}

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Card
        className="backdrop-blur-md bg-card/70 border-[#1a1a1a] overflow-hidden group cursor-pointer hover:border-brand-gold/50 transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-square overflow-hidden bg-secondary/30">
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          />

          {product.badge && (
            <Badge className="absolute top-3 left-3 bg-brand-gold/90 text-black border-none font-[family-name:var(--font-body)] font-bold text-xs uppercase">
              {product.badge}
            </Badge>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 flex items-center justify-center"
          >
            <Button
              onClick={(e) => {
                e.stopPropagation()
                onAddToCart(product)
              }}
              size="lg"
              className="bg-brand-gold/90 hover:bg-brand-gold text-black font-[family-name:var(--font-body)] font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              DODAJ DO KOSZYKA
            </Button>
          </motion.div>
        </div>

        <div className="p-6">
          <h3 className="font-[family-name:var(--font-body)] font-semibold text-lg text-white mb-2 group-hover:text-brand-gold transition-colors">
            {product.name}
          </h3>
          <p className="font-[family-name:var(--font-heading)] font-medium text-xl text-brand-gold tracking-tight">
            {product.price} PLN
          </p>
        </div>
      </Card>
    </motion.div>
  )
}
