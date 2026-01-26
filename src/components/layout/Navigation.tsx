import { Search, ShoppingCart, User, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

interface NavigationProps {
  cartCount: number
}

export function Navigation({ cartCount }: NavigationProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-[#1a1a1a]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="font-[family-name:var(--font-heading)] font-bold text-2xl tracking-tight">
            <span className="text-brand-gold">AC</span>
          </div>
          
          <div className="hidden md:flex relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Szukaj produktów..."
              className="pl-10 bg-secondary/50 border-border focus:ring-brand-gold focus:border-brand-gold transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden md:flex text-white hover:text-brand-gold transition-colors">
            <Search className="w-5 h-5 md:hidden" />
          </Button>
          
          <Button variant="ghost" size="icon" className="text-white hover:text-brand-gold transition-colors">
            <Heart className="w-5 h-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="relative text-white hover:text-brand-gold transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-brand-gold text-black text-xs font-bold border-none"
                style={{ animation: cartCount > 0 ? 'bounce-scale 0.3s ease-out' : 'none' }}
              >
                {cartCount}
              </Badge>
            )}
          </Button>
          
          <Button variant="ghost" size="icon" className="text-white hover:text-brand-gold transition-colors">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </nav>
  )
}
