import { Home, Heart, ShoppingCart, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-t border-white/[0.06] pb-safe">
      <div className="grid grid-cols-4 h-[80px]">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className="relative flex flex-col items-center justify-center gap-1.5 transition-all duration-300 group"
            >
              <div className="relative p-1">
                <Icon
                  className={`w-6 h-6 transition-all duration-300 ${isActive ? 'text-brand-gold scale-110' : 'text-white/40 group-hover:text-white/60'
                    }`}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                <AnimatePresence>
                  {item.badge && item.badge > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] flex items-center justify-center bg-brand-gold text-black text-[10px] font-bold rounded-full border-2 border-[#0a0a0a] px-1"
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <span
                className={`text-[10px] tracking-[0.1em] uppercase transition-colors duration-300 ${isActive ? 'text-brand-gold font-medium' : 'text-white/30'
                  }`}
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                {item.label}
              </span>

              {/* Active indicator dot */}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-2 w-1 h-1 rounded-full bg-brand-gold"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

