import { motion } from 'framer-motion'
import { useState } from 'react'
import { Lock, User, AlertCircle, Loader2 } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

interface AdminLoginProps {
  onLogin: () => void
  onBack: () => void
}

export function AdminLogin({ onLogin, onBack }: AdminLoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok && data.user?.role === 'ADMIN') {
        localStorage.setItem('adminToken', data.accessToken)
        onLogin()
      } else if (response.ok) {
        setError('Brak uprawnień administratora')
      } else {
        setError(data.message || 'Nieprawidłowy email lub hasło')
      }
    } catch (err) {
      setError('Błąd połączenia z serwerem')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease }}
      className="min-h-screen flex items-center justify-center bg-black px-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease }}
            className="inline-block mb-4"
          >
            <img
              src="/images/logo.png"
              alt="Acro Clinic"
              className="w-20 h-20 object-contain mx-auto"
              style={{ filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.4))' }}
            />
          </motion.div>
          <h1 className="font-[family-name:var(--font-heading)] font-bold text-2xl text-white mb-2">
            Panel <span className="text-brand-gold">Administratora</span>
          </h1>
          <p className="text-white/40 text-sm">Zaloguj się, aby kontynuować</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/[0.02] border border-white/10 rounded-lg p-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-red-400 text-sm mb-6 p-3 bg-red-500/10 rounded-lg border border-red-500/20"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}

          <div className="mb-6">
            <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
              Email
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-11 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-gold/50 transition-colors"
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
              Hasło
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-11 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-gold/50 transition-colors"
                placeholder="••••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary w-full mb-4 flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Logowanie...
              </>
            ) : (
              'Zaloguj się'
            )}
          </button>

          <button
            type="button"
            onClick={onBack}
            className="w-full text-center text-white/40 hover:text-white text-sm transition-colors"
          >
            Powrót do sklepu
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}
