import { motion } from 'framer-motion'
import { ArrowLeft, CreditCard, Truck, Shield, Lock, CheckCircle, Loader2, Package, MapPin, Search, ChevronDown, Star, Building2, Save, Scissors, PackageCheck } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import type { CartItem } from './CartPage'
import { addressApi, type User, type Address, getAccessToken } from '@/lib/api'
import { PayULogo } from '@/components/ui/PayULogo'

// Token GeoWidget InPost
const INPOST_GEOWIDGET_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJzQlpXVzFNZzVlQnpDYU1XU3JvTlBjRWFveFpXcW9Ua2FuZVB3X291LWxvIn0.eyJleHAiOjIwODU1NTk0MzQsImlhdCI6MTc3MDE5OTQzNCwianRpIjoiZGExNDkzYjgtMjUxOC00M2ZjLWJmNzYtYmNkODZkMDcxZDIzIiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5pbnBvc3QucGwvYXV0aC9yZWFsbXMvZXh0ZXJuYWwiLCJzdWIiOiJmOjEyNDc1MDUxLTFjMDMtNGU1OS1iYTBjLTJiNDU2OTVlZjUzNTp3V2VfRW1yNU9XYmpRbnpuMmxSOU5Ubk5ncF9CWDZxaGZDWG5uQ1dyNko0IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic2hpcHgiLCJzZXNzaW9uX3N0YXRlIjoiZGMyNGJkYjYtZmRlOC00YWQ1LTgyNDMtNmI4OWIwYzBlMzJmIiwic2NvcGUiOiJvcGVuaWQgYXBpOmFwaXBvaW50cyIsInNpZCI6ImRjMjRiZGI2LWZkZTgtNGFkNS04MjQzLTZiODliMGMwZTMyZiIsImFsbG93ZWRfcmVmZXJyZXJzIjoiIiwidXVpZCI6ImI3OTNjZTJhLThiZTItNDNhYS1iNjMzLTNkYjA1ZWE4MTRkYiJ9.HDBqjOx5BX_yeT4MYgWD-urqzFdPNiaC9cJq9vMdUjZUukuJlEF4D64Qhg5qj7UnJx91vuqL6i5clMe7Ecd-Mrc34m49Eec_OlJ9RKckz-CGiTty13jlZKEyTLqNRKdBrt19L0rGihotOW_eTWZ8DrhMxR-_Y0xpxk7mMJEQ-TWRoNnKB6xuYznaBQRaRhhJKzC-NWv2U4FFNrNQkKo4eu4HnHmpGKOkLoAxyB6RQwF7_s-NxqJgh17-uK0syS86VnwD8As3bNji6VQ_vqN78yXYc1-2WIiP1UonnK661_JlR0OV8tCnUAopRXo4B4yJDjRqJkyAjTLG1h23dfzm5w'

const ease = [0.22, 1, 0.36, 1] as const

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

type DeliveryMethod = 'courier' | 'parcel-locker'
type ShipmentType = 'STANDARD' | 'SPLIT' | 'COMBINED'

interface CheckoutPageProps {
  items: CartItem[]
  onBack: () => void
  onOrderComplete: (orderNumber: string) => void
  user?: User | null
}

interface ShippingAddress {
  firstName: string
  lastName: string
  street: string
  city: string
  postalCode: string
  country: string
  phone: string
  email: string
  parcelLockerCode?: string
  parcelLockerAddress?: string
}

interface FormErrors {
  [key: string]: string
}

