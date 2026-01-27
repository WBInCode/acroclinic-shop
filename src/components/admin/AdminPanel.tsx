import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  ArrowLeft, 
  Package, 
  MessageSquare, 
  BarChart3, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Mail,
  Phone
} from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

interface AdminPanelProps {
  onBack: () => void
}

// Przykładowe dane zamówień
const mockOrders = [
  {
    id: 'ZAM-001',
    customer: 'Anna Kowalska',
    email: 'anna.kowalska@email.com',
    phone: '+48 512 345 678',
    items: [
      { name: 'Legginsy', size: '134', quantity: 1, price: 144.99 },
      { name: 'Top Sportowy', size: 'S', quantity: 2, price: 99.99 }
    ],
    total: 344.97,
    status: 'new',
    date: '2026-01-27 14:30'
  },
  {
    id: 'ZAM-002',
    customer: 'Piotr Nowak',
    email: 'piotr.nowak@email.com',
    phone: '+48 600 123 456',
    items: [
      { name: 'Bluza Regular Dziecięca', size: '128', quantity: 1, price: 159.99 }
    ],
    total: 159.99,
    status: 'processing',
    date: '2026-01-27 12:15'
  },
  {
    id: 'ZAM-003',
    customer: 'Maria Wiśniewska',
    email: 'maria.w@email.com',
    phone: '+48 505 987 654',
    items: [
      { name: 'T-shirt Dziecięcy', size: '122', quantity: 3, price: 89.99 },
      { name: 'Spodenki Kolarki', size: '122', quantity: 3, price: 89.99 }
    ],
    total: 539.94,
    status: 'completed',
    date: '2026-01-26 16:45'
  },
  {
    id: 'ZAM-004',
    customer: 'Tomasz Zieliński',
    email: 'tomasz.z@email.com',
    phone: '+48 511 222 333',
    items: [
      { name: 'Dresy Jogger Dziecięce', size: '140', quantity: 1, price: 149.99 }
    ],
    total: 149.99,
    status: 'cancelled',
    date: '2026-01-26 10:20'
  }
]

// Przykładowe wiadomości
const mockMessages = [
  {
    id: 1,
    name: 'Katarzyna Lewandowska',
    email: 'kasia.lew@email.com',
    subject: 'Pytanie o rozmiarówkę',
    message: 'Dzień dobry, czy moglibyście mi pomóc z doborem rozmiaru dla 8-letniej córki? Ma 128cm wzrostu.',
    date: '2026-01-27 15:00',
    read: false
  },
  {
    id: 2,
    name: 'Robert Mazur',
    email: 'r.mazur@email.com',
    subject: 'Dostępność produktu',
    message: 'Czy legginsy w rozmiarze 146 będą ponownie dostępne?',
    date: '2026-01-27 11:30',
    read: false
  },
  {
    id: 3,
    name: 'Ewa Kamińska',
    email: 'ewa.k@email.com',
    subject: 'Reklamacja',
    message: 'Chciałabym zgłosić reklamację zamówienia ZAM-098. Otrzymałam niewłaściwy rozmiar.',
    date: '2026-01-26 14:20',
    read: true
  }
]

// Statystyki
const stats = {
  totalOrders: 156,
  totalRevenue: 24567.50,
  newOrders: 12,
  pendingOrders: 8,
  completedOrders: 132,
  cancelledOrders: 4,
  newMessages: 5,
  topProducts: [
    { name: 'Legginsy', sold: 45 },
    { name: 'T-shirt Dziecięcy', sold: 38 },
    { name: 'Spodenki Kolarki', sold: 32 },
    { name: 'Bluza Regular', sold: 28 },
    { name: 'Top Sportowy', sold: 24 }
  ],
  recentSales: [
    { date: 'Pon', amount: 1250 },
    { date: 'Wt', amount: 980 },
    { date: 'Śr', amount: 1450 },
    { date: 'Czw', amount: 1120 },
    { date: 'Pt', amount: 1890 },
    { date: 'Sob', amount: 2100 },
    { date: 'Ndz', amount: 890 }
  ]
}

