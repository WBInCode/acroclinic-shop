// @ts-nocheck
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  Package,
  ShoppingCart,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  Eye,
  Mail,
  Phone,
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Save,
  Loader2,
  RefreshCw,
  Truck,
  Image as ImageIcon,
  Building2,
  FileText
} from 'lucide-react'
import { toast } from 'sonner'

const ease = [0.22, 1, 0.36, 1] as const
import { API_BASE_URL as API_URL } from '@/lib/api'

interface AdminPanelProps {
  onBack: () => void
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  features: string[]
  materials: string
  price: number
  comparePrice?: number
  stock: number
  sizes: string[]
  isActive: boolean
  isBestseller: boolean
  badge?: string
  category?: { id: string; name: string; slug: string }
  images: { id: string; url: string; alt?: string; position: number }[]
  createdAt: string
}

interface Order {
  id: string
  orderNumber: string
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
  total: number
  subtotal: number
  shippingCost: number
  itemCount: number
  createdAt: string
  shippingFirstName?: string
  shippingLastName?: string
  shippingEmail?: string
  shippingPhone?: string
  shippingStreet?: string
  shippingCity?: string
  shippingPostalCode?: string
  // Dane do faktury
  wantInvoice?: boolean
  billingCompanyName?: string
  billingNip?: string
  billingFirstName?: string
  billingLastName?: string
  billingStreet?: string
  billingCity?: string
  billingPostalCode?: string
  billingEmail?: string
  items: {
    id: string
    name: string
    price: number
    quantity: number
    image?: string
  }[]
}

interface Category {
  id: string
  name: string
  slug: string
}

interface Stats {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  completedOrders: number
  totalProducts: number
  lowStockProducts: number
}

type TabType = 'overview' | 'orders' | 'products'

export function AdminPanel({ onBack }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showProductModal, setShowProductModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      console.log('AdminPanel: Token present:', !!token, token ? token.substring(0, 30) + '...' : 'none')
      const authHeaders = { 'Authorization': `Bearer ${token || ''}` }

      // Try admin endpoint first, fall back to public API
      const [productsRes, ordersRes, categoriesRes] = await Promise.all([
        // Use public products API (works without auth, shows all active products)
        fetch(`${API_URL}/products?limit=100`).then(res => {
          console.log('Products response status:', res.status)
          return res
        }).catch(err => {
          console.error('Products fetch error:', err)
          return { ok: false, json: () => Promise.resolve({ products: [] }) }
        }),
        fetch(`${API_URL}/admin/orders`, {
          headers: authHeaders
        }).then(res => {
          console.log('Orders response status:', res.status)
          return res
        }).catch(err => {
          console.error('Orders fetch error:', err)
          return { ok: false, json: () => Promise.resolve({ orders: [] }) }
        }),
        // Correct endpoint for categories
        fetch(`${API_URL}/products/categories`).then(res => {
          console.log('Categories response status:', res.status)
          return res
        }).catch(err => {
          console.error('Categories fetch error:', err)
          return { ok: false, json: () => Promise.resolve({ categories: [] }) }
        })
      ])

      let loadedProducts: Product[] = []
      let loadedOrders: Order[] = []

      if (productsRes.ok) {
        const data = await productsRes.json()
        // Add isActive: true since public API only returns active products
        loadedProducts = (data.products || []).map((p: any) => ({ ...p, isActive: true }))
        setProducts(loadedProducts)
        console.log('Loaded products:', loadedProducts.length)
      } else {
        console.warn('Products request failed, status:', productsRes.status)
      }

      if (ordersRes.ok) {
        const data = await ordersRes.json()
        loadedOrders = data.orders || []
        setOrders(loadedOrders)
        console.log('Loaded orders:', loadedOrders.length)
      } else {
        console.warn('Orders request failed, status:', ordersRes.status, '- token may be expired')
        toast.error(`Błąd pobierania zamówień: ${ordersRes.status}`)
        if (ordersRes.status === 401) {
          toast.error('Sesja wygasła, zaloguj się ponownie')
        }
      }

      if (categoriesRes.ok) {
        const data = await categoriesRes.json()
        setCategories(data.categories || [])
        console.log('Loaded categories:', data.categories?.length || 0)
      } else {
        console.warn('Categories request failed')
      }

      setStats({
        totalOrders: loadedOrders.length,
        totalRevenue: loadedOrders.filter(o => o.paymentStatus === 'COMPLETED' || o.paymentStatus === 'PAID').reduce((sum, o) => sum + o.total, 0),
        pendingOrders: loadedOrders.filter(o => o.status === 'PENDING' || o.status === 'PROCESSING').length,
        completedOrders: loadedOrders.filter(o => o.status === 'DELIVERED').length,
        totalProducts: loadedProducts.length,
        lowStockProducts: loadedProducts.filter(p => p.stock < 5).length
      })
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Błąd pobierania danych: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (products.length > 0 || orders.length > 0) {
      setStats({
        totalOrders: orders.length,
        totalRevenue: orders.filter(o => o.paymentStatus === 'COMPLETED' || o.paymentStatus === 'PAID').reduce((sum, o) => sum + o.total, 0),
        pendingOrders: orders.filter(o => o.status === 'PENDING' || o.status === 'PROCESSING').length,
        completedOrders: orders.filter(o => o.status === 'DELIVERED').length,
        totalProducts: products.length,
        lowStockProducts: products.filter(p => p.stock < 5).length
      })
    }
  }, [orders, products])

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      'PENDING': { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Oczekujące' },
      'CONFIRMED': { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Potwierdzone' },
      'PROCESSING': { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'W realizacji' },
      'SHIPPED': { bg: 'bg-cyan-500/20', text: 'text-cyan-400', label: 'Wysłane' },
      'DELIVERED': { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Dostarczone' },
      'CANCELLED': { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Anulowane' },
    }
    const badge = badges[status] || badges['PENDING']
    return <span className={`px-2 py-1 text-xs rounded-full ${badge.bg} ${badge.text}`}>{badge.label}</span>
  }

  const getPaymentBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      'PENDING': { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Oczekuje' },
      'PAID': { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Opłacone' },
      'FAILED': { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Nieudane' },
      'REFUNDED': { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Zwrócone' },
    }
    const badge = badges[status] || badges['PENDING']
    return <span className={`px-2 py-1 text-xs rounded-full ${badge.bg} ${badge.text}`}>{badge.label}</span>
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setOrders(prev => prev.map(o =>
          o.id === orderId ? { ...o, status: newStatus as Order['status'] } : o
        ))
        toast.success('Status zamówienia zaktualizowany')
      } else {
        toast.error('Błąd aktualizacji statusu')
      }
    } catch (error) {
      toast.error('Błąd połączenia z serwerem')
    }
  }

  const handleSaveProduct = async (productData: Partial<Product>) => {
    setIsSaving(true)
    try {
      const url = editingProduct?.id
        ? `${API_URL}/admin/products/${editingProduct.id}`
        : `${API_URL}/admin/products`

      const response = await fetch(url, {
        method: editingProduct?.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`
        },
        body: JSON.stringify(productData)
      })

      if (response.ok) {
        toast.success(editingProduct?.id ? 'Produkt zaktualizowany' : 'Produkt dodany')
        setShowProductModal(false)
        setEditingProduct(null)
        fetchData()
      } else {
        toast.error('Błąd zapisywania produktu')
      }
    } catch (error) {
      toast.error('Błąd połączenia z serwerem')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Czy na pewno chcesz usunąć ten produkt?')) return

    try {
      const response = await fetch(`${API_URL}/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`
        }
      })

      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== productId))
        toast.success('Produkt usunięty')
      } else {
        toast.error('Błąd usuwania produktu')
      }
    } catch (error) {
      toast.error('Błąd połączenia z serwerem')
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ((order.shippingFirstName || '') + ' ' + (order.shippingLastName || '')).toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease }}
      className="min-h-screen pt-20 pb-32 bg-black"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            onClick={onBack}
            className="flex items-center gap-2 text-white/60 hover:text-brand-gold transition-colors group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs uppercase tracking-widest">Powrót do sklepu</span>
          </motion.button>

          <motion.h1
            className="font-[family-name:var(--font-heading)] font-bold text-2xl md:text-3xl text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Panel <span className="text-brand-gold">Administratora</span>
          </motion.h1>

          <button
            onClick={fetchData}
            className="flex items-center gap-2 text-white/60 hover:text-brand-gold transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="text-xs uppercase tracking-widest hidden md:inline">Odśwież</span>
          </button>
        </div>

        {/* Tabs */}
        <motion.div
          className="flex gap-2 mb-8 border-b border-white/10 pb-4 overflow-x-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${activeTab === 'overview'
              ? 'bg-brand-gold text-black'
              : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="text-sm font-medium">Przegląd</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${activeTab === 'orders'
              ? 'bg-brand-gold text-black'
              : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm font-medium">Zamówienia</span>
            {stats && stats.pendingOrders > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                {stats.pendingOrders}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${activeTab === 'products'
              ? 'bg-brand-gold text-black'
              : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
          >
            <Package className="w-4 h-4" />
            <span className="text-sm font-medium">Produkty</span>
          </button>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && stats && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-brand-gold/20 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-brand-gold" />
                      </div>
                      <span className="text-white/40 text-xs uppercase tracking-wider">Przychód</span>
                    </div>
                    <p className="font-[family-name:var(--font-heading)] font-bold text-2xl text-white">
                      {stats.totalRevenue.toLocaleString('pl-PL', { minimumFractionDigits: 2 })} <span className="text-sm text-white/40">PLN</span>
                    </p>
                  </div>

                  <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-blue-400" />
                      </div>
                      <span className="text-white/40 text-xs uppercase tracking-wider">Zamówienia</span>
                    </div>
                    <p className="font-[family-name:var(--font-heading)] font-bold text-2xl text-white">{stats.totalOrders}</p>
                  </div>

                  <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </div>
                      <span className="text-white/40 text-xs uppercase tracking-wider">Zrealizowane</span>
                    </div>
                    <p className="font-[family-name:var(--font-heading)] font-bold text-2xl text-white">{stats.completedOrders}</p>
                  </div>

                  <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-yellow-400" />
                      </div>
                      <span className="text-white/40 text-xs uppercase tracking-wider">Oczekujące</span>
                    </div>
                    <p className="font-[family-name:var(--font-heading)] font-bold text-2xl text-white">{stats.pendingOrders}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/[0.02] border border-white/10 rounded-lg p-6">
                    <h3 className="font-[family-name:var(--font-heading)] font-bold text-lg text-white mb-4">Produkty</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/60">Wszystkie produkty</span>
                        <span className="text-white font-bold">{stats.totalProducts}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/60">Niski stan magazynowy (&lt;5)</span>
                        <span className={`font-bold ${stats.lowStockProducts > 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {stats.lowStockProducts}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/[0.02] border border-white/10 rounded-lg p-6">
                    <h3 className="font-[family-name:var(--font-heading)] font-bold text-lg text-white mb-4">Ostatnie zamówienia</h3>
                    <div className="space-y-3">
                      {orders.slice(0, 5).map(order => (
                        <div key={order.id} className="flex justify-between items-center text-sm">
                          <span className="text-white/60">{order.orderNumber}</span>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(order.status)}
                            <span className="text-white">{order.total.toFixed(2)} PLN</span>
                          </div>
                        </div>
                      ))}
                      {orders.length === 0 && <p className="text-white/40 text-center py-4">Brak zamówień</p>}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      placeholder="Szukaj po numerze zamówienia lub nazwisku..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:border-brand-gold/50"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-zinc-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50"
                  >
                    <option value="all" className="bg-zinc-800 text-white">Wszystkie statusy</option>
                    <option value="PENDING" className="bg-zinc-800 text-white">Oczekujące</option>
                    <option value="CONFIRMED" className="bg-zinc-800 text-white">Potwierdzone</option>
                    <option value="PROCESSING" className="bg-zinc-800 text-white">W realizacji</option>
                    <option value="SHIPPED" className="bg-zinc-800 text-white">Wysłane</option>
                    <option value="DELIVERED" className="bg-zinc-800 text-white">Dostarczone</option>
                    <option value="CANCELLED" className="bg-zinc-800 text-white">Anulowane</option>
                  </select>
                </div>

                <div className="bg-white/[0.02] border border-white/10 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left text-white/40 text-xs uppercase tracking-wider p-4">Nr zamówienia</th>
                          <th className="text-left text-white/40 text-xs uppercase tracking-wider p-4">Klient</th>
                          <th className="text-left text-white/40 text-xs uppercase tracking-wider p-4">Status</th>
                          <th className="text-left text-white/40 text-xs uppercase tracking-wider p-4">Płatność</th>
                          <th className="text-left text-white/40 text-xs uppercase tracking-wider p-4">Kwota</th>
                          <th className="text-left text-white/40 text-xs uppercase tracking-wider p-4">Data</th>
                          <th className="text-left text-white/40 text-xs uppercase tracking-wider p-4">Akcje</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map(order => (
                          <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                            <td className="p-4"><span className="text-white font-mono">{order.orderNumber}</span></td>
                            <td className="p-4">
                              <div>
                                <p className="text-white">{order.shippingFirstName} {order.shippingLastName}</p>
                                <p className="text-white/40 text-sm">{order.shippingEmail}</p>
                              </div>
                            </td>
                            <td className="p-4">{getStatusBadge(order.status)}</td>
                            <td className="p-4">{getPaymentBadge(order.paymentStatus)}</td>
                            <td className="p-4"><span className="text-white font-bold">{order.total.toFixed(2)} PLN</span></td>
                            <td className="p-4"><span className="text-white/60 text-sm">{new Date(order.createdAt).toLocaleDateString('pl-PL')}</span></td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <button onClick={() => setSelectedOrder(order)} className="p-2 text-white/60 hover:text-brand-gold transition-colors" title="Szczegóły">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <select
                                  value={order.status}
                                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                  className="bg-zinc-800 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
                                >
                                  <option value="PENDING" className="bg-zinc-800 text-white">Oczekujące</option>
                                  <option value="CONFIRMED" className="bg-zinc-800 text-white">Potwierdzone</option>
                                  <option value="PROCESSING" className="bg-zinc-800 text-white">W realizacji</option>
                                  <option value="SHIPPED" className="bg-zinc-800 text-white">Wysłane</option>
                                  <option value="DELIVERED" className="bg-zinc-800 text-white">Dostarczone</option>
                                  <option value="CANCELLED" className="bg-zinc-800 text-white">Anulowane</option>
                                </select>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredOrders.length === 0 && (
                      <div className="text-center py-12">
                        <ShoppingCart className="w-12 h-12 text-white/20 mx-auto mb-4" />
                        <p className="text-white/40">Brak zamówień</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      placeholder="Szukaj produktów..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:border-brand-gold/50"
                    />
                  </div>
                  <button
                    onClick={() => { setEditingProduct(null); setShowProductModal(true) }}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-gold text-black rounded-lg hover:bg-brand-gold/90 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="font-medium">Dodaj produkt</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="bg-white/[0.02] border border-white/10 rounded-lg overflow-hidden">
                      <div className="aspect-[4/3] relative bg-white/5">
                        {(product.image || (product.images && product.images[0]?.url)) ? (
                          <img
                            src={product.image || product.images?.[0]?.url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-white/20" />
                          </div>
                        )}
                        {!product.isActive && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white/60 text-sm">Nieaktywny</span>
                          </div>
                        )}
                        {product.stock < 5 && product.stock > 0 && (
                          <div className="absolute top-2 right-2">
                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400">Mało sztuk ({product.stock})</span>
                          </div>
                        )}
                        {product.stock === 0 && (
                          <div className="absolute top-2 right-2">
                            <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400">Brak w magazynie</span>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-white text-sm mb-1 line-clamp-1">{product.name}</h3>
                        <p className="text-white/40 text-xs mb-2">{product.category?.name || 'Brak kategorii'}</p>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-brand-gold font-bold text-sm">{product.price.toFixed(2)} PLN</span>
                          <span className="text-white/40 text-xs">Stan: {product.stock}</span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => { setEditingProduct(product); setShowProductModal(true) }}
                            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-white/5 text-white/60 rounded hover:bg-white/10 hover:text-white transition-colors"
                          >
                            <Pencil className="w-3 h-3" />
                            <span className="text-xs">Edytuj</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="flex items-center justify-center px-2 py-1.5 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-white/20 mx-auto mb-4" />
                    <p className="text-white/40">Brak produktów</p>
                  </div>
                )}
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            key="order-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-lg overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="font-[family-name:var(--font-heading)] font-bold text-xl text-white">Zamówienie {selectedOrder.orderNumber}</h3>
                <button onClick={() => setSelectedOrder(null)} className="text-white/60 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4 flex-wrap">
                  <div>
                    <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">Status</span>
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                  <div>
                    <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">Płatność</span>
                    {getPaymentBadge(selectedOrder.paymentStatus)}
                  </div>
                  <div>
                    <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">Data</span>
                    <span className="text-white">{new Date(selectedOrder.createdAt).toLocaleString('pl-PL')}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-[family-name:var(--font-heading)] font-bold text-white mb-3 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-brand-gold" /> Dane dostawy
                  </h4>
                  <div className="bg-white/5 rounded-lg p-4 space-y-2">
                    <p className="text-white font-medium">{selectedOrder.shippingFirstName} {selectedOrder.shippingLastName}</p>
                    <p className="text-white/60">{selectedOrder.shippingStreet}</p>
                    <p className="text-white/60">{selectedOrder.shippingPostalCode} {selectedOrder.shippingCity}</p>
                    <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-white/10 mt-2">
                      {selectedOrder.shippingPhone && <span className="text-white/60 flex items-center gap-1"><Phone className="w-4 h-4" /> {selectedOrder.shippingPhone}</span>}
                      {selectedOrder.shippingEmail && <span className="text-white/60 flex items-center gap-1"><Mail className="w-4 h-4" /> {selectedOrder.shippingEmail}</span>}
                    </div>
                  </div>
                </div>

                {/* Dane do faktury */}
                {selectedOrder.wantInvoice && (
                  <div>
                    <h4 className="font-[family-name:var(--font-heading)] font-bold text-white mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-brand-gold" /> Dane do faktury
                    </h4>
                    <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-lg p-4 space-y-2">
                      {selectedOrder.billingCompanyName && (
                        <p className="text-white font-medium flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-brand-gold" />
                          {selectedOrder.billingCompanyName}
                        </p>
                      )}
                      {selectedOrder.billingNip && (
                        <p className="text-white/70 text-sm">NIP: {selectedOrder.billingNip}</p>
                      )}
                      {(selectedOrder.billingFirstName || selectedOrder.billingLastName) && (
                        <p className="text-white/70">{selectedOrder.billingFirstName} {selectedOrder.billingLastName}</p>
                      )}
                      {selectedOrder.billingStreet && (
                        <p className="text-white/60">{selectedOrder.billingStreet}</p>
                      )}
                      {(selectedOrder.billingPostalCode || selectedOrder.billingCity) && (
                        <p className="text-white/60">{selectedOrder.billingPostalCode} {selectedOrder.billingCity}</p>
                      )}
                      {selectedOrder.billingEmail && (
                        <p className="text-white/60 flex items-center gap-1 pt-2 border-t border-brand-gold/20 mt-2">
                          <Mail className="w-4 h-4" /> {selectedOrder.billingEmail}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-[family-name:var(--font-heading)] font-bold text-white mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4 text-brand-gold" /> Produkty
                  </h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 bg-white/5 rounded-lg p-3">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                        ) : (
                          <div className="w-16 h-16 bg-white/10 rounded flex items-center justify-center"><ImageIcon className="w-6 h-6 text-white/20" /></div>
                        )}
                        <div className="flex-1">
                          <p className="text-white font-medium">{item.name}</p>
                          <p className="text-white/40 text-sm">Ilość: {item.quantity}</p>
                        </div>
                        <span className="text-white font-bold">{(item.price * item.quantity).toFixed(2)} PLN</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 space-y-2">
                  <div className="flex justify-between text-white/60"><span>Produkty</span><span>{selectedOrder.subtotal.toFixed(2)} PLN</span></div>
                  <div className="flex justify-between text-white/60"><span>Dostawa</span><span>{selectedOrder.shippingCost.toFixed(2)} PLN</span></div>
                  <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10">
                    <span>Razem</span>
                    <span className="text-brand-gold">{selectedOrder.total.toFixed(2)} PLN</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => { updateOrderStatus(selectedOrder.id, e.target.value); setSelectedOrder({ ...selectedOrder, status: e.target.value as Order['status'] }) }}
                    className="flex-1 bg-zinc-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50"
                  >
                    <option value="PENDING" className="bg-zinc-800 text-white">Oczekujące</option>
                    <option value="CONFIRMED" className="bg-zinc-800 text-white">Potwierdzone</option>
                    <option value="PROCESSING" className="bg-zinc-800 text-white">W realizacji</option>
                    <option value="SHIPPED" className="bg-zinc-800 text-white">Wysłane</option>
                    <option value="DELIVERED" className="bg-zinc-800 text-white">Dostarczone</option>
                    <option value="CANCELLED" className="bg-zinc-800 text-white">Anulowane</option>
                  </select>
                  <button onClick={() => setSelectedOrder(null)} className="px-6 py-2 bg-brand-gold text-black font-medium rounded-lg hover:bg-brand-gold/90 transition-colors">Zamknij</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Edit Modal */}
      <AnimatePresence>
        {showProductModal && (
          <ProductEditModal
            key="product-modal"
            product={editingProduct}
            categories={categories}
            onSave={handleSaveProduct}
            onClose={() => { setShowProductModal(false); setEditingProduct(null) }}
            isSaving={isSaving}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function ProductEditModal({ product, categories, onSave, onClose, isSaving }: {
  product: Product | null
  categories: Category[]
  onSave: (data: Partial<Product>) => void
  onClose: () => void
  isSaving: boolean
}) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    features: product?.features?.join('\n') || '',
    materials: product?.materials || '',
    price: product?.price?.toString() || '',
    comparePrice: product?.comparePrice?.toString() || '',
    stock: product?.stock?.toString() || '0',
    sizes: product?.sizes?.join(', ') || '',
    categoryId: product?.category?.id || '',
    isActive: product?.isActive ?? true,
    isBestseller: product?.isBestseller ?? false,
    badge: product?.badge || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name: formData.name,
      description: formData.description,
      features: formData.features.split('\n').filter(f => f.trim()),
      materials: formData.materials,
      price: parseFloat(formData.price) || 0,
      comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
      stock: parseInt(formData.stock) || 0,
      sizes: formData.sizes.split(',').map(s => s.trim()).filter(s => s),
      categoryId: formData.categoryId || undefined,
      isActive: formData.isActive,
      isBestseller: formData.isBestseller,
      badge: formData.badge || undefined,
    } as any)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-lg overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="font-[family-name:var(--font-heading)] font-bold text-xl text-white">{product ? 'Edytuj produkt' : 'Dodaj nowy produkt'}</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Nazwa produktu *</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-brand-gold/50" required />
          </div>

          <div>
            <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Opis</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-brand-gold/50" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Cena (PLN) *</label>
              <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-brand-gold/50" required />
            </div>
            <div>
              <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Cena promocyjna</label>
              <input type="number" step="0.01" value={formData.comparePrice} onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-brand-gold/50" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Stan magazynowy</label>
              <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-brand-gold/50" />
            </div>
            <div>
              <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Kategoria</label>
              <select value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} className="w-full bg-zinc-800 border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-brand-gold/50">
                <option value="" className="bg-zinc-800 text-white">Wybierz kategorię</option>
                {categories.map(cat => <option key={cat.id} value={cat.id} className="bg-zinc-800 text-white">{cat.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Rozmiary (oddzielone przecinkami)</label>
            <input type="text" value={formData.sizes} onChange={(e) => setFormData({ ...formData, sizes: e.target.value })} placeholder="np. 116, 122, 128, 134, 140" className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-brand-gold/50" />
          </div>

          <div>
            <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Cechy (każda w nowej linii)</label>
            <textarea value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} rows={3} placeholder="Oddychający materiał&#10;Szybkoschnący" className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-brand-gold/50" />
          </div>

          <div>
            <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Materiały</label>
            <input type="text" value={formData.materials} onChange={(e) => setFormData({ ...formData, materials: e.target.value })} placeholder="np. 80% poliester, 20% elastan" className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-brand-gold/50" />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="accent-brand-gold" />
              <span className="text-white">Aktywny</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.isBestseller} onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })} className="accent-brand-gold" />
              <span className="text-white">Bestseller</span>
            </label>
          </div>

          <div>
            <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Badge</label>
            <select value={formData.badge} onChange={(e) => setFormData({ ...formData, badge: e.target.value })} className="w-full bg-zinc-800 border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-brand-gold/50">
              <option value="" className="bg-zinc-800 text-white">Brak</option>
              <option value="NEW" className="bg-zinc-800 text-white">Nowość</option>
              <option value="LIMITED" className="bg-zinc-800 text-white">Limitowany</option>
              <option value="SALE" className="bg-zinc-800 text-white">Promocja</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors">Anuluj</button>
            <button type="submit" disabled={isSaving} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-brand-gold text-black font-medium rounded-lg hover:bg-brand-gold/90 transition-colors disabled:opacity-50">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {product ? 'Zapisz zmiany' : 'Dodaj produkt'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