export function CheckoutPage({ items, onBack, onOrderComplete, user }: CheckoutPageProps) {
  const [step, setStep] = useState<'shipping' | 'payment' | 'processing'>('shipping')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('courier')
  const [shippingData, setShippingData] = useState<ShippingAddress>(() => ({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    street: '',
    city: '',
    postalCode: '',
    country: 'Polska',
    phone: user?.phone || '',
    email: user?.email || '',
    parcelLockerCode: '',
    parcelLockerAddress: '',
  }))

  // Saved addresses state
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [showAddressSelector, setShowAddressSelector] = useState(false)
  const [saveAddressToAccount, setSaveAddressToAccount] = useState(false)
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false)
  const [standardShippingCost, setStandardShippingCost] = useState(19.90)

  useEffect(() => {
    fetch(`${API_URL}/orders/config/shipping`)
      .then(res => {
        if (res.ok) return res.json()
        throw new Error('Failed')
      })
      .then(data => setStandardShippingCost(Number(data.cost)))
      .catch(() => { }) // Ignore error, stick to default
  }, [])

  // Billing address state
  const [wantInvoice, setWantInvoice] = useState(false)
  const [savedBillingAddresses, setSavedBillingAddresses] = useState<Address[]>([])
  const [selectedBillingAddressId, setSelectedBillingAddressId] = useState<string | null>(null)
  const [showBillingAddressSelector, setShowBillingAddressSelector] = useState(false)
  const [billingData, setBillingData] = useState({
    companyName: '',
    nip: '',
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    postalCode: '',
    email: '',
  })

  // Split shipment state
  const isMixedCart = items.some(item => item.category === 'clothing') && items.some(item => item.category === 'accessories')
  const [shipmentType, setShipmentType] = useState<ShipmentType>('STANDARD')

  // Redirect if out of stock
  useEffect(() => {
    const hasOutOfStock = items.some(item => item.stock === 0)
    if (hasOutOfStock) {
      onBack()
    }
  }, [items, onBack])

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingCost = standardShippingCost
  const shipping = shippingCost
  const [showGeoWidget, setShowGeoWidget] = useState(false)
  const [geoWidgetLoaded, setGeoWidgetLoaded] = useState(false)
  const geoWidgetRef = useRef<HTMLElement | null>(null)
  const total = subtotal + shipping
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Fetch saved addresses for logged-in users
  useEffect(() => {
    if (user) {
      fetchSavedAddresses()
    }
  }, [user])

  const fetchSavedAddresses = async () => {
    if (!user) return
    setIsLoadingAddresses(true)
    try {
      const data = await addressApi.getAddresses()
      const addresses = data.addresses || []
      setSavedAddresses(addresses.filter(a => a.type === 'SHIPPING'))
      setSavedBillingAddresses(addresses.filter(a => a.type === 'BILLING'))

      // Auto-select default shipping address
      const defaultShipping = addresses.find(a => a.type === 'SHIPPING' && a.isDefault)
      if (defaultShipping) {
        selectAddress(defaultShipping)
      }

      // Auto-select default billing address
      const defaultBilling = addresses.find(a => a.type === 'BILLING' && a.isDefault)
      if (defaultBilling) {
        setSelectedBillingAddressId(defaultBilling.id)
        setBillingData({
          companyName: defaultBilling.companyName || '',
          nip: defaultBilling.nip || '',
          firstName: defaultBilling.firstName,
          lastName: defaultBilling.lastName,
          street: defaultBilling.street,
          city: defaultBilling.city,
          postalCode: defaultBilling.postalCode,
          email: defaultBilling.email || '',
        })
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
    } finally {
      setIsLoadingAddresses(false)
    }
  }

  const selectAddress = (address: Address) => {
    setSelectedAddressId(address.id)
    setShippingData(prev => ({
      ...prev,
      firstName: address.firstName,
      lastName: address.lastName,
      street: address.street,
      city: address.city,
      postalCode: address.postalCode,
      phone: address.phone || prev.phone,
    }))
    setShowAddressSelector(false)
  }

  const selectBillingAddress = (address: Address) => {
    setSelectedBillingAddressId(address.id)
    setBillingData({
      companyName: address.companyName || '',
      nip: address.nip || '',
      firstName: address.firstName,
      lastName: address.lastName,
      street: address.street,
      city: address.city,
      postalCode: address.postalCode,
      email: address.email || '',
    })
    setShowBillingAddressSelector(false)
  }

  const handleBillingInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === 'postalCode') {
      let formatted = value.replace(/\D/g, '')
      if (formatted.length > 2) {
        formatted = formatted.slice(0, 2) + '-' + formatted.slice(2, 5)
      }
      setBillingData(prev => ({ ...prev, [name]: formatted }))
    } else {
      setBillingData(prev => ({ ...prev, [name]: value }))
    }
    setSelectedBillingAddressId(null) // Deselect saved address when editing manually
  }

  useEffect(() => {
    if (!user) return
    setShippingData(prev => ({
      ...prev,
      firstName: prev.firstName || user.firstName || '',
      lastName: prev.lastName || user.lastName || '',
      email: prev.email || user.email || '',
      phone: prev.phone || user.phone || '',
    }))
  }, [user])

  // Ładowanie skryptu InPost GeoWidget
  useEffect(() => {
    if (geoWidgetLoaded) return

    // Sprawdź czy już załadowany
    if (document.querySelector('script[src*="inpost-geowidget.js"]')) {
      setGeoWidgetLoaded(true)
      return
    }

    // Dodaj CSS
    const cssLink = document.createElement('link')
    cssLink.rel = 'stylesheet'
    cssLink.href = 'https://geowidget.inpost.pl/inpost-geowidget.css'
    document.head.appendChild(cssLink)

    // Dodaj skrypt
    const script = document.createElement('script')
    script.src = 'https://geowidget.inpost.pl/inpost-geowidget.js'
    script.defer = true

    script.onload = () => {
      setGeoWidgetLoaded(true)
    }

    document.body.appendChild(script)
  }, [geoWidgetLoaded])

  // Obsługa eventu wyboru punktu z GeoWidget
  useEffect(() => {
    const handleInPostPointSelect = (event: CustomEvent) => {
      const point = event.detail
      if (point) {
        setShippingData(prev => ({
          ...prev,
          parcelLockerCode: point.name,
          parcelLockerAddress: point.address?.line1
            ? `${point.address.line1}${point.address.line2 ? ', ' + point.address.line2 : ''}`
            : point.address_details?.city || ''
        }))
        setShowGeoWidget(false)
        // Wyczyść błąd
        setErrors(prev => ({ ...prev, parcelLockerCode: '' }))
      }
    }

    // Nasłuchuj na event wyboru punktu
    document.addEventListener('onpointselect', handleInPostPointSelect as EventListener)

    return () => {
      document.removeEventListener('onpointselect', handleInPostPointSelect as EventListener)
    }
  }, [])

  const validateShippingForm = (): FormErrors => {
    const newErrors: FormErrors = {}

    if (!shippingData.firstName || shippingData.firstName.length < 2) {
      newErrors.firstName = 'Imię musi mieć minimum 2 znaki'
    }
    if (!shippingData.lastName || shippingData.lastName.length < 2) {
      newErrors.lastName = 'Nazwisko musi mieć minimum 2 znaki'
    }
    if (!shippingData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingData.email)) {
      newErrors.email = 'Podaj prawidłowy adres email'
    }
    if (!shippingData.phone || shippingData.phone.length < 9) {
      newErrors.phone = 'Podaj numer telefonu'
    }

    // Walidacja zależna od metody dostawy
    if (deliveryMethod === 'courier') {
      if (!shippingData.street || shippingData.street.length < 3) {
        newErrors.street = 'Podaj pełny adres'
      }
      if (!shippingData.city || shippingData.city.length < 2) {
        newErrors.city = 'Podaj miasto'
      }
      if (!shippingData.postalCode || !/^\d{2}-\d{3}$/.test(shippingData.postalCode)) {
        newErrors.postalCode = 'Format: XX-XXX'
      }
    } else {
      // Paczkomat
      if (!shippingData.parcelLockerCode || shippingData.parcelLockerCode.length < 3) {
        newErrors.parcelLockerCode = 'Podaj kod paczkomatu'
      }
    }

    if (isMixedCart && shipmentType === 'STANDARD') {
      newErrors.shipmentType = 'Wybierz opcję wysyłki'
    }

    return newErrors
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Format postal code
    if (name === 'postalCode') {
      let formatted = value.replace(/\D/g, '')
      if (formatted.length > 2) {
        formatted = formatted.slice(0, 2) + '-' + formatted.slice(2, 5)
      }
      setShippingData(prev => ({ ...prev, [name]: formatted }))
    } else {
      setShippingData(prev => ({ ...prev, [name]: value }))
    }

    // Deselect saved address when editing manually
    if (['firstName', 'lastName', 'street', 'city', 'postalCode'].includes(name)) {
      setSelectedAddressId(null)
    }

    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleContinueToPayment = async () => {
    const formErrors = validateShippingForm()
    setErrors(formErrors)

    if (Object.keys(formErrors).length === 0) {
      // Save address to account if requested
      if (saveAddressToAccount && user && !selectedAddressId && deliveryMethod === 'courier') {
        try {
          await addressApi.createAddress({
            type: 'SHIPPING',
            firstName: shippingData.firstName,
            lastName: shippingData.lastName,
            street: shippingData.street,
            city: shippingData.city,
            postalCode: shippingData.postalCode,
            country: shippingData.country,
            phone: shippingData.phone,
          })
        } catch (error) {
          console.error('Failed to save address:', error)
        }
      }
      setStep('payment')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // Auto-scroll to first error
      const firstErrorKey = Object.keys(formErrors)[0]
      const element = document.querySelector(`[name="${firstErrorKey}"]`) || document.getElementById(`field-${firstErrorKey}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        if (element instanceof HTMLInputElement) {
          element.focus()
        }
      }
    }
  }

  const handlePayment = async () => {
    setIsLoading(true)
    setStep('processing')

    try {
      // 1. Sync cart with backend first
      const sessionId = localStorage.getItem('sessionId') || crypto.randomUUID()
      localStorage.setItem('sessionId', sessionId)
      const token = getAccessToken()

      const authHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionId,
      }
      if (token) {
        authHeaders['Authorization'] = `Bearer ${token}`
      }

      // Synchronizuj cały koszyk za jednym razem
      const syncResponse = await fetch(`${API_URL}/cart/sync`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }),
      })

      if (!syncResponse.ok) {
        const errorData = await syncResponse.json()
        throw new Error(errorData.error || 'Błąd synchronizacji koszyka')
      }

      // 2. Create order
      const orderResponse = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          email: shippingData.email,
          shippingAddress: {
            firstName: shippingData.firstName,
            lastName: shippingData.lastName,
            street: deliveryMethod === 'courier' ? shippingData.street : `Paczkomat: ${shippingData.parcelLockerCode}`,
            city: deliveryMethod === 'courier' ? shippingData.city : shippingData.parcelLockerAddress?.split(',')[0] || '',
            postalCode: deliveryMethod === 'courier' ? shippingData.postalCode : '00-000',
            country: shippingData.country,
            phone: shippingData.phone,
          },
          deliveryMethod: deliveryMethod,
          parcelLockerCode: deliveryMethod === 'parcel-locker' ? shippingData.parcelLockerCode : undefined,
          // Dane do faktury
          wantInvoice: wantInvoice,
          billingAddress: wantInvoice ? {
            companyName: billingData.companyName || undefined,
            nip: billingData.nip || undefined,
            firstName: billingData.firstName || undefined,
            lastName: billingData.lastName || undefined,
            street: billingData.street || undefined,
            city: billingData.city || undefined,
            postalCode: billingData.postalCode || undefined,
            email: billingData.email || undefined,
          } : undefined,
          shipmentType: isMixedCart ? shipmentType : 'STANDARD',
        }),
      })

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json()
        throw new Error(errorData.error || 'Błąd tworzenia zamówienia')
      }

      const orderData = await orderResponse.json()

      // 3. Create PayU payment
      const payuResponse = await fetch(`${API_URL}/payu/create`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          orderId: orderData.order.id,
        }),
      })

      if (!payuResponse.ok) {
        const errorData = await payuResponse.json()
        throw new Error(errorData.error || 'Błąd połączenia z PayU')
      }

      const payuData = await payuResponse.json()

      // 4. Redirect to PayU
      if (payuData.redirectUrl) {
        window.location.href = payuData.redirectUrl
      } else {
        throw new Error('Brak URL do płatności')
      }

    } catch (error) {
      console.error('Payment error:', error)
      setIsLoading(false)
      setStep('payment')
      setErrors({
        payment: error instanceof Error ? error.message : 'Wystąpił błąd podczas płatności. Spróbuj ponownie.'
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease }}
      className="min-h-screen pt-48 pb-32"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back button */}
        <motion.button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-white/60 hover:text-brand-gold transition-colors duration-300 mb-8 group cursor-pointer"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-[family-name:var(--font-body)] text-xs uppercase tracking-widest">Wróć do koszyka</span>
        </motion.button>

        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <h1 className="font-[family-name:var(--font-heading)] font-bold text-3xl md:text-4xl text-white uppercase tracking-tight mb-2">
            Checkout
          </h1>
        </motion.div>

        {/* Progress steps */}
        <motion.div
          className="flex items-center justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
        >
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-brand-gold' : 'text-white/60'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'shipping' ? 'bg-brand-gold text-black' : step === 'payment' || step === 'processing' ? 'bg-green-500 text-white' : 'bg-white/10 text-white/60'}`}>
                {step !== 'shipping' ? <CheckCircle className="w-4 h-4" /> : '1'}
              </div>
              <span className="text-sm font-[family-name:var(--font-body)] uppercase tracking-wider hidden md:block">Dostawa</span>
            </div>

            <div className={`w-16 h-px ${step !== 'shipping' ? 'bg-brand-gold' : 'bg-white/20'}`} />

            <div className={`flex items-center gap-2 ${step === 'payment' || step === 'processing' ? 'text-brand-gold' : 'text-white/40'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-brand-gold text-black' : step === 'processing' ? 'bg-green-500 text-white' : 'bg-white/10 text-white/40'}`}>
                {step === 'processing' ? <CheckCircle className="w-4 h-4" /> : '2'}
              </div>
              <span className="text-sm font-[family-name:var(--font-body)] uppercase tracking-wider hidden md:block">Płatność</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            {step === 'shipping' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease }}
                className="space-y-6"
              >
                {/* Wybór metody dostawy */}
                <div className="bg-[#0c0c0c] rounded-none p-6 md:p-8">
                  <h2 className="font-[family-name:var(--font-heading)] font-bold text-lg text-white uppercase tracking-wide mb-6 flex items-center gap-3">
                    <Truck className="w-5 h-5 text-brand-gold" />
                    Metoda dostawy
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Kurier */}
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('courier')}
                      className={`p-4  border-2 transition-all duration-300 text-left ${deliveryMethod === 'courier'
                        ? 'border-brand-gold bg-brand-gold/10'
                        : 'border-white/10 hover:border-white/30'
                        }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Truck className={`w-6 h-6 ${deliveryMethod === 'courier' ? 'text-brand-gold' : 'text-white/60'}`} />
                        <span className="font-[family-name:var(--font-heading)] font-bold text-white">Kurier</span>
                      </div>
                      <p className="text-white/60 text-sm font-[family-name:var(--font-body)]">
                        Dostawa pod wskazany adres
                      </p>
                      <p className="text-brand-gold font-bold mt-2">
                        {subtotal > 300 ? 'GRATIS' : '19,90 PLN'}
                      </p>
                    </button>

                    {/* Paczkomat */}
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('parcel-locker')}
                      className={`p-4 border-2 transition-all duration-300 text-left ${deliveryMethod === 'parcel-locker'
                        ? 'border-brand-gold bg-brand-gold/10'
                        : 'border-white/10 hover:border-white/30'
                        }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Package className={`w-6 h-6 ${deliveryMethod === 'parcel-locker' ? 'text-brand-gold' : 'text-white/60'}`} />
                        <span className="font-[family-name:var(--font-heading)] font-bold text-white">Paczkomat InPost</span>
                      </div>
                      <p className="text-white/60 text-sm font-[family-name:var(--font-body)]">
                        Odbiór w paczkomacie 24/7
                      </p>
                      <p className="text-brand-gold font-bold mt-2">
                        {subtotal > 300 ? 'GRATIS' : '19,90 PLN'}
                      </p>
                    </button>
                  </div>
                </div>

                {/* Opcja dzielenia przesyłki - tylko dla mieszanego koszyka */}
                {isMixedCart && (
                  <div id="field-shipmentType" className="bg-[#0c0c0c] p-6 md:p-8">
                    <h2 className="font-[family-name:var(--font-heading)] font-bold text-lg text-white uppercase tracking-wide mb-2 flex items-center gap-3">
                      <PackageCheck className="w-5 h-5 text-brand-gold" />
                      Opcja wysyłki
                    </h2>
                    <p className="text-white/50 text-sm font-[family-name:var(--font-body)] mb-6">
                      Twoje zamówienie zawiera zarówno odzież (szytą na zamówienie) jak i akcesoria. Wybierz sposób wysyłki:
                    </p>

                    <div className="space-y-3">
                      {/* SPLIT */}
                      <button
                        type="button"
                        onClick={() => setShipmentType('SPLIT')}
                        className={`w-full p-4 border-2 transition-all duration-300 text-left  ${shipmentType === 'SPLIT'
                          ? 'border-brand-gold bg-brand-gold/10'
                          : 'border-white/10 hover:border-white/30'
                          }`}
                      >
                        <div className="flex items-center gap-3 mb-1">
                          <Scissors className={`w-5 h-5 ${shipmentType === 'SPLIT' ? 'text-brand-gold' : 'text-white/60'
                            }`} />
                          <span className="font-[family-name:var(--font-heading)] font-bold text-white">Podziel przesyłkę</span>
                          <span className="ml-auto text-xs text-brand-gold font-[family-name:var(--font-body)] uppercase tracking-wider">Szybciej akcesoria</span>
                        </div>
                        <p className="text-white/50 text-sm font-[family-name:var(--font-body)] ml-8">
                          Akcesoria zostaną wysłane natychmiast, a odzież po uszyciu. Otrzymasz dwa osobne paragony.
                        </p>
                      </button>

                      {/* COMBINED */}
                      <button
                        type="button"
                        onClick={() => setShipmentType('COMBINED')}
                        className={`w-full p-4 border-2 transition-all duration-300 text-left  ${shipmentType === 'COMBINED'
                          ? 'border-brand-gold bg-brand-gold/10'
                          : 'border-white/10 hover:border-white/30'
                          }`}
                      >
                        <div className="flex items-center gap-3 mb-1">
                          <Package className={`w-5 h-5 ${shipmentType === 'COMBINED' ? 'text-brand-gold' : 'text-white/60'
                            }`} />
                          <span className="font-[family-name:var(--font-heading)] font-bold text-white">Wysyłka razem</span>
                          <span className="ml-auto text-xs text-white/40 font-[family-name:var(--font-body)] uppercase tracking-wider">Jedna paczka</span>
                        </div>
                        <p className="text-white/50 text-sm font-[family-name:var(--font-body)] ml-8">
                          Poczekaj na uszycie odzieży — cały order w jednej paczce z jednym paragonem.
                        </p>
                      </button>
                    </div>
                    {errors.shipmentType && (
                      <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-3 rounded-none mt-4 text-sm font-bold text-center">
                        {errors.shipmentType}
                      </div>
                    )}
                  </div>
                )}

                {/* Dane kontaktowe */}
                <div className="bg-[#0c0c0c] rounded-none p-6 md:p-8">
                  <h2 className="font-[family-name:var(--font-heading)] font-bold text-lg text-white uppercase tracking-wide mb-6 flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-brand-gold" />
                    {deliveryMethod === 'courier' ? 'Adres dostawy' : 'Dane odbiorcy'}
                  </h2>

                  {/* Saved address selector for logged in users */}
                  {user && savedAddresses.length > 0 && deliveryMethod === 'courier' && (
                    <div className="mb-6">
                      <label className="block text-xs text-white/60 font-[family-name:var(--font-body)] uppercase tracking-wider mb-2">
                        Wybierz zapisany adres
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowAddressSelector(!showAddressSelector)}
                          className="w-full p-4 border-2 border-white/20 hover:border-white/40 bg-white/5 text-left transition-all flex items-center justify-between"
                        >
                          {selectedAddressId ? (
                            <div className="flex-1">
                              {(() => {
                                const addr = savedAddresses.find(a => a.id === selectedAddressId)
                                if (!addr) return <span className="text-white/60">Wybierz adres...</span>
                                return (
                                  <div>
                                    <div className="flex items-center gap-2">
                                      {addr.label && <span className="text-brand-gold font-medium">{addr.label}</span>}
                                      {addr.isDefault && <Star className="w-3 h-3 text-brand-gold" />}
                                    </div>
                                    <p className="text-white text-sm">
                                      {addr.firstName} {addr.lastName}, {addr.street}, {addr.postalCode} {addr.city}
                                    </p>
                                  </div>
                                )
                              })()}
                            </div>
                          ) : (
                            <span className="text-white/60">Wybierz zapisany adres lub wpisz nowy...</span>
                          )}
                          <ChevronDown className={`w-5 h-5 text-white/60 transition-transform ${showAddressSelector ? 'rotate-180' : ''}`} />
                        </button>

                        {showAddressSelector && (
                          <div className="absolute z-10 w-full mt-1 bg-[#1a1a1a] border border-white/20 max-h-60 overflow-y-auto">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedAddressId(null)
                                setShippingData(prev => ({
                                  ...prev,
                                  firstName: user?.firstName || '',
                                  lastName: user?.lastName || '',
                                  street: '',
                                  city: '',
                                  postalCode: '',
                                }))
                                setShowAddressSelector(false)
                              }}
                              className="w-full p-3 text-left hover:bg-white/10 text-white/60 border-b border-white/10"
                            >
                              + Wpisz nowy adres
                            </button>
                            {savedAddresses.map(addr => (
                              <button
                                key={addr.id}
                                type="button"
                                onClick={() => selectAddress(addr)}
                                className={`w-full p-3 text-left hover:bg-white/10 border-b border-white/5 ${selectedAddressId === addr.id ? 'bg-brand-gold/10' : ''
                                  }`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  {addr.label && <span className="text-brand-gold text-sm font-medium">{addr.label}</span>}
                                  {addr.isDefault && (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-brand-gold/20 text-brand-gold text-xs rounded">
                                      <Star className="w-2.5 h-2.5" />
                                      Domyślny
                                    </span>
                                  )}
                                </div>
                                <p className="text-white text-sm">{addr.firstName} {addr.lastName}</p>
                                <p className="text-white/60 text-xs">{addr.street}, {addr.postalCode} {addr.city}</p>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/60 font-[family-name:var(--font-body)] uppercase tracking-wider mb-2">
                        Imię *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={shippingData.firstName}
                        onChange={handleInputChange}
                        className={`checkout-input ${errors.firstName ? 'border-red-500' : ''}`}
                        placeholder="Jan"
                      />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs text-white/60 font-[family-name:var(--font-body)] uppercase tracking-wider mb-2">
                        Nazwisko *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={shippingData.lastName}
                        onChange={handleInputChange}
                        className={`checkout-input ${errors.lastName ? 'border-red-500' : ''}`}
                        placeholder="Kowalski"
                      />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs text-white/60 font-[family-name:var(--font-body)] uppercase tracking-wider mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={shippingData.email}
                        onChange={handleInputChange}
                        className={`checkout-input ${errors.email ? 'border-red-500' : ''}`}
                        placeholder="jan@example.com"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs text-white/60 font-[family-name:var(--font-body)] uppercase tracking-wider mb-2">
                        Telefon *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingData.phone}
                        onChange={handleInputChange}
                        className={`checkout-input ${errors.phone ? 'border-red-500' : ''}`}
                        placeholder="+48 123 456 789"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    {/* Pola dla kuriera */}
                    {deliveryMethod === 'courier' && (
                      <>
                        <div className="md:col-span-2">
                          <label className="block text-xs text-white/60 font-[family-name:var(--font-body)] uppercase tracking-wider mb-2">
                            Adres *
                          </label>
                          <input
                            type="text"
                            name="street"
                            value={shippingData.street}
                            onChange={handleInputChange}
                            className={`checkout-input ${errors.street ? 'border-red-500' : ''}`}
                            placeholder="ul. Przykładowa 10/5"
                          />
                          {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
                        </div>

                        <div>
                          <label className="block text-xs text-white/60 font-[family-name:var(--font-body)] uppercase tracking-wider mb-2">
                            Miasto *
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={shippingData.city}
                            onChange={handleInputChange}
                            className={`checkout-input ${errors.city ? 'border-red-500' : ''}`}
                            placeholder="Warszawa"
                          />
                          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                        </div>

                        <div>
                          <label className="block text-xs text-white/60 font-[family-name:var(--font-body)] uppercase tracking-wider mb-2">
                            Kod pocztowy *
                          </label>
                          <input
                            type="text"
                            name="postalCode"
                            value={shippingData.postalCode}
                            onChange={handleInputChange}
                            className={`checkout-input ${errors.postalCode ? 'border-red-500' : ''}`}
                            placeholder="00-000"
                            maxLength={6}
                          />
                          {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
                        </div>
                      </>
                    )}

                    {/* Pola dla paczkomatu */}
                    {deliveryMethod === 'parcel-locker' && (
                      <div id="field-parcelLockerCode" className="md:col-span-2">
                        <label className="block text-xs text-white/60 font-[family-name:var(--font-body)] uppercase tracking-wider mb-2">
                          Paczkomat InPost *
                        </label>

                        {/* Wybrany paczkomat lub przycisk wyboru */}
                        {shippingData.parcelLockerCode ? (
                          <div className="p-4 border-2 border-brand-gold bg-brand-gold/10">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="text-white font-[family-name:var(--font-heading)] font-bold text-lg">
                                  {shippingData.parcelLockerCode}
                                </p>
                                {shippingData.parcelLockerAddress && (
                                  <p className="text-white/60 text-sm font-[family-name:var(--font-body)] mt-1">
                                    {shippingData.parcelLockerAddress}
                                  </p>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => setShowGeoWidget(true)}
                                className="text-brand-gold text-sm hover:underline whitespace-nowrap"
                              >
                                Zmień
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setShowGeoWidget(true)}
                            className="w-full p-4 border-2 border-dashed border-white/20 hover:border-brand-gold/50 transition-colors flex items-center justify-center gap-3 text-white/60 hover:text-white"
                          >
                            <Search className="w-5 h-5" />
                            <span className="font-[family-name:var(--font-body)]">Wybierz paczkomat na mapie</span>
                          </button>
                        )}
                        {errors.parcelLockerCode && <p className="text-red-500 text-xs mt-2">{errors.parcelLockerCode}</p>}
                      </div>
                    )}
                  </div>

                  {/* Checkbox - zapisz adres */}
                  {user && !selectedAddressId && deliveryMethod === 'courier' && (
                    <label className="flex items-center gap-3 mt-4 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={saveAddressToAccount}
                        onChange={(e) => setSaveAddressToAccount(e.target.checked)}
                        className="w-5 h-5 rounded-none border-white/20 bg-white/10 text-brand-gold focus:ring-brand-gold/50"
                      />
                      <span className="text-white/70 text-sm flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Zapisz adres na moim koncie
                      </span>
                    </label>
                  )}
                </div>

                {/* Faktura VAT */}
                <div className="bg-[#0c0c0c] rounded-none p-6 md:p-8">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wantInvoice}
                      onChange={(e) => setWantInvoice(e.target.checked)}
                      className="w-5 h-5 rounded-none border-white/20 bg-white/10 text-brand-gold focus:ring-brand-gold/50"
                    />
                    <span className="font-[family-name:var(--font-heading)] font-bold text-lg text-white uppercase tracking-wide flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-brand-gold" />
                      Chcę otrzymać fakturę VAT
                    </span>
                  </label>

                  {wantInvoice && (
                    <div className="mt-6 space-y-4">
                      {/* Saved billing address selector */}
                      {user && savedBillingAddresses.length > 0 && (
                        <div>
                          <label className="block text-xs text-white/60 font-[family-name:var(--font-body)] uppercase tracking-wider mb-2">
                            Wybierz zapisane dane do faktury
                          </label>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setShowBillingAddressSelector(!showBillingAddressSelector)}
                              className="w-full p-4 border-2 border-white/20 hover:border-white/40 bg-white/5 text-left transition-all flex items-center justify-between"
                            >
                              {selectedBillingAddressId ? (
                                <div className="flex-1">
                                  {(() => {
                                    const addr = savedBillingAddresses.find(a => a.id === selectedBillingAddressId)
                                    if (!addr) return <span className="text-white/60">Wybierz...</span>
                                    return (
                                      <div>
                                        <div className="flex items-center gap-2">
                                          {addr.label && <span className="text-brand-gold font-medium">{addr.label}</span>}
                                          {addr.companyName && <span className="text-white">{addr.companyName}</span>}
                                        </div>
                                        {addr.nip && <p className="text-white/60 text-sm">NIP: {addr.nip}</p>}
                                      </div>
                                    )
                                  })()}
                                </div>
                              ) : (
                                <span className="text-white/60">Wybierz zapisane dane lub wpisz nowe...</span>
                              )}
                              <ChevronDown className={`w-5 h-5 text-white/60 transition-transform ${showBillingAddressSelector ? 'rotate-180' : ''}`} />
                            </button>

                            {showBillingAddressSelector && (
                              <div className="absolute z-10 w-full mt-1 bg-[#1a1a1a] border border-white/20 max-h-60 overflow-y-auto">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedBillingAddressId(null)
                                    setBillingData({
                                      companyName: '',
                                      nip: '',
                                      firstName: user?.firstName || '',
                                      lastName: user?.lastName || '',
                                      street: '',
                                      city: '',
                                      postalCode: '',
                                      email: user?.email || '',
                                    })
                                    setShowBillingAddressSelector(false)
                                  }}
                                  className="w-full p-3 text-left hover:bg-white/10 text-white/60 border-b border-white/10"
                                >
                                  + Wpisz nowe dane
                                </button>
                                {savedBillingAddresses.map(addr => (
                                  <button
                                    key={addr.id}
                                    type="button"
                                    onClick={() => selectBillingAddress(addr)}
                                    className={`w-full p-3 text-left hover:bg-white/10 border-b border-white/5 ${selectedBillingAddressId === addr.id ? 'bg-brand-gold/10' : ''
                                      }`}
                                  >
                                    <div className="flex items-center gap-2 mb-1">
                                      {addr.label && <span className="text-brand-gold text-sm font-medium">{addr.label}</span>}
                                      {addr.isDefault && (
                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-brand-gold/20 text-brand-gold text-xs rounded">
                                          <Star className="w-2.5 h-2.5" />
                                          Domyślny
                                        </span>
                                      )}
                                    </div>
                                    {addr.companyName && <p className="text-white text-sm">{addr.companyName}</p>}
                                    {addr.nip && <p className="text-white/60 text-xs">NIP: {addr.nip}</p>}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Billing form */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs text-white/60 font-[family-name:var(--font-body)] uppercase tracking-wider mb-2">
                            Nazwa firmy
                          </label>
                          <input
                            type="text"
                            name="companyName"
                            value={billingData.companyName}
                            onChange={handleBillingInputChange}
                            className="checkout-input"
                            placeholder="Nazwa firmy Sp. z o.o."
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-white/60 font-[family-name:var(--font-body)] uppercase tracking-wider mb-2">
                            NIP *
                          </label>
                          <input
                            type="text"
                            name="nip"
                            value={billingData.nip}
                            onChange={handleBillingInputChange}
                            className="checkout-input"
                            placeholder="1234567890"
                            maxLength={10}
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-white/60 font-[family-name:var(--font-body)] uppercase tracking-wider mb-2">
                            Email do faktury
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={billingData.email}
                            onChange={handleBillingInputChange}
                            className="checkout-input"
                            placeholder="faktury@firma.pl"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-white/60 font-[family-name:var(--font-body)] uppercase tracking-wider mb-2">
                            Imię
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={billingData.firstName}
                            onChange={handleBillingInputChange}
                            className="checkout-input"
                            placeholder="Jan"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-white/60 font-[family-name:var(--font-body)] uppercase tracking-wider mb-2">
                            Nazwisko
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={billingData.lastName}
                            onChange={handleBillingInputChange}
                            className="checkout-input"
                            placeholder="Kowalski"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs text-white/60 font-[family-name:var(--font-body)] uppercase tracking-wider mb-2">
                            Ulica i numer
                          </label>
                          <input
                            type="text"
                            name="street"
                            value={billingData.street}
                            onChange={handleBillingInputChange}
                            className="checkout-input"
                            placeholder="ul. Biznesowa 10"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-white/60 font-[family-name:var(--font-body)] uppercase tracking-wider mb-2">
                            Miasto
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={billingData.city}
                            onChange={handleBillingInputChange}
                            className="checkout-input"
                            placeholder="Warszawa"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-white/60 font-[family-name:var(--font-body)] uppercase tracking-wider mb-2">
                            Kod pocztowy
                          </label>
                          <input
                            type="text"
                            name="postalCode"
                            value={billingData.postalCode}
                            onChange={handleBillingInputChange}
                            className="checkout-input"
                            placeholder="00-000"
                            maxLength={6}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>



                <button
                  onClick={handleContinueToPayment}
                  className="btn-primary btn-full mt-8"
                >
                  Kontynuuj do płatności
                </button>

                {/* Modal z InPost GeoWidget */}
                {showGeoWidget && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="relative w-full max-w-5xl h-[85vh] bg-white overflow-hidden rounded-none"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#FFCD00]">
                        <h3 className="font-[family-name:var(--font-heading)] font-bold text-lg text-black uppercase">
                          Wybierz paczkomat InPost
                        </h3>
                        <button
                          onClick={() => setShowGeoWidget(false)}
                          className="text-black/60 hover:text-black transition-colors text-2xl leading-none font-bold"
                        >
                          ×
                        </button>
                      </div>

                      {/* GeoWidget Container - używamy ref do dynamicznego tworzenia custom element */}
                      <div
                        className="w-full h-[calc(100%-60px)]"
                        ref={(container) => {
                          if (container && geoWidgetLoaded) {
                            // Sprawdź czy widget już istnieje
                            if (!container.querySelector('inpost-geowidget')) {
                              const widget = document.createElement('inpost-geowidget');
                              widget.setAttribute('onpoint', 'onpointselect');
                              widget.setAttribute('token', INPOST_GEOWIDGET_TOKEN);
                              widget.setAttribute('language', 'pl');
                              widget.setAttribute('config', 'parcelCollect');
                              widget.style.width = '100%';
                              widget.style.height = '100%';
                              widget.style.display = 'block';
                              container.appendChild(widget);
                            }
                          }
                        }}
                      >
                        {!geoWidgetLoaded && (
                          <div className="flex items-center justify-center h-full bg-gray-100">
                            <div className="text-center">
                              <Loader2 className="w-8 h-8 text-[#FFCD00] animate-spin mx-auto mb-4" />
                              <p className="text-gray-600 font-[family-name:var(--font-body)]">
                                Ładowanie mapy InPost...
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease }}
                className="bg-[#0c0c0c] rounded-none p-6 md:p-8"
              >
                <h2 className="font-[family-name:var(--font-heading)] font-bold text-lg text-white uppercase tracking-wide mb-6 flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-brand-gold" />
                  Metoda płatności
                </h2>

                {errors.payment && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-none mb-6 text-sm">
                    {errors.payment}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 border border-brand-gold bg-brand-gold/10 rounded-none">
                    <input type="radio" name="payment" checked readOnly className="accent-brand-gold" />
                    <div className="flex-1">
                      <p className="text-white font-[family-name:var(--font-heading)] font-bold">PayU</p>
                      <p className="text-white/60 text-sm font-[family-name:var(--font-body)]">
                        Karta płatnicza, BLIK, przelew
                      </p>
                    </div>
                    <div className="bg-white rounded px-3 py-1.5 flex items-center">
                      <PayULogo size="sm" className="text-[#1a1a1a]" />
                    </div>
                  </div>
                </div>

                {/* Shipping summary */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h3 className="text-sm text-white/60 font-[family-name:var(--font-body)] uppercase tracking-wider mb-3">
                    {deliveryMethod === 'courier' ? 'Adres dostawy (Kurier)' : 'Odbiór w paczkomacie'}
                  </h3>
                  <div className="text-white text-sm font-[family-name:var(--font-body)]">
                    <p className="font-bold">{shippingData.firstName} {shippingData.lastName}</p>
                    {deliveryMethod === 'courier' ? (
                      <>
                        <p>{shippingData.street}</p>
                        <p>{shippingData.postalCode} {shippingData.city}</p>
                      </>
                    ) : (
                      <p className="text-brand-gold">Paczkomat: {shippingData.parcelLockerCode}</p>
                    )}
                    <p>{shippingData.phone}</p>
                    <p className="text-white/60">{shippingData.email}</p>
                  </div>
                  <button
                    onClick={() => setStep('shipping')}
                    className="text-brand-gold text-sm mt-2 hover:underline"
                  >
                    Zmień dane
                  </button>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setStep('shipping')}
                    className="btn-secondary flex-1"
                  >
                    Wróć
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={isLoading}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Przetwarzanie...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Zapłać {total.toFixed(2)} PLN
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease }}
                className="bg-[#0c0c0c] rounded-none p-12 flex flex-col items-center justify-center text-center"
              >
                <Loader2 className="w-16 h-16 text-brand-gold animate-spin mb-6" />
                <h2 className="font-[family-name:var(--font-heading)] font-bold text-xl text-white uppercase tracking-wide mb-2">
                  Przekierowanie do PayU
                </h2>
                <p className="text-white/60 font-[family-name:var(--font-body)]">
                  Za chwilę zostaniesz przekierowany do bezpiecznej strony płatności...
                </p>
              </motion.div>
            )}
          </div>

          {/* Order summary */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.2 }}
          >
            <div className="sticky top-24 p-6 md:p-8 bg-[#0c0c0c] rounded-none">
              <h2 className="font-[family-name:var(--font-heading)] font-bold text-lg text-white uppercase tracking-wide mb-6">
                Twoje zamówienie
              </h2>

              {/* Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id + (item.selectedSize || '')} className="flex gap-3">
                    <div className="w-16 h-16 bg-[#0a0a0a] flex-shrink-0 overflow-hidden rounded-none p-1">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-none" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-[family-name:var(--font-heading)] truncate">{item.name}</p>
                      <p className="text-white/40 text-xs font-[family-name:var(--font-body)]">
                        {item.quantity} × {item.price.toFixed(2)} PLN
                        {item.selectedSize && <span> • {item.selectedSize}</span>}
                      </p>
                    </div>
                    <p className="text-sm font-[family-name:var(--font-heading)] font-bold flex items-baseline gap-0.5">
                      <span className="text-brand-gold">{(item.price * item.quantity).toFixed(2)}</span>
                      <span className="text-brand-gold/80 text-xs">PLN</span>
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-3">
                <div className="flex justify-between text-white/60 font-[family-name:var(--font-body)] text-sm">
                  <span>Produkty ({itemCount})</span>
                  <span>{subtotal.toFixed(2)} PLN</span>
                </div>
                <div className="flex justify-between text-white/60 font-[family-name:var(--font-body)] text-sm">
                  <span>{deliveryMethod === 'courier' ? 'Kurier' : 'Paczkomat InPost'}</span>
                  <span className={shipping === 0 ? 'text-green-500' : ''}>
                    {shipping === 0 ? 'GRATIS' : `${shipping.toFixed(2)} PLN`}
                  </span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 mt-4">
                <div className="flex justify-between items-baseline">
                  <span className="font-[family-name:var(--font-heading)] font-bold text-white uppercase">Razem</span>
                  <span className="font-[family-name:var(--font-heading)] font-bold text-2xl flex items-baseline gap-1">
                    <span className="text-brand-gold">{total.toFixed(2)}</span>
                    <span className="text-brand-gold/80 text-base">PLN</span>
                  </span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/10">
                <div className="text-center">
                  <Shield className="w-5 h-5 text-brand-gold mx-auto mb-2" />
                  <span className="text-[10px] text-white/40 font-[family-name:var(--font-body)] uppercase tracking-wider block">
                    Bezpieczna płatność
                  </span>
                </div>
                <div className="text-center">
                  <Lock className="w-5 h-5 text-brand-gold mx-auto mb-2" />
                  <span className="text-[10px] text-white/40 font-[family-name:var(--font-body)] uppercase tracking-wider block">
                    Szyfrowane SSL
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div >
  )
}