type TabType = 'overview' | 'orders' | 'messages'

export function AdminPanel({ onBack }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">Nowe</span>
      case 'processing':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400">W realizacji</span>
      case 'completed':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">Zrealizowane</span>
      case 'cancelled':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400">Anulowane</span>
      default:
        return null
    }
  }

  const maxSale = Math.max(...stats.recentSales.map(s => s.amount))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease }}
      className="min-h-screen pt-20 pb-32 bg-black"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            onClick={onBack}
            className="flex items-center gap-2 text-white/60 hover:text-brand-gold transition-colors group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs uppercase tracking-widest">Powrót</span>
          </motion.button>
          
          <motion.h1
            className="font-[family-name:var(--font-heading)] font-bold text-2xl md:text-3xl text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            Panel <span className="text-brand-gold">Administratora</span>
          </motion.h1>
        </div>

        {/* Tabs */}
        <motion.div
          className="flex gap-2 mb-8 border-b border-white/10 pb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.1 }}
        >
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'overview' 
                ? 'bg-brand-gold text-black' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="text-sm font-medium">Przegląd</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'orders' 
                ? 'bg-brand-gold text-black' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Package className="w-4 h-4" />
            <span className="text-sm font-medium">Zamówienia</span>
            {stats.newOrders > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                {stats.newOrders}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'messages' 
                ? 'bg-brand-gold text-black' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium">Wiadomości</span>
            {stats.newMessages > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                {stats.newMessages}
              </span>
            )}
          </button>
        </motion.div>

        {/* Content */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-brand-gold/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-brand-gold" />
                  </div>
                  <span className="text-white/40 text-xs uppercase tracking-wider">Przychód</span>
                </div>
                <p className="font-[family-name:var(--font-heading)] font-bold text-2xl text-white">
                  {stats.totalRevenue.toLocaleString('pl-PL')} <span className="text-sm text-white/40">PLN</span>
                </p>
              </div>
              
              <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-white/40 text-xs uppercase tracking-wider">Zamówienia</span>
                </div>
                <p className="font-[family-name:var(--font-heading)] font-bold text-2xl text-white">
                  {stats.totalOrders}
                </p>
              </div>
              
              <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <span className="text-white/40 text-xs uppercase tracking-wider">Zrealizowane</span>
                </div>
                <p className="font-[family-name:var(--font-heading)] font-bold text-2xl text-white">
                  {stats.completedOrders}
                </p>
              </div>
              
              <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-400" />
                  </div>
                  <span className="text-white/40 text-xs uppercase tracking-wider">W realizacji</span>
                </div>
                <p className="font-[family-name:var(--font-heading)] font-bold text-2xl text-white">
                  {stats.pendingOrders}
                </p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Chart */}
              <div className="bg-white/[0.02] border border-white/10 rounded-lg p-6">
                <h3 className="font-[family-name:var(--font-heading)] font-bold text-lg text-white mb-6">
                  Sprzedaż (ostatni tydzień)
                </h3>
                <div className="flex items-end justify-between h-40 gap-2">
                  {stats.recentSales.map((sale, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 flex-1">
                      <div 
                        className="w-full bg-brand-gold/20 rounded-t transition-all hover:bg-brand-gold/40"
                        style={{ height: `${(sale.amount / maxSale) * 100}%` }}
                      />
                      <span className="text-xs text-white/40">{sale.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white/[0.02] border border-white/10 rounded-lg p-6">
                <h3 className="font-[family-name:var(--font-heading)] font-bold text-lg text-white mb-6">
                  Najpopularniejsze produkty
                </h3>
                <div className="space-y-4">
                  {stats.topProducts.map((product, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-brand-gold/20 text-brand-gold text-xs flex items-center justify-center font-bold">
                          {i + 1}
                        </span>
                        <span className="text-white/80 text-sm">{product.name}</span>
                      </div>
                      <span className="text-white/40 text-sm">{product.sold} szt.</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            {selectedOrder ? (
              // Order Details
              <div className="bg-white/[0.02] border border-white/10 rounded-lg p-6">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex items-center gap-2 text-white/60 hover:text-brand-gold transition-colors mb-6"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">Powrót do listy</span>
                </button>

                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="font-[family-name:var(--font-heading)] font-bold text-xl text-white mb-2">
                      Zamówienie {selectedOrder.id}
                    </h3>
                    <p className="text-white/40 text-sm">{selectedOrder.date}</p>
                  </div>
                  {getStatusBadge(selectedOrder.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-white/40 text-xs uppercase tracking-wider mb-3">Dane klienta</h4>
                    <div className="space-y-2">
                      <p className="text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-brand-gold/60" />
                        {selectedOrder.customer}
                      </p>
                      <p className="text-white/60 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-brand-gold/60" />
                        {selectedOrder.email}
                      </p>
                      <p className="text-white/60 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-brand-gold/60" />
                        {selectedOrder.phone}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white/40 text-xs uppercase tracking-wider mb-3">Produkty</h4>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-white/80">
                            {item.name} (rozm. {item.size}) x{item.quantity}
                          </span>
                          <span className="text-white/60">{item.price * item.quantity} PLN</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                  <span className="text-white/40 text-sm uppercase tracking-wider">Suma</span>
                  <span className="font-[family-name:var(--font-heading)] font-bold text-2xl text-brand-gold">
                    {selectedOrder.total} PLN
                  </span>
                </div>

                <div className="flex gap-3 mt-6">
                  <button className="btn-primary">Oznacz jako zrealizowane</button>
                  <button className="btn-secondary">Anuluj zamówienie</button>
                </div>
              </div>
            ) : (
              // Orders List
              <div className="bg-white/[0.02] border border-white/10 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-white/40 text-xs uppercase tracking-wider p-4">ID</th>
                      <th className="text-left text-white/40 text-xs uppercase tracking-wider p-4">Klient</th>
                      <th className="text-left text-white/40 text-xs uppercase tracking-wider p-4 hidden md:table-cell">Data</th>
                      <th className="text-left text-white/40 text-xs uppercase tracking-wider p-4">Suma</th>
                      <th className="text-left text-white/40 text-xs uppercase tracking-wider p-4">Status</th>
                      <th className="text-left text-white/40 text-xs uppercase tracking-wider p-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockOrders.map((order) => (
                      <tr 
                        key={order.id} 
                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="p-4 text-white font-medium">{order.id}</td>
                        <td className="p-4 text-white/80">{order.customer}</td>
                        <td className="p-4 text-white/40 hidden md:table-cell">{order.date}</td>
                        <td className="p-4 text-white font-medium">{order.total} PLN</td>
                        <td className="p-4">{getStatusBadge(order.status)}</td>
                        <td className="p-4">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4 text-white/40 hover:text-brand-gold" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'messages' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="space-y-4"
          >
            {mockMessages.map((msg) => (
              <div 
                key={msg.id}
                className={`bg-white/[0.02] border rounded-lg p-6 ${
                  msg.read ? 'border-white/10' : 'border-brand-gold/30'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-[family-name:var(--font-heading)] font-bold text-white">
                        {msg.name}
                      </h3>
                      {!msg.read && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-brand-gold/20 text-brand-gold">
                          Nowa
                        </span>
                      )}
                    </div>
                    <p className="text-white/40 text-sm">{msg.email}</p>
                  </div>
                  <span className="text-white/30 text-xs">{msg.date}</span>
                </div>
                <h4 className="text-brand-gold/80 text-sm font-medium mb-2">{msg.subject}</h4>
                <p className="text-white/60 text-sm leading-relaxed">{msg.message}</p>
                <div className="flex gap-3 mt-4">
                  <button className="btn-primary text-sm py-2">Odpowiedz</button>
                  <button className="btn-secondary text-sm py-2">Oznacz jako przeczytane</button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
