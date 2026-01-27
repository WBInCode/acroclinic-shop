import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster, toast } from 'sonner'
import { AnimatePresence, motion } from 'framer-motion'
import { WireframeBackground } from '@/components/layout/WireframeBackground'
import { Navigation } from '@/components/layout/Navigation'
import { MobileNavBar } from '@/components/layout/MobileNavBar'
import { Hero } from '@/components/sections/Hero'
import { SplashScreen } from '@/components/sections/SplashScreen'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { ProductPage } from '@/components/shop/ProductPage'
import { CartPage, type CartItem } from '@/components/shop/CartPage'
import { WishlistPage } from '@/components/shop/WishlistPage'
import { AboutPage } from '@/components/pages/AboutPage'
import { ContactPage } from '@/components/pages/ContactPage'
import { TermsPage } from '@/components/pages/TermsPage'
import { MarqueeText } from '@/components/sections/MarqueeText'
import { TrustSignals } from '@/components/sections/TrustSignals'
import { ContactSection } from '@/components/sections/ContactSection'
import { AdminLogin } from '@/components/admin/AdminLogin'
import { AdminPanel } from '@/components/admin/AdminPanel'
import type { Product } from '@/components/shop/ProductCard'

type PageView = 'home' | 'product' | 'cart' | 'wishlist' | 'about' | 'contact' | 'terms' | 'admin-login' | 'admin'

