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
import { PrivacyPolicyPage } from '@/components/pages/PrivacyPolicyPage'
import { MarqueeText } from '@/components/sections/MarqueeText'
import { ContactSection } from '@/components/sections/ContactSection'
import { PayULogo } from '@/components/ui/PayULogo'
import { CookieConsentBanner } from '@/components/ui/CookieConsentBanner'
import { NewsletterSection } from '@/components/sections/NewsletterSection'
import { AuthDialog } from '@/components/auth/AuthDialog'
import { UserPanel } from '@/components/user/UserPanel'

import type { Product } from '@/components/shop/ProductCard'
import { authApi, getAccessToken, productsApi, type User } from '@/lib/api'

type PageView = 'home' | 'product' | 'cart' | 'checkout' | 'order-confirmation' | 'wishlist' | 'about' | 'contact' | 'terms' | 'privacy' | 'account'

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
          stock: p.stock,
        }))
        setProducts(mappedProducts)

        // Zaktualizuj stany magazynowe w koszyku
        setCartItems(currentCart => {
          return currentCart.map(item => {
            const freshProduct = mappedProducts.find(p => p.id === item.id)
            if (freshProduct) {
              return {
                ...item,
                stock: freshProduct.stock,
                price: freshProduct.price, // Aktualizuj też cenę
                name: freshProduct.name,
                image: freshProduct.image
              }
            }
            return item
          })
        })
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

  const handleOpenPrivacy = () => {
    setShowSplash(false)
    setCurrentView('privacy')
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
                  ) : currentView === 'privacy' ? (
                    <PrivacyPolicyPage
                      key="privacy-page"
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
                      <NewsletterSection />
                      <ContactSection onContactClick={handleOpenContact} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </main>

              <footer className="relative mt-1 mb-20 md:mb-0">
                {/* Elegant top border */}
                <div className="flex items-center justify-center gap-4 mb-16">
                  <div className="w-16 h-px bg-gradient-to-r from-transparent to-brand-gold/30" />
                  <div className="w-1.5 h-1.5 rotate-45 border border-brand-gold/40" />
                  <div className="w-32 h-px bg-brand-gold/30" />
                  <div className="w-1.5 h-1.5 rotate-45 border border-brand-gold/40" />
                  <div className="w-16 h-px bg-gradient-to-l from-transparent to-brand-gold/30" />
                </div>

                <div className="container mx-auto px-8">
                  <motion.div
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* Brand name - serif elegant */}
                    <h3
                      className="text-3xl md:text-4xl mb-2"
                      style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                    >
                      <span className="text-white">Acro</span>
                      <span className="text-brand-gold italic ml-1">Clinic</span>
                    </h3>

                    {/* Tagline */}
                    <p
                      className="text-white/30 text-xs tracking-[0.25em] uppercase mb-12"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      Professional Acrobatic Equipment
                    </p>

                    {/* Navigation links - elegant underline style */}
                    <nav className="flex flex-wrap justify-center gap-x-12 gap-y-4 mb-12">
                      {[
                        { label: 'Sklep', onClick: handleBackToShop },
                        { label: 'O nas', onClick: handleOpenAbout },
                        { label: 'Kontakt', onClick: handleOpenContact },
                        { label: 'Regulamin', onClick: handleOpenTerms },
                        { label: 'Polityka prywatności', onClick: handleOpenPrivacy },
                      ].map((link) => (
                        <button
                          key={link.label}
                          onClick={link.onClick}
                          className="group relative text-white/40 hover:text-white text-xs uppercase tracking-[0.2em] transition-colors duration-500"
                          style={{ fontFamily: "'Lato', sans-serif" }}
                        >
                          {link.label}
                          <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand-gold transition-all duration-500 group-hover:w-full" />
                        </button>
                      ))}
                    </nav>

                    {/* Social icons - minimal */}
                    <div className="flex items-center gap-8 mb-16">
                      <a
                        href="https://acroclinic.pl"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/30 hover:text-brand-gold transition-colors duration-300"
                        aria-label="Website"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                        </svg>
                      </a>
                      <a
                        href="https://www.instagram.com/acro_clinic/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/30 hover:text-brand-gold transition-colors duration-300"
                        aria-label="Instagram"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </a>
                      <a
                        href="https://www.facebook.com/share/17udvn9g4X/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/30 hover:text-brand-gold transition-colors duration-300"
                        aria-label="Facebook"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                        </svg>
                      </a>
                    </div>

                    {/* Payment methods */}
                    <div className="flex items-center gap-4 mb-12 opacity-40 hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/5 rounded px-2 py-1">
                        <PayULogo size="sm" className="text-white/80" />
                      </div>
                    </div>

                    {/* Copyright - minimal */}
                    <p
                      className="text-white/15 text-[10px] tracking-[0.2em] uppercase"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      © 2026 Acro Clinic
                    </p>
                  </motion.div>
                </div>

                {/* Bottom spacing */}
                <div className="h-8" />
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

      <CookieConsentBanner onOpenPrivacyPolicy={handleOpenPrivacy} />

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