import { motion } from 'framer-motion'
import { CheckCircle, Package, ArrowRight, XCircle, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

const ease = [0.22, 1, 0.36, 1] as const

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

interface OrderConfirmationPageProps {
  orderNumber: string
  paymentStatus?: 'success' | 'cancelled' | 'pending'
  onContinueShopping: () => void
}

interface OrderDetails {
  orderNumber: string
  status: string
  paymentStatus: string
  total: number
  shippingAddress?: {
    firstName: string
    lastName: string
    street: string
    city: string
    postalCode: string
  }
  items?: {
    name: string
    quantity: number
    price: number
    image?: string
  }[]
}

export function OrderConfirmationPage({ orderNumber, paymentStatus = 'pending', onContinueShopping }: OrderConfirmationPageProps) {
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const sessionId = localStorage.getItem('sessionId')
        const response = await fetch(`${API_URL}/payu/status/${orderNumber}`, {
          headers: {
            'X-Session-ID': sessionId || '',
          },
        })

        if (response.ok) {
          const data = await response.json()
          setOrder(data)
        } else {
          setError('Nie można pobrać danych zamówienia')
        }
      } catch (err) {
        console.error('Error fetching order:', err)
        setError('Błąd połączenia z serwerem')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
    
    // Poll for payment status update
    const interval = setInterval(fetchOrder, 5000)
    return () => clearInterval(interval)
  }, [orderNumber])

  const isSuccess = paymentStatus === 'success' || order?.paymentStatus === 'COMPLETED'
  const isCancelled = paymentStatus === 'cancelled' || order?.paymentStatus === 'CANCELLED' || order?.paymentStatus === 'FAILED'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease }}
      className="min-h-screen pt-36 pb-32 flex items-center justify-center"
    >
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          className="bg-[#0c0c0c] rounded-2xl p-8 md:p-12 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-20 h-20 text-brand-gold mx-auto mb-6 animate-spin" />
              <h1 className="font-[family-name:var(--font-heading)] font-bold text-2xl md:text-3xl text-white uppercase tracking-tight mb-4">
                Sprawdzanie płatności...
              </h1>
              <p className="text-white/60 font-[family-name:var(--font-body)]">
                Proszę czekać
              </p>
            </>
          ) : isSuccess ? (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, ease, delay: 0.2 }}
              >
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              </motion.div>
              
              <h1 className="font-[family-name:var(--font-heading)] font-bold text-2xl md:text-3xl text-white uppercase tracking-tight mb-4">
                Dziękujemy za <span className="text-brand-gold">zamówienie!</span>
              </h1>
              
              <p className="text-white/60 font-[family-name:var(--font-body)] mb-8">
                Twoja płatność została zrealizowana pomyślnie.
                <br />
                Potwierdzenie zostanie wysłane na Twój adres email.
              </p>

              <div className="bg-brand-gold/10 border border-brand-gold/30 p-6 mb-8">
                <p className="text-white/60 text-sm font-[family-name:var(--font-body)] uppercase tracking-wider mb-2">
                  Numer zamówienia
                </p>
                <p className="font-[family-name:var(--font-heading)] font-bold text-2xl text-brand-gold">
                  {order?.orderNumber || orderNumber}
                </p>
              </div>

              {order?.total && (
                <p className="text-white/60 font-[family-name:var(--font-body)] mb-8">
                  Kwota: <span className="text-white font-bold">{order.total.toFixed(2)} PLN</span>
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={onContinueShopping} className="btn-primary flex items-center justify-center gap-2">
                  Kontynuuj zakupy
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Next steps */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <h3 className="font-[family-name:var(--font-heading)] font-bold text-sm text-white uppercase tracking-wider mb-4">
                  Co dalej?
                </h3>
                <div className="flex items-center justify-center gap-4 text-white/60 text-sm">
                  <Package className="w-5 h-5 text-brand-gold" />
                  <span className="font-[family-name:var(--font-body)]">
                    Przygotujemy Twoje zamówienie i wyślemy je najszybciej jak to możliwe
                  </span>
                </div>
              </div>
            </>
          ) : isCancelled ? (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, ease, delay: 0.2 }}
              >
                <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
              </motion.div>
              
              <h1 className="font-[family-name:var(--font-heading)] font-bold text-2xl md:text-3xl text-white uppercase tracking-tight mb-4">
                Płatność <span className="text-red-500">anulowana</span>
              </h1>
              
              <p className="text-white/60 font-[family-name:var(--font-body)] mb-8">
                Twoja płatność została anulowana lub nie powiodła się.
                <br />
                Możesz spróbować ponownie.
              </p>

              <div className="bg-[#0a0a0a] rounded-xl p-6 mb-8">
                <p className="text-white/60 text-sm font-[family-name:var(--font-body)] uppercase tracking-wider mb-2">
                  Numer zamówienia
                </p>
                <p className="font-[family-name:var(--font-heading)] font-bold text-xl text-white">
                  {order?.orderNumber || orderNumber}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={onContinueShopping} className="btn-primary">
                  Wróć do sklepu
                </button>
              </div>
            </>
          ) : (
            <>
              <Loader2 className="w-20 h-20 text-brand-gold mx-auto mb-6 animate-spin" />
              
              <h1 className="font-[family-name:var(--font-heading)] font-bold text-2xl md:text-3xl text-white uppercase tracking-tight mb-4">
                Oczekiwanie na <span className="text-brand-gold">płatność</span>
              </h1>
              
              <p className="text-white/60 font-[family-name:var(--font-body)] mb-8">
                Twoje zamówienie oczekuje na potwierdzenie płatności.
                <br />
                Ta strona odświeży się automatycznie.
              </p>

              <div className="bg-brand-gold/10 border border-brand-gold/30 p-6 mb-8">
                <p className="text-white/60 text-sm font-[family-name:var(--font-body)] uppercase tracking-wider mb-2">
                  Numer zamówienia
                </p>
                <p className="font-[family-name:var(--font-heading)] font-bold text-2xl text-brand-gold">
                  {order?.orderNumber || orderNumber}
                </p>
              </div>

              <button onClick={onContinueShopping} className="btn-secondary">
                Wróć do sklepu
              </button>
            </>
          )}

          {error && (
            <p className="text-red-400 text-sm mt-4">{error}</p>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