function App() {
  const [cartItems, setCartItems] = useKV<CartItem[]>('acro-cart-v2', [])
  const [wishlistItems, setWishlistItems] = useKV<Product[]>('acro-wishlist', [])
  const [mobileTab, setMobileTab] = useState('home')
  const [showSplash, setShowSplash] = useState(true)
  const [currentView, setCurrentView] = useState<PageView>('home')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const handleEnterShop = () => {
    setShowSplash(false)
  }

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setCurrentView('product')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBackToShop = () => {
    setSelectedProduct(null)
    setCurrentView('home')
  }

  const handleOpenCart = () => {
    setCurrentView('cart')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOpenWishlist = () => {
    setCurrentView('wishlist')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleToggleWishlist = (product: Product) => {
    setWishlistItems((currentItems = []) => {
      const exists = currentItems.find(item => item.id === product.id)
      if (exists) {
        toast.success('Usunięto z listy życzeń', {
          description: product.name,
        })
        return currentItems.filter(item => item.id !== product.id)
      }
      toast.success('Dodano do listy życzeń', {
        description: product.name,
      })
      return [...currentItems, product]
    })
  }

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlistItems((currentItems = []) => {
      const item = currentItems.find(i => i.id === productId)
      if (item) {
        toast.success('Usunięto z listy życzeń', {
          description: item.name,
        })
      }
      return currentItems.filter(item => item.id !== productId)
    })
  }

  const isInWishlist = (productId: string) => {
    return wishlistItems?.some(item => item.id === productId) ?? false
  }

  const wishlistCount = wishlistItems?.length ?? 0

  const handleOpenAbout = () => {
    setCurrentView('about')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOpenContact = () => {
    setCurrentView('contact')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOpenTerms = () => {
    setCurrentView('terms')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const products: Product[] = [
    {
      id: '1',
      name: 'Koszulka Bokserka',
      price: 99.99,
      image: '/images/Bluzka - 1.png',
      badge: 'NEW',
      category: 'clothing',
      isBestseller: true,
    },
    {
      id: '2',
      name: 'T-shirt Dziecięcy',
      price: 89.99,
      image: '/images/T-Shirt - 1.png',
      category: 'clothing',
      isBestseller: true,
    },
    {
      id: '3',
      name: 'Longsleeve Dziecięcy',
      price: 99.99,
      image: '/images/sweter - 1.png',
      category: 'clothing',
    },
    {
      id: '4',
      name: 'Spodenki Kolarki',
      price: 89.99,
      image: '/images/spodenki - 1.png',
      badge: 'NEW',
      category: 'clothing',
      isBestseller: true,
    },
    {
      id: '5',
      name: 'Top Sportowy',
      price: 99.99,
      image: '/images/top - 1.png',
      category: 'clothing',
    },
    {
      id: '6',
      name: 'Legginsy',
      price: 144.99,
      image: '/images/legginsy 1.png',
      badge: 'LIMITED',
      category: 'clothing',
      isBestseller: true,
    },
    {
      id: '7',
      name: 'Dresy Jogger Dziecięce',
      price: 149.99,
      image: '/images/spodnie - 1.png',
      category: 'clothing',
    },
    {
      id: '8',
      name: 'Bluza Regular Dziecięca',
      price: 159.99,
      image: '/images/Bluza - 1.png',
      badge: 'LIMITED',
      category: 'clothing',
    },
    // Akcesoria - Gumy
    {
      id: '9',
      name: 'Taśma Gimnastyczna Fioletowa',
      price: 49.99,
      image: '/images/gumy/Fioletowa/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-fioletowa-415_1.webp',
      images: [
        '/images/gumy/Fioletowa/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-fioletowa-415_1.webp',
        '/images/gumy/Fioletowa/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-fioletowa-415_2.webp',
        '/images/gumy/Fioletowa/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-fioletowa-415_3.webp',
        '/images/gumy/Fioletowa/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-fioletowa-415_4.webp',
        '/images/gumy/Fioletowa/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-fioletowa-415_5.webp',
      ],
      category: 'accessories',
      badge: 'NEW',
    },
    {
      id: '10',
      name: 'Taśma Gimnastyczna Różowa',
      price: 49.99,
      image: '/images/gumy/Rózowa/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-rozowa-416_1.webp',
      images: [
        '/images/gumy/Rózowa/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-rozowa-416_1.webp',
        '/images/gumy/Rózowa/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-rozowa-416_2.webp',
        '/images/gumy/Rózowa/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-rozowa-416_3.webp',
        '/images/gumy/Rózowa/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-rozowa-416_4.webp',
        '/images/gumy/Rózowa/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-rozowa-416_6.webp',
      ],
      category: 'accessories',
      isBestseller: true,
    },
    {
      id: '11',
      name: 'Taśma Gimnastyczna Zielona',
      price: 49.99,
      image: '/images/gumy/Zielona/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-zielona-414_1.webp',
      images: [
        '/images/gumy/Zielona/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-zielona-414_1.webp',
        '/images/gumy/Zielona/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-zielona-414_2.webp',
        '/images/gumy/Zielona/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-zielona-414_4.webp',
        '/images/gumy/Zielona/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-zielona-414_5.webp',
        '/images/gumy/Zielona/pol_pl_Tasma-gimnastyczna-do-rozciagania-90-cm-zielona-414_6.webp',
      ],
      category: 'accessories',
    },
    // Akcesoria - Kostki
    {
      id: '12',
      name: 'Kostka do Jogi Czarna',
      price: 39.99,
      image: '/images/kostki/Czarna/pol_pl_Kostka-piankowa-do-jogi-czarna-74_1.webp',
      images: [
        '/images/kostki/Czarna/pol_pl_Kostka-piankowa-do-jogi-czarna-74_1.webp',
        '/images/kostki/Czarna/pol_pl_Kostka-piankowa-do-jogi-czarna-74_2.webp',
        '/images/kostki/Czarna/pol_pl_Kostka-piankowa-do-jogi-czarna-74_5.webp',
        '/images/kostki/Czarna/pol_pm_Kostka-piankowa-do-jogi-czarna-74_8.webp',
      ],
      category: 'accessories',
    },
    {
      id: '13',
      name: 'Kostka do Jogi Niebieska',
      price: 39.99,
      image: '/images/kostki/Niebieska/pol_pl_Kostka-piankowa-do-jogi-niebieska-73_1.webp',
      images: [
        '/images/kostki/Niebieska/pol_pl_Kostka-piankowa-do-jogi-niebieska-73_1.webp',
        '/images/kostki/Niebieska/pol_pl_Kostka-piankowa-do-jogi-niebieska-73_2.webp',
        '/images/kostki/Niebieska/pol_pl_Kostka-piankowa-do-jogi-niebieska-73_9.webp',
        '/images/kostki/Niebieska/pol_pl_Kostka-piankowa-do-jogi-niebieska-73_10.webp',
      ],
      category: 'accessories',
      isBestseller: true,
    },
    {
      id: '14',
      name: 'Kostka do Jogi Różowa',
      price: 39.99,
      image: '/images/kostki/Różowa/pol_pl_Kostka-piankowa-do-jogi-rozowa-290_1.webp',
      images: [
        '/images/kostki/Różowa/pol_pl_Kostka-piankowa-do-jogi-rozowa-290_1.webp',
        '/images/kostki/Różowa/pol_pl_Kostka-piankowa-do-jogi-rozowa-290_2.webp',
        '/images/kostki/Różowa/pol_pl_Kostka-piankowa-do-jogi-rozowa-290_4.webp',
        '/images/kostki/Różowa/pol_pl_Kostka-piankowa-do-jogi-rozowa-290_6.webp',
      ],
      category: 'accessories',
      badge: 'NEW',
    },
    {
      id: '15',
      name: 'Kostka do Jogi Szara',
      price: 39.99,
      image: '/images/kostki/Szara/pol_pl_Kostka-piankowa-do-jogi-szara-291_1.webp',
      images: [
        '/images/kostki/Szara/pol_pl_Kostka-piankowa-do-jogi-szara-291_1.webp',
        '/images/kostki/Szara/pol_pl_Kostka-piankowa-do-jogi-szara-291_2.webp',
        '/images/kostki/Szara/pol_pl_Kostka-piankowa-do-jogi-szara-291_5.webp',
        '/images/kostki/Szara/pol_pl_Kostka-piankowa-do-jogi-szara-291_8.webp',
      ],
      category: 'accessories',
    },
  ]

  const handleAddToCart = (product: Product) => {
    setCartItems((currentItems = []) => {
      const existingItem = currentItems.find((item) => item.id === product.id)
      if (existingItem) {
        toast.success('Zaktualizowano ilość w koszyku', {
          description: product.name,
        })
        return currentItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      
      toast.success('Dodano do koszyka', {
        description: product.name,
      })
      return [...currentItems, { ...product, quantity: 1 }]
    })
  }

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems((currentItems = []) => {
      if (quantity <= 0) {
        return currentItems.filter(item => item.id !== productId)
      }
      return currentItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    })
  }

  const handleRemoveItem = (productId: string) => {
    setCartItems((currentItems = []) => {
      const item = currentItems.find(i => i.id === productId)
      if (item) {
        toast.success('Usunięto z koszyka', {
          description: item.name,
        })
      }
      return currentItems.filter(item => item.id !== productId)
    })
  }

  const handleClearCart = () => {
    setCartItems([])
    toast.success('Koszyk został wyczyszczony')
  }

  const cartCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" onEnterShop={handleEnterShop} />
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <WireframeBackground />
            
            <div className="relative z-10">
              <Navigation 
                cartCount={cartCount} 
                wishlistCount={wishlistCount}
                onCartClick={handleOpenCart} 
                onWishlistClick={handleOpenWishlist}
                onLogoClick={handleBackToShop}
              />
              
              <main>
                <AnimatePresence mode="wait">
                  {currentView === 'admin-login' ? (
                    <AdminLogin
                      key="admin-login"
                      onLogin={() => setCurrentView('admin')}
                      onBack={handleBackToShop}
                    />
                  ) : currentView === 'admin' ? (
                    <AdminPanel
                      key="admin-panel"
                      onBack={handleBackToShop}
                    />
                  ) : currentView === 'about' ? (
                    <AboutPage
                      key="about-page"
                      onBack={handleBackToShop}
                    />
                  ) : currentView === 'contact' ? (
                    <ContactPage
                      key="contact-page"
                      onBack={handleBackToShop}
                    />
                  ) : currentView === 'terms' ? (
                    <TermsPage
                      key="terms-page"
                      onBack={handleBackToShop}
                    />
                  ) : currentView === 'wishlist' ? (
                    <WishlistPage
                      key="wishlist-page"
                      items={wishlistItems ?? []}
                      onContinueShopping={handleBackToShop}
                      onRemoveItem={handleRemoveFromWishlist}
                      onAddToCart={handleAddToCart}
                      onProductClick={handleProductClick}
                    />
                  ) : currentView === 'cart' ? (
                    <CartPage
                      key="cart-page"
                      items={cartItems ?? []}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemoveItem={handleRemoveItem}
                      onClearCart={handleClearCart}
                      onContinueShopping={handleBackToShop}
                    />
                  ) : currentView === 'product' && selectedProduct ? (
                    <ProductPage
                      key="product-page"
                      product={selectedProduct}
                      onBack={handleBackToShop}
                      onAddToCart={handleAddToCart}
                      onToggleWishlist={handleToggleWishlist}
                      isInWishlist={isInWishlist(selectedProduct.id)}
                    />
                  ) : (
                    <motion.div
                      key="home-page"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Hero />
                      <ProductGrid 
                        products={products} 
                        onAddToCart={handleAddToCart} 
                        onProductClick={handleProductClick}
                        onToggleWishlist={handleToggleWishlist}
                        isInWishlist={isInWishlist}
                      />
                      <MarqueeText />
                      <TrustSignals />
                      <ContactSection onContactClick={handleOpenContact} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </main>

              <footer className="relative mt-24 mb-20 md:mb-0 overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/95 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/5 via-transparent to-brand-gold/5" />
                
                {/* Top border with gold accent */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
                
                <div className="relative container mx-auto px-8 py-16">
                  <motion.div 
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* Logo with glow */}
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-brand-gold/20 blur-2xl rounded-full scale-150" />
                      <img 
                        src="/images/logo.png" 
                        alt="Acro Clinic" 
                        className="relative h-16 w-16 object-contain"
                      />
                    </div>
                    
                    {/* Brand name */}
                    <h3 className="font-[family-name:var(--font-heading)] font-black text-2xl tracking-[0.2em] mb-3">
                      <span className="text-white">ACRO</span>
                      <span className="text-brand-gold ml-2">CLINIC</span>
                    </h3>
                    
                    {/* Tagline */}
                    <p className="text-white/40 text-sm font-[family-name:var(--font-body)] tracking-wider mb-8">
                      Premium Sportswear & Accessories
                    </p>
                    
                    {/* Decorative line */}
                    <div className="w-24 h-px bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent mb-8" />
                    
                    {/* Links */}
                    <div className="flex flex-wrap justify-center gap-8 mb-10">
                      <button onClick={handleBackToShop} className="text-white/50 hover:text-brand-gold text-xs uppercase tracking-widest transition-colors duration-300">Sklep</button>
                      <button onClick={handleOpenAbout} className="text-white/50 hover:text-brand-gold text-xs uppercase tracking-widest transition-colors duration-300">O nas</button>
                      <button onClick={handleOpenContact} className="text-white/50 hover:text-brand-gold text-xs uppercase tracking-widest transition-colors duration-300">Kontakt</button>
                      <button onClick={handleOpenTerms} className="text-white/50 hover:text-brand-gold text-xs uppercase tracking-widest transition-colors duration-300">Regulamin</button>
                    </div>
                    
                    {/* Social icons placeholder */}
                    <div className="flex items-center gap-6 mb-10">
                      <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:border-brand-gold hover:text-brand-gold transition-all duration-300">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                      </a>
                      <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:border-brand-gold hover:text-brand-gold transition-all duration-300">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                      </a>
                      <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:border-brand-gold hover:text-brand-gold transition-all duration-300">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
                      </a>
                    </div>
                    
                    {/* Copyright - double click to access admin */}
                    <p 
                      className="text-white/20 text-[11px] font-[family-name:var(--font-body)] uppercase tracking-[0.3em] cursor-default select-none"
                      onDoubleClick={() => setCurrentView('admin-login')}
                    >
                      © 2026 Acro Clinic. Wszystkie prawa zastrzeżone.
                    </p>
                  </motion.div>
                </div>
              </footer>

              <MobileNavBar
                cartCount={cartCount}
                wishlistCount={wishlistCount}
                activeTab={mobileTab}
                onTabChange={setMobileTab}
                onCartClick={handleOpenCart}
                onWishlistClick={handleOpenWishlist}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toaster 
        position="bottom-center" 
        theme="dark"
        toastOptions={{
          style: {
            background: 'oklch(0.04 0 0)',
            border: '1px solid oklch(0.1 0 0)',
            color: 'oklch(1 0 0)',
          },
        }}
      />
    </div>
  )
}

export default App