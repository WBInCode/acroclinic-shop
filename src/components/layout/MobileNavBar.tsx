import { Home, Heart, ShoppingCart, User } from 'lucide-react'

interface MobileNavBarProps {
  cartCount: number
  wishlistCount?: number
  activeTab: string
  onTabChange: (tab: string) => void
  onCartClick?: () => void
  onWishlistClick?: () => void
  onUserClick?: () => void
}

export function MobileNavBar({ cartCount, wishlistCount = 0, activeTab, onTabChange, onCartClick, onWishlistClick, onUserClick }: MobileNavBarProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Główna' },
    { id: 'wishlist', icon: Heart, label: 'Ulubione', badge: wishlistCount },
    { id: 'cart', icon: ShoppingCart, label: 'Koszyk', badge: cartCount },
    { id: 'user', icon: User, label: 'Konto' },
  ]

  const handleTabClick = (tabId: string) => {
    if (tabId === 'cart' && onCartClick) {
      onCartClick()
    } else if (tabId === 'wishlist' && onWishlistClick) {
      onWishlistClick()
    } else if (tabId === 'user' && onUserClick) {
      onUserClick()
    } else {
      onTabChange(tabId)
    }
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-t border-white/[0.06]">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className="relative flex flex-col items-center justify-center gap-1 transition-all duration-300"
            >
              <div className="relative">
                <Icon 
                  className={`w-5 h-5 transition-colors duration-300 ${
                    isActive ? 'text-brand-gold' : 'text-white/40'
                  }`} 
                />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center bg-brand-gold text-black text-[9px] font-medium rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <span 
                className={`text-[9px] tracking-wider uppercase transition-colors duration-300 ${
                  isActive ? 'text-brand-gold' : 'text-white/30'
                }`}
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

