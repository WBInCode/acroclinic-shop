import { useState, useEffect } from 'react'
import { Toaster, toast } from 'sonner'
import { AnimatePresence, motion } from 'framer-motion'
import { WireframeBackground } from '@/components/layout/WireframeBackground'
import { Navigation } from '@/components/layout/Navigation'
import { MobileNavBar } from '@/components/layout/MobileNavBar'
import { OrderCountdown } from '@/components/layout/OrderCountdown'
import { Hero } from '@/components/sections/Hero'
import { SplashScreen } from '@/components/sections/SplashScreen'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { ProductPage } from '@/components/shop/ProductPage'
import { CartPage, type CartItem } from '@/components/shop/CartPage'
import { CheckoutPage } from '@/components/shop/CheckoutPage'
import { OrderConfirmationPage } from '@/components/shop/OrderConfirmationPage'
import { WishlistPage } from '@/components/shop/WishlistPage'
import { AboutPage } from '@/components/pages/AboutPage'
import { ContactPage } from '@/components/pages/ContactPage'
import { TermsPage } from '@/components/pages/TermsPage'
import { MarqueeText } from '@/components/sections/MarqueeText'
import { ContactSection } from '@/components/sections/ContactSection'
import { AuthDialog } from '@/components/auth/AuthDialog'
import { UserPanel } from '@/components/user/UserPanel'

import type { Product } from '@/components/shop/ProductCard'
import { authApi, getAccessToken, productsApi, type User } from '@/lib/api'

type PageView = 'home' | 'product' | 'cart' | 'checkout' | 'order-confirmation' | 'wishlist' | 'about' | 'contact' | 'terms' | 'account'

