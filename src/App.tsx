import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster, toast } from 'sonner'
import { WireframeBackground } from '@/components/layout/WireframeBackground'
import { Navigation } from '@/components/layout/Navigation'
import { MobileNavBar } from '@/components/layout/MobileNavBar'
import { Hero } from '@/components/sections/Hero'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { MarqueeText } from '@/components/sections/MarqueeText'
import { TrustSignals } from '@/components/sections/TrustSignals'
import { ContactSection } from '@/components/sections/ContactSection'
import type { Product } from '@/components/shop/ProductCard'

function App() {
  const [cartItems, setCartItems] = useKV<Product[]>('acro-cart', [])
  const [mobileTab, setMobileTab] = useState('home')

  const products: Product[] = [
    {
      id: '1',
      name: 'Elite Training Jersey',
      price: 249,
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop',
      badge: 'NEW',
      category: 'clothing',
      isBestseller: true,
    },
    {
      id: '2',
      name: 'Pro Performance Shorts',
      price: 189,
      image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&h=600&fit=crop',
      category: 'clothing',
      isBestseller: true,
    },
    {
      id: '3',
      name: 'Kostka Piankowa Premium',
      price: 79,
      image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600&h=600&fit=crop',
      badge: 'LIMITED',
      category: 'accessories',
      isBestseller: true,
    },
    {
      id: '4',
      name: 'Taśmy Oporowe Set',
      price: 129,
      image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&h=600&fit=crop',
      category: 'accessories',
    },
    {
      id: '5',
      name: 'Athletic Compression Top',
      price: 219,
      image: 'https://images.unsplash.com/photo-1579364046732-c21c2da97abc?w=600&h=600&fit=crop',
      badge: 'NEW',
      category: 'clothing',
    },
    {
      id: '6',
      name: 'Training Gloves Pro',
      price: 159,
      image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&h=600&fit=crop',
      category: 'accessories',
    },
    {
      id: '7',
      name: 'Performance Leggings',
      price: 239,
      image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=600&fit=crop',
      category: 'clothing',
      isBestseller: true,
    },
    {
      id: '8',
      name: 'Yoga Mat Elite',
      price: 199,
      image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop',
      badge: 'LIMITED',
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
        return currentItems
      }
      
      toast.success('Dodano do koszyka', {
        description: product.name,
      })
      return [...currentItems, product]
    })
  }

  const cartCount = cartItems?.length ?? 0

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <WireframeBackground />
      
      <div className="relative z-10">
        <Navigation cartCount={cartCount} />
        
        <main>
          <Hero />
          <ProductGrid products={products} onAddToCart={handleAddToCart} />
          <MarqueeText />
          <TrustSignals />
          <ContactSection />
        </main>

        <footer className="border-t border-[#1a1a1a] py-8 mt-20 mb-20 md:mb-0">
          <div className="container mx-auto px-4 text-center">
            <p className="text-white/60 text-sm font-[family-name:var(--font-body)]">
              © 2024 Acro Clinic. Wszystkie prawa zastrzeżone.
            </p>
          </div>
        </footer>

        <MobileNavBar
          cartCount={cartCount}
          activeTab={mobileTab}
          onTabChange={setMobileTab}
        />
      </div>

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