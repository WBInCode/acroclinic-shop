import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  Package,
  User as UserIcon,
  Settings,
  LogOut,
  Mail,
  Phone,
  ChevronRight,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Loader2,
  Save,
  MessageSquare,
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Star,
  Building2,
  Bell,
  BellOff
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { authApi, addressApi, newsletterApi, type User, type Address, type AddressType, type CreateAddressData } from '@/lib/api'

const ease = [0.22, 1, 0.36, 1] as const

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Dane kontaktowe
const SUPPORT_EMAIL = 'support@wb-partners.pl'
const SUPPORT_PHONE = '570 034 367'

interface UserPanelProps {
  user: User
  onBack: () => void
  onLogout: () => Promise<void>
  onUserUpdate?: (user: User) => void
}

interface Order {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  total: number
  createdAt: string
  items: {
    id: string
    name: string
    price: number
    quantity: number
    image?: string
  }[]
}

type TabType = 'overview' | 'orders' | 'addresses' | 'settings' | 'contact'

const statusLabels: Record<string, { label: string; color: string; icon: any }> = {
  PENDING: { label: 'Oczekuje', color: 'text-yellow-400', icon: Clock },
  CONFIRMED: { label: 'Potwierdzone', color: 'text-blue-400', icon: CheckCircle },
  PROCESSING: { label: 'W realizacji', color: 'text-blue-400', icon: Package },
  SHIPPED: { label: 'Wysłane', color: 'text-purple-400', icon: Truck },
  DELIVERED: { label: 'Dostarczone', color: 'text-green-400', icon: CheckCircle },
  CANCELLED: { label: 'Anulowane', color: 'text-red-400', icon: XCircle },
  REFUNDED: { label: 'Zwrócone', color: 'text-gray-400', icon: XCircle },
}

export function UserPanel({ user, onBack, onLogout, onUserUpdate }: UserPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Settings form
  const [firstName, setFirstName] = useState(user.firstName || '')
  const [lastName, setLastName] = useState(user.lastName || '')
  const [phone, setPhone] = useState(user.phone || '')
  const [isSaving, setIsSaving] = useState(false)

  // Newsletter
  const [isNewsletterSubscribed, setIsNewsletterSubscribed] = useState(false)
  const [isLoadingNewsletter, setIsLoadingNewsletter] = useState(false)
  const [isTogglingNewsletter, setIsTogglingNewsletter] = useState(false)

  // Contact form
  const [contactOrderNumber, setContactOrderNumber] = useState('')
  const [contactMessage, setContactMessage] = useState('')

  // Addresses state
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [addressFormData, setAddressFormData] = useState<CreateAddressData>({
    type: 'SHIPPING',
    label: '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    companyName: '',
    nip: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'Polska',
    phone: user.phone || '',
    email: user.email || '',
    isDefault: false,
  })
  const [isSavingAddress, setIsSavingAddress] = useState(false)
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders()
    }
    if (activeTab === 'addresses') {
      fetchAddresses()
    }
    if (activeTab === 'settings') {
      fetchNewsletterStatus()
    }
  }, [activeTab])

  const fetchNewsletterStatus = async () => {
    setIsLoadingNewsletter(true)
    try {
      const data = await newsletterApi.getStatus(user.email)
      setIsNewsletterSubscribed(data.subscribed)
    } catch (error) {
      console.error('Error checking newsletter status:', error)
    } finally {
      setIsLoadingNewsletter(false)
    }
  }

  const handleToggleNewsletter = async () => {
    setIsTogglingNewsletter(true)
    try {
      if (isNewsletterSubscribed) {
        await newsletterApi.unsubscribe(user.email)
        setIsNewsletterSubscribed(false)
        toast.success('Wypisano z newslettera')
      } else {
        await newsletterApi.subscribe(user.email)
        toast.success('Sprawdź swoją skrzynkę email, aby potwierdzić subskrypcję.')
      }
    } catch (error: any) {
      toast.error(error.message || 'Wystąpił błąd')
    } finally {
      setIsTogglingNewsletter(false)
    }
  }

  const fetchAddresses = async () => {
    setIsLoadingAddresses(true)
    try {
      const data = await addressApi.getAddresses()
      setAddresses(data.addresses || [])
    } catch (error) {
      console.error('Error fetching addresses:', error)
      toast.error('Nie udało się pobrać adresów')
    } finally {
      setIsLoadingAddresses(false)
    }
  }

  const fetchOrders = async () => {
    setIsLoadingOrders(true)
    try {
      const response = await fetch(`${API_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setIsLoadingOrders(false)
    }
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      const result = await authApi.updateProfile({ firstName, lastName, phone })
      if (onUserUpdate && result.user) {
        onUserUpdate(result.user)
      }
      toast.success('Dane zostały zapisane')
    } catch (error) {
      toast.error('Nie udało się zapisać danych')
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await onLogout()
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleContactSubmit = () => {
    const subject = contactOrderNumber
      ? `Zapytanie dot. zamówienia ${contactOrderNumber}`
      : 'Zapytanie ze sklepu Acro Clinic'
    const body = encodeURIComponent(contactMessage)
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${body}`
    toast.success('Otwarto klienta poczty')
  }

  // Address form handlers
  const resetAddressForm = () => {
    setAddressFormData({
      type: 'SHIPPING',
      label: '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      companyName: '',
      nip: '',
      street: '',
      city: '',
      postalCode: '',
      country: 'Polska',
      phone: user.phone || '',
      email: user.email || '',
      isDefault: false,
    })
    setAddressErrors({})
    setEditingAddress(null)
  }

  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (name === 'postalCode') {
      let formatted = value.replace(/\D/g, '')
      if (formatted.length > 2) {
        formatted = formatted.slice(0, 2) + '-' + formatted.slice(2, 5)
      }
      setAddressFormData(prev => ({ ...prev, [name]: formatted }))
    } else if (type === 'checkbox') {
      setAddressFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setAddressFormData(prev => ({ ...prev, [name]: value }))
    }

    if (addressErrors[name]) {
      setAddressErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateAddressForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!addressFormData.firstName || addressFormData.firstName.length < 2) {
      errors.firstName = 'Imię musi mieć minimum 2 znaki'
    }
    if (!addressFormData.lastName || addressFormData.lastName.length < 2) {
      errors.lastName = 'Nazwisko musi mieć minimum 2 znaki'
    }
    if (!addressFormData.street || addressFormData.street.length < 3) {
      errors.street = 'Adres musi mieć minimum 3 znaki'
    }
    if (!addressFormData.city || addressFormData.city.length < 2) {
      errors.city = 'Miasto musi mieć minimum 2 znaki'
    }
    if (!addressFormData.postalCode || !/^\d{2}-\d{3}$/.test(addressFormData.postalCode)) {
      errors.postalCode = 'Format: XX-XXX'
    }
    if (addressFormData.nip && !/^\d{10}$/.test(addressFormData.nip)) {
      errors.nip = 'NIP musi mieć 10 cyfr'
    }
    if (addressFormData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addressFormData.email)) {
      errors.email = 'Nieprawidłowy email'
    }

    setAddressErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSaveAddress = async () => {
    if (!validateAddressForm()) return

    setIsSavingAddress(true)
    try {
      if (editingAddress) {
        await addressApi.updateAddress(editingAddress.id, addressFormData)
        toast.success('Adres został zaktualizowany')
      } else {
        await addressApi.createAddress(addressFormData)
        toast.success('Adres został dodany')
      }
      await fetchAddresses()
      setShowAddressForm(false)
      resetAddressForm()
    } catch (error) {
      toast.error(editingAddress ? 'Nie udało się zaktualizować adresu' : 'Nie udało się dodać adresu')
    } finally {
      setIsSavingAddress(false)
    }
  }

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address)
    setAddressFormData({
      type: address.type,
      label: address.label || '',
      firstName: address.firstName,
      lastName: address.lastName,
      companyName: address.companyName || '',
      nip: address.nip || '',
      street: address.street,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone || '',
      email: address.email || '',
      isDefault: address.isDefault,
    })
    setShowAddressForm(true)
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Czy na pewno chcesz usunąć ten adres?')) return

    try {
      await addressApi.deleteAddress(addressId)
      toast.success('Adres został usunięty')
      await fetchAddresses()
    } catch (error) {
      toast.error('Nie udało się usunąć adresu')
    }
  }

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      await addressApi.setDefaultAddress(addressId)
      toast.success('Adres ustawiony jako domyślny')
      await fetchAddresses()
    } catch (error) {
      toast.error('Nie udało się ustawić adresu jako domyślnego')
    }
  }

  const menuItems = [
    { id: 'overview' as TabType, icon: UserIcon, label: 'Przegląd konta' },
    { id: 'orders' as TabType, icon: Package, label: 'Moje zamówienia' },
    { id: 'addresses' as TabType, icon: MapPin, label: 'Moje adresy' },
    { id: 'settings' as TabType, icon: Settings, label: 'Ustawienia' },
    { id: 'contact' as TabType, icon: MessageSquare, label: 'Kontakt z obsługą' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease }}
      className="min-h-screen pt-40 pb-32"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="mb-8"
        >
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-white/60 hover:text-brand-gold transition-colors duration-300 mb-6 group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm uppercase tracking-wider">Powrót do sklepu</span>
          </button>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Moje konto
          </h1>
          <p className="text-white/60">
            Witaj, <span className="text-white">{user.firstName || user.email}</span>
          </p>
        </motion.div>

        <div className="grid md:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="space-y-2"
          >
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive
                      ? 'bg-brand-gold/20 text-brand-gold border border-brand-gold/30'
                      : 'text-white/70 hover:bg-white/5 hover:text-white border border-transparent'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${isActive ? 'rotate-90' : ''}`} />
                </button>
              )
            })}

            <div className="pt-4 border-t border-white/10">
              <Button
                variant="outline"
                className="w-full border-white/20 text-white/70 hover:text-white hover:bg-white/5"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                Wyloguj się
              </Button>
            </div>

            {/* Contact info */}
            <div className="pt-6 space-y-3">
              <p className="text-xs uppercase tracking-wider text-white/40">Kontakt z obsługą</p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="flex items-center gap-2 text-sm text-white/60 hover:text-brand-gold transition-colors"
              >
                <Mail className="w-4 h-4" />
                {SUPPORT_EMAIL}
              </a>
              <a
                href={`tel:+48${SUPPORT_PHONE.replace(/\s/g, '')}`}
                className="flex items-center gap-2 text-sm text-white/60 hover:text-brand-gold transition-colors"
              >
                <Phone className="w-4 h-4" />
                {SUPPORT_PHONE}
              </a>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="bg-white/5 rounded-2xl border border-white/10 p-6"
          >
            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Przegląd konta</h2>

                <div className="grid gap-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-sm text-white/50 mb-1">Email</p>
                    <p className="text-white">{user.email}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-sm text-white/50 mb-1">Imię i nazwisko</p>
                    <p className="text-white">
                      {user.firstName || user.lastName
                        ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                        : '—'}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-sm text-white/50 mb-1">Telefon</p>
                    <p className="text-white">{user.phone || '—'}</p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    variant="outline"
                    className="border-brand-gold/50 text-brand-gold hover:bg-brand-gold/10"
                    onClick={() => setActiveTab('orders')}
                  >
                    <Package className="w-4 h-4" />
                    Zobacz swoje zamówienia
                  </Button>
                </div>
              </div>
            )}

            {/* Orders */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Moje zamówienia</h2>

                {isLoadingOrders ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-white/20 mx-auto mb-4" />
                    <p className="text-white/60">Nie masz jeszcze żadnych zamówień</p>
                    <Button
                      className="mt-4"
                      onClick={onBack}
                    >
                      Przejdź do sklepu
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const status = statusLabels[order.status] || statusLabels.PENDING
                      const StatusIcon = status.icon
                      return (
                        <div
                          key={order.id}
                          className="bg-[#0c0c0c] rounded-2xl p-5"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="text-white font-medium font-[family-name:var(--font-heading)]">#{order.orderNumber}</p>
                              <p className="text-sm text-white/50 font-[family-name:var(--font-body)]">
                                {new Date(order.createdAt).toLocaleDateString('pl-PL', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </p>
                            </div>
                            <div className={`flex items-center gap-2 ${status.color}`}>
                              <StatusIcon className="w-4 h-4" />
                              <span className="text-sm font-medium font-[family-name:var(--font-body)]">{status.label}</span>
                            </div>
                          </div>

                          <div className="space-y-2 mb-3">
                            {order.items.slice(0, 2).map((item) => (
                              <div key={item.id} className="flex items-center gap-3">
                                {item.image && (
                                  <div className="w-12 h-12 bg-[#0a0a0a] rounded-lg p-1 flex-shrink-0">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-full h-full object-cover rounded"
                                    />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-white truncate font-[family-name:var(--font-heading)]">{item.name}</p>
                                  <p className="text-xs text-white/50 font-[family-name:var(--font-body)]">{item.quantity} szt.</p>
                                </div>
                                <p className="text-sm text-white/70 font-[family-name:var(--font-heading)]">{item.price.toFixed(2)} zł</p>
                              </div>
                            ))}
                            {order.items.length > 2 && (
                              <p className="text-xs text-white/50 font-[family-name:var(--font-body)]">
                                + {order.items.length - 2} więcej produktów
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-white/10">
                            <p className="text-white font-semibold font-[family-name:var(--font-heading)] flex items-baseline gap-1">
                              <span className="text-brand-gold">{order.total.toFixed(2)}</span>
                              <span className="text-brand-gold/80 text-sm">zł</span>
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-brand-gold hover:text-brand-gold hover:bg-brand-gold/10"
                              onClick={() => {
                                setContactOrderNumber(order.orderNumber)
                                setActiveTab('contact')
                              }}
                            >
                              <MessageSquare className="w-4 h-4" />
                              Kontakt ws. zamówienia
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Addresses */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Moje adresy</h2>
                  {!showAddressForm && (
                    <Button
                      onClick={() => {
                        resetAddressForm()
                        setShowAddressForm(true)
                      }}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Dodaj adres
                    </Button>
                  )}
                </div>

                {showAddressForm ? (
                  <div className="space-y-4 bg-white/5 rounded-lg border border-white/10 p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-white">
                        {editingAddress ? 'Edytuj adres' : 'Nowy adres'}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowAddressForm(false)
                          resetAddressForm()
                        }}
                        className="text-white/60 hover:text-white"
                      >
                        Anuluj
                      </Button>
                    </div>

                    {/* Typ adresu */}
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setAddressFormData(prev => ({ ...prev, type: 'SHIPPING' }))}
                        className={`p-4 border-2 rounded-lg transition-all text-left ${addressFormData.type === 'SHIPPING'
                            ? 'border-brand-gold bg-brand-gold/10'
                            : 'border-white/10 hover:border-white/30'
                          }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Truck className={`w-5 h-5 ${addressFormData.type === 'SHIPPING' ? 'text-brand-gold' : 'text-white/60'}`} />
                          <span className="font-medium text-white">Dostawa</span>
                        </div>
                        <p className="text-xs text-white/50">Adres do wysyłki zamówień</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAddressFormData(prev => ({ ...prev, type: 'BILLING' }))}
                        className={`p-4 border-2 rounded-lg transition-all text-left ${addressFormData.type === 'BILLING'
                            ? 'border-brand-gold bg-brand-gold/10'
                            : 'border-white/10 hover:border-white/30'
                          }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Building2 className={`w-5 h-5 ${addressFormData.type === 'BILLING' ? 'text-brand-gold' : 'text-white/60'}`} />
                          <span className="font-medium text-white">Faktura</span>
                        </div>
                        <p className="text-xs text-white/50">Dane do faktury VAT</p>
                      </button>
                    </div>

                    {/* Etykieta */}
                    <div className="space-y-2">
                      <label className="text-sm text-white/60">Nazwa adresu (opcjonalnie)</label>
                      <Input
                        name="label"
                        value={addressFormData.label || ''}
                        onChange={handleAddressInputChange}
                        placeholder="np. Dom, Praca, Firma..."
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                      />
                    </div>

                    {/* Dane firmy (tylko dla faktury) */}
                    {addressFormData.type === 'BILLING' && (
                      <div className="space-y-4 p-4 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-sm font-medium text-brand-gold">Dane firmy</p>
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <label className="text-sm text-white/60">Nazwa firmy *</label>
                            <Input
                              name="companyName"
                              value={addressFormData.companyName || ''}
                              onChange={handleAddressInputChange}
                              placeholder="Nazwa firmy Sp. z o.o."
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                            />
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <label className="text-sm text-white/60">NIP *</label>
                              <Input
                                name="nip"
                                value={addressFormData.nip || ''}
                                onChange={handleAddressInputChange}
                                placeholder="1234567890"
                                maxLength={10}
                                className={`bg-white/10 border-white/20 text-white placeholder:text-white/40 ${addressErrors.nip ? 'border-red-500' : ''}`}
                              />
                              {addressErrors.nip && <p className="text-red-500 text-xs">{addressErrors.nip}</p>}
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm text-white/60">Email do faktury</label>
                              <Input
                                name="email"
                                type="email"
                                value={addressFormData.email || ''}
                                onChange={handleAddressInputChange}
                                placeholder="faktury@firma.pl"
                                className={`bg-white/10 border-white/20 text-white placeholder:text-white/40 ${addressErrors.email ? 'border-red-500' : ''}`}
                              />
                              {addressErrors.email && <p className="text-red-500 text-xs">{addressErrors.email}</p>}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-white/60">Ulica i numer *</label>
                            <Input
                              name="street"
                              value={addressFormData.street}
                              onChange={handleAddressInputChange}
                              placeholder="ul. Firmowa 10"
                              className={`bg-white/10 border-white/20 text-white placeholder:text-white/40 ${addressErrors.street ? 'border-red-500' : ''}`}
                            />
                            {addressErrors.street && <p className="text-red-500 text-xs">{addressErrors.street}</p>}
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <label className="text-sm text-white/60">Miasto *</label>
                              <Input
                                name="city"
                                value={addressFormData.city}
                                onChange={handleAddressInputChange}
                                placeholder="Warszawa"
                                className={`bg-white/10 border-white/20 text-white placeholder:text-white/40 ${addressErrors.city ? 'border-red-500' : ''}`}
                              />
                              {addressErrors.city && <p className="text-red-500 text-xs">{addressErrors.city}</p>}
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm text-white/60">Kod pocztowy *</label>
                              <Input
                                name="postalCode"
                                value={addressFormData.postalCode}
                                onChange={handleAddressInputChange}
                                placeholder="00-000"
                                maxLength={6}
                                className={`bg-white/10 border-white/20 text-white placeholder:text-white/40 ${addressErrors.postalCode ? 'border-red-500' : ''}`}
                              />
                              {addressErrors.postalCode && <p className="text-red-500 text-xs">{addressErrors.postalCode}</p>}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Dane osobowe - tylko dla adresu dostawy */}
                    {addressFormData.type === 'SHIPPING' && (
                      <>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-sm text-white/60">Imię *</label>
                            <Input
                              name="firstName"
                              value={addressFormData.firstName}
                              onChange={handleAddressInputChange}
                              placeholder="Jan"
                              className={`bg-white/10 border-white/20 text-white placeholder:text-white/40 ${addressErrors.firstName ? 'border-red-500' : ''}`}
                            />
                            {addressErrors.firstName && <p className="text-red-500 text-xs">{addressErrors.firstName}</p>}
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-white/60">Nazwisko *</label>
                            <Input
                              name="lastName"
                              value={addressFormData.lastName}
                              onChange={handleAddressInputChange}
                              placeholder="Kowalski"
                              className={`bg-white/10 border-white/20 text-white placeholder:text-white/40 ${addressErrors.lastName ? 'border-red-500' : ''}`}
                            />
                            {addressErrors.lastName && <p className="text-red-500 text-xs">{addressErrors.lastName}</p>}
                          </div>
                        </div>

                        {/* Adres */}
                        <div className="space-y-2">
                          <label className="text-sm text-white/60">Ulica i numer *</label>
                          <Input
                            name="street"
                            value={addressFormData.street}
                            onChange={handleAddressInputChange}
                            placeholder="ul. Przykładowa 10/5"
                            className={`bg-white/10 border-white/20 text-white placeholder:text-white/40 ${addressErrors.street ? 'border-red-500' : ''}`}
                          />
                          {addressErrors.street && <p className="text-red-500 text-xs">{addressErrors.street}</p>}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-sm text-white/60">Miasto *</label>
                            <Input
                              name="city"
                              value={addressFormData.city}
                              onChange={handleAddressInputChange}
                              placeholder="Warszawa"
                              className={`bg-white/10 border-white/20 text-white placeholder:text-white/40 ${addressErrors.city ? 'border-red-500' : ''}`}
                            />
                            {addressErrors.city && <p className="text-red-500 text-xs">{addressErrors.city}</p>}
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-white/60">Kod pocztowy *</label>
                            <Input
                              name="postalCode"
                              value={addressFormData.postalCode}
                              onChange={handleAddressInputChange}
                              placeholder="00-000"
                              maxLength={6}
                              className={`bg-white/10 border-white/20 text-white placeholder:text-white/40 ${addressErrors.postalCode ? 'border-red-500' : ''}`}
                            />
                            {addressErrors.postalCode && <p className="text-red-500 text-xs">{addressErrors.postalCode}</p>}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm text-white/60">Telefon</label>
                          <Input
                            name="phone"
                            value={addressFormData.phone || ''}
                            onChange={handleAddressInputChange}
                            placeholder="+48 123 456 789"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                          />
                        </div>
                      </>
                    )}

                    {/* Domyślny adres */}
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isDefault"
                        checked={addressFormData.isDefault}
                        onChange={handleAddressInputChange}
                        className="w-5 h-5 rounded border-white/20 bg-white/10 text-brand-gold focus:ring-brand-gold/50"
                      />
                      <span className="text-white/80">Ustaw jako domyślny adres</span>
                    </label>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleSaveAddress}
                        disabled={isSavingAddress}
                        className="flex-1"
                      >
                        {isSavingAddress ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {editingAddress ? 'Zapisz zmiany' : 'Dodaj adres'}
                      </Button>
                    </div>
                  </div>
                ) : isLoadingAddresses ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="w-12 h-12 text-white/20 mx-auto mb-4" />
                    <p className="text-white/60 mb-4">Nie masz jeszcze żadnych zapisanych adresów</p>
                    <p className="text-white/40 text-sm">
                      Dodaj adresy, aby szybciej składać zamówienia
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Adresy dostawy */}
                    {addresses.filter(a => a.type === 'SHIPPING').length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider flex items-center gap-2">
                          <Truck className="w-4 h-4" />
                          Adresy dostawy
                        </h3>
                        {addresses.filter(a => a.type === 'SHIPPING').map(address => (
                          <div
                            key={address.id}
                            className={`bg-white/5 rounded-lg border p-4 ${address.isDefault ? 'border-brand-gold/50' : 'border-white/10'}`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  {address.label && (
                                    <span className="text-brand-gold font-medium">{address.label}</span>
                                  )}
                                  {address.isDefault && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-gold/20 text-brand-gold text-xs rounded-full">
                                      <Star className="w-3 h-3" />
                                      Domyślny
                                    </span>
                                  )}
                                </div>
                                <p className="text-white font-medium">
                                  {address.firstName} {address.lastName}
                                </p>
                                <p className="text-white/70 text-sm">{address.street}</p>
                                <p className="text-white/70 text-sm">
                                  {address.postalCode} {address.city}
                                </p>
                                {address.phone && (
                                  <p className="text-white/50 text-sm mt-1">{address.phone}</p>
                                )}
                              </div>
                              <div className="flex flex-col gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditAddress(address)}
                                  className="text-white/60 hover:text-white"
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                {!address.isDefault && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSetDefaultAddress(address.id)}
                                    className="text-white/60 hover:text-brand-gold"
                                    title="Ustaw jako domyślny"
                                  >
                                    <Star className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteAddress(address.id)}
                                  className="text-white/60 hover:text-red-400"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Adresy do faktur */}
                    {addresses.filter(a => a.type === 'BILLING').length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          Dane do faktur
                        </h3>
                        {addresses.filter(a => a.type === 'BILLING').map(address => (
                          <div
                            key={address.id}
                            className={`bg-white/5 rounded-lg border p-4 ${address.isDefault ? 'border-brand-gold/50' : 'border-white/10'}`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  {address.label && (
                                    <span className="text-brand-gold font-medium">{address.label}</span>
                                  )}
                                  {address.isDefault && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-gold/20 text-brand-gold text-xs rounded-full">
                                      <Star className="w-3 h-3" />
                                      Domyślny
                                    </span>
                                  )}
                                </div>
                                {address.companyName && (
                                  <p className="text-white font-medium">{address.companyName}</p>
                                )}
                                {address.nip && (
                                  <p className="text-white/50 text-sm">NIP: {address.nip}</p>
                                )}
                                <p className="text-white/70 text-sm mt-1">
                                  {address.firstName} {address.lastName}
                                </p>
                                <p className="text-white/70 text-sm">{address.street}</p>
                                <p className="text-white/70 text-sm">
                                  {address.postalCode} {address.city}
                                </p>
                                {address.email && (
                                  <p className="text-white/50 text-sm mt-1">{address.email}</p>
                                )}
                              </div>
                              <div className="flex flex-col gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditAddress(address)}
                                  className="text-white/60 hover:text-white"
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                {!address.isDefault && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSetDefaultAddress(address.id)}
                                    className="text-white/60 hover:text-brand-gold"
                                    title="Ustaw jako domyślny"
                                  >
                                    <Star className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteAddress(address.id)}
                                  className="text-white/60 hover:text-red-400"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Settings */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Ustawienia konta</h2>

                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm text-white/60">Imię</label>
                      <Input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Imię"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-white/60">Nazwisko</label>
                      <Input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Nazwisko"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-white/60">Email</label>
                    <Input
                      value={user.email}
                      disabled
                      className="bg-white/5 border-white/10 text-white/50"
                    />
                    <p className="text-xs text-white/40">Email nie może być zmieniony</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-white/60">Telefon</label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+48 123 456 789"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>

                  <Button
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className="mt-4"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Zapisz zmiany
                  </Button>
                </div>

                {/* Newsletter */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Newsletter</h3>
                  <div className="bg-white/5 rounded-lg border border-white/10 p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isLoadingNewsletter ? (
                          <Loader2 className="w-5 h-5 animate-spin text-white/40" />
                        ) : isNewsletterSubscribed ? (
                          <div className="w-9 h-9 rounded-full bg-brand-gold/15 flex items-center justify-center">
                            <Bell className="w-4 h-4 text-brand-gold" />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center">
                            <BellOff className="w-4 h-4 text-white/40" />
                          </div>
                        )}
                        <div>
                          <p className="text-white font-medium text-sm">
                            {isLoadingNewsletter ? 'Sprawdzanie...' : isNewsletterSubscribed ? 'Subskrybujesz newsletter' : 'Newsletter wyłączony'}
                          </p>
                          <p className="text-white/40 text-xs">
                            {isNewsletterSubscribed ? 'Otrzymujesz informacje o nowościach i ofertach' : 'Nie otrzymujesz emaili marketingowych'}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleToggleNewsletter}
                        disabled={isTogglingNewsletter || isLoadingNewsletter}
                        className={isNewsletterSubscribed
                          ? 'border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300'
                          : 'border-brand-gold/30 text-brand-gold hover:bg-brand-gold/10'
                        }
                      >
                        {isTogglingNewsletter ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : isNewsletterSubscribed ? (
                          <><BellOff className="w-4 h-4" /> Wypisz się</>
                        ) : (
                          <><Bell className="w-4 h-4" /> Zapisz się</>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contact */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Kontakt z obsługą</h2>

                <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-lg p-4">
                  <p className="text-brand-gold font-medium mb-2">Dane kontaktowe</p>
                  <div className="space-y-2">
                    <a
                      href={`mailto:${SUPPORT_EMAIL}`}
                      className="flex items-center gap-2 text-white hover:text-brand-gold transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      {SUPPORT_EMAIL}
                    </a>
                    <a
                      href={`tel:+48${SUPPORT_PHONE.replace(/\s/g, '')}`}
                      className="flex items-center gap-2 text-white hover:text-brand-gold transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      {SUPPORT_PHONE}
                    </a>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-white/60">
                    Masz pytanie dotyczące zamówienia? Wypełnij formularz poniżej.
                  </p>

                  <div className="space-y-2">
                    <label className="text-sm text-white/60">Numer zamówienia *</label>
                    <Input
                      value={contactOrderNumber}
                      onChange={(e) => setContactOrderNumber(e.target.value)}
                      placeholder="np. ORD-20260205-XXXX"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-white/60">Wiadomość</label>
                    <textarea
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Opisz swoje pytanie lub problem..."
                      rows={4}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-white/40 resize-none focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                    />
                  </div>

                  <Button
                    onClick={handleContactSubmit}
                    disabled={!contactMessage.trim()}
                  >
                    <Mail className="w-4 h-4" />
                    Wyślij wiadomość
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