function App() {
  // Przechowywanie koszyka w localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('acro-cart-v2')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Przechowywanie listy życzeń w localStorage
  const [wishlistItems, setWishlistItems] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('acro-wishlist')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Zapisz koszyk do localStorage przy każdej zmianie
  useEffect(() => {
    localStorage.setItem('acro-cart-v2', JSON.stringify(cartItems))
  }, [cartItems])

  // Zapisz wishlist do localStorage przy każdej zmianie
  useEffect(() => {
    localStorage.setItem('acro-wishlist', JSON.stringify(wishlistItems))
  }, [wishlistItems])

  const [mobileTab, setMobileTab] = useState('home')
  const [showSplash, setShowSplash] = useState(true)
  const [currentView, setCurrentView] = useState<PageView>('home')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [orderNumber, setOrderNumber] = useState<string>('')
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'cancelled' | 'pending'>('pending')
  const [user, setUser] = useState<User | null>(null)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [postAuthView, setPostAuthView] = useState<PageView | null>(null)

  // Sprawdź URL dla potwierdzenia płatności PayU
  useEffect(() => {
    const url = new URL(window.location.href)
    const pathParts = url.pathname.split('/')
    
    // Sprawdź /order/:orderNumber pattern
    if (pathParts[1] === 'order' && pathParts[2]) {
      const orderNum = pathParts[2]
      const payment = url.searchParams.get('payment')
      
      setOrderNumber(orderNum)
      setPaymentStatus(payment === 'success' ? 'success' : payment === 'cancelled' ? 'cancelled' : 'pending')
      setCurrentView('order-confirmation')
      setShowSplash(false)
      
      // Wyczyść koszyk po pomyślnej płatności
      if (payment === 'success') {
        setCartItems([])
        localStorage.removeItem('cart')
      }
      
      // Wyczyść URL
      window.history.replaceState({}, '', '/')
    }
  }, [])

  // Pobierz produkty z API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await productsApi.getProducts({ limit: 100 })
        // Mapuj produkty z API na format komponentów
        const mappedProducts: Product[] = response.products.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.image || '',
          images: p.images || [],
          sizes: p.sizes || [],
          description: p.description || '',
          features: p.features || [],
          materials: p.materials || '',
          badge: p.badge as 'NEW' | 'LIMITED' | undefined,
          category: p.category?.slug === 'accessories' ? 'accessories' : 'clothing',
          isBestseller: p.isBestseller,
        }))
        setProducts(mappedProducts)
      } catch (error) {
        console.error('Błąd pobierania produktów:', error)
        toast.error('Nie udało się pobrać produktów')
      } finally {
        setIsLoadingProducts(false)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    const token = getAccessToken()
    if (!token) return

    authApi.getMe()
      .then(({ user: loadedUser }) => setUser(loadedUser))
      .catch(() => setUser(null))
  }, [])

  useEffect(() => {
    const handleLogout = () => setUser(null)
    window.addEventListener('auth:logout', handleLogout)
    return () => window.removeEventListener('auth:logout', handleLogout)
  }, [])

  useEffect(() => {
    const url = new URL(window.location.href)
    const resetToken = url.searchParams.get('resetToken')
    if (resetToken) {
      setIsAuthOpen(true)
    }
  }, [])

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

  const handleOpenCheckout = () => {
    if (!user) {
      setPostAuthView('checkout')
      setIsAuthOpen(true)
      return
    }
    setCurrentView('checkout')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOpenAuth = () => {
    if (user) {
      setCurrentView('account')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setPostAuthView(null)
      setIsAuthOpen(true)
    }
  }

  const handleAuthSuccess = (loggedUser: User) => {
    setUser(loggedUser)
    if (postAuthView) {
      setCurrentView(postAuthView)
      setPostAuthView(null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleAuthOpenChange = (open: boolean) => {
    setIsAuthOpen(open)
    if (!open && !user) {
      setPostAuthView(null)
    }
  }

  const handleLogout = async () => {
    await authApi.logout()
    setUser(null)
  }

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser)
  }

  const handleOrderComplete = (orderNum: string) => {
    setOrderNumber(orderNum)
    setPaymentStatus('pending')
    setCurrentView('order-confirmation')
    setCartItems([])
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

  const handleAddToCart = (product: Product, selectedSize?: string, quantity: number = 1) => {
    setCartItems((currentItems = []) => {
      // Dla produktów z rozmiarem, sprawdź czy już jest taki sam produkt z tym samym rozmiarem
      const itemKey = selectedSize ? `${product.id}-${selectedSize}` : product.id
      const existingItem = currentItems.find((item) => {
        const existingKey = item.selectedSize ? `${item.id}-${item.selectedSize}` : item.id
        return existingKey === itemKey
      })
      
      if (existingItem) {
        toast.success('Zaktualizowano ilość w koszyku', {
          description: `${product.name}${selectedSize ? ` (${selectedSize})` : ''} - dodano ${quantity} szt.`,
        })
        return currentItems.map(item => {
          const existingKey = item.selectedSize ? `${item.id}-${item.selectedSize}` : item.id
          return existingKey === itemKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        })
      }
      
      toast.success('Dodano do koszyka', {
        description: `${product.name}${selectedSize ? ` (${selectedSize})` : ''} - ${quantity} szt.`,
      })
      return [...currentItems, { ...product, quantity, selectedSize }]
    })
  }

  const handleUpdateQuantity = (itemKey: string, quantity: number) => {
    setCartItems((currentItems = []) => {
      if (quantity <= 0) {
        return currentItems.filter(item => {
          const key = item.selectedSize ? `${item.id}-${item.selectedSize}` : item.id
          return key !== itemKey
        })
      }
      return currentItems.map(item => {
        const key = item.selectedSize ? `${item.id}-${item.selectedSize}` : item.id
        return key === itemKey
          ? { ...item, quantity }
          : item
      })
    })
  }

  const handleRemoveItem = (itemKey: string) => {
    setCartItems((currentItems = []) => {
      const item = currentItems.find(i => {
        const key = i.selectedSize ? `${i.id}-${i.selectedSize}` : i.id
        return key === itemKey
      })
      if (item) {
        toast.success('Usunięto z koszyka', {
          description: `${item.name}${item.selectedSize ? ` (${item.selectedSize})` : ''}`,
        })
      }
      return currentItems.filter(item => {
        const key = item.selectedSize ? `${item.id}-${item.selectedSize}` : item.id
        return key !== itemKey
      })
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
              <OrderCountdown />
              <Navigation 
                cartCount={cartCount} 
                wishlistCount={wishlistCount}
                onCartClick={handleOpenCart} 
                onWishlistClick={handleOpenWishlist}
                onLogoClick={handleBackToShop}
                onUserClick={handleOpenAuth}
                isAuthenticated={!!user}
              />
              
              <main>
                <AnimatePresence mode="wait">
                  {currentView === 'about' ? (
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
                      onCheckout={handleOpenCheckout}
                    />
                  ) : currentView === 'checkout' ? (
                    <CheckoutPage
                      key="checkout-page"
                      items={cartItems ?? []}
                      onBack={handleOpenCart}
                      onOrderComplete={handleOrderComplete}
                      user={user}
                    />
                  ) : currentView === 'order-confirmation' ? (
                    <OrderConfirmationPage
                      key="order-confirmation-page"
                      orderNumber={orderNumber}
                      paymentStatus={paymentStatus}
                      onContinueShopping={handleBackToShop}
                    />
                  ) : currentView === 'account' && user ? (
                    <UserPanel
                      key="user-panel"
                      user={user}
                      onBack={handleBackToShop}
                      onLogout={handleLogout}
                      onUserUpdate={handleUserUpdate}
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
                      <a href="https://acroclinic.pl" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 hover:border-brand-gold transition-all duration-300 overflow-hidden">
                        <img src="/images/logo2.png" alt="Acro Clinic" className="w-8 h-8 object-contain" />
                      </a>
                      <a href="https://www.instagram.com/acro_clinic/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:border-brand-gold hover:text-brand-gold transition-all duration-300">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                      </a>
                      <a href="https://www.facebook.com/share/17udvn9g4X/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:border-brand-gold hover:text-brand-gold transition-all duration-300">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
                      </a>
                    </div>
                    
                    {/* Copyright */}
                    <p className="text-white/20 text-[11px] font-[family-name:var(--font-body)] uppercase tracking-[0.3em]">
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
                onUserClick={handleOpenAuth}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthDialog
        open={isAuthOpen}
        onOpenChange={handleAuthOpenChange}
        user={user}
        onAuthSuccess={handleAuthSuccess}
        onLogout={handleLogout}
      />

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