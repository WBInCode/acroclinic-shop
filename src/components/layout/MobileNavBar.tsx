import { Home, Heart, ShoppingCart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface MobileNavBarProps {
  cartCount: number
  wishlistCount?: number
  activeTab: string
  onTabChange: (tab: string) => void
  onCartClick?: () => void
  onWishlistClick?: () => void
}

export function MobileNavBar({ cartCount, wishlistCount = 0, activeTab, onTabChange, onCartClick, onWishlistClick }: MobileNavBarProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Główna' },
    { id: 'wishlist', icon: Heart, label: 'Ulubione', badge: wishlistCount },
    { id: 'cart', icon: ShoppingCart, label: 'Koszyk', badge: cartCount },
  ]

  const handleTabClick = (tabId: string) => {
    if (tabId === 'cart' && onCartClick) {
      onCartClick()
    } else if (tabId === 'wishlist' && onWishlistClick) {
      onWishlistClick()
    } else {
      onTabChange(tabId)
    }
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-t border-[#1a1a1a] transition-transform duration-300">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className="relative flex flex-col items-center justify-center gap-1 transition-colors"
            >
              <div className="relative">
                <Icon 
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-brand-gold' : 'text-white'
                  }`} 
                />
                {item.badge && item.badge > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 bg-brand-gold text-black text-[10px] font-bold border-none"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span 
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-brand-gold' : 'text-white/60'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-brand-gold rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
