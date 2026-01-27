import { motion } from 'framer-motion'
import { useState } from 'react'
import { Lock, User, AlertCircle } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

interface AdminLoginProps {
  onLogin: () => void
  onBack: () => void
}

// Prosty login (w produkcji użyj prawdziwej autoryzacji!)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'acroclinic2026'
}

export function AdminLogin({ onLogin, onBack }: AdminLoginProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      onLogin()
    } else {
      setError('Nieprawidłowa nazwa użytkownika lub hasło')
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
              Nazwa użytkownika
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-11 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-gold/50 transition-colors"
                placeholder="admin"
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

          <button type="submit" className="btn-primary w-full mb-4">
            Zaloguj się
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
