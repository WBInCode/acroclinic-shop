import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { authApi, type User } from '@/lib/api'
import { ArrowLeft, Loader2, LogOut, Mail, Lock, User as UserIcon, UserPlus, X } from 'lucide-react'
import { toast } from 'sonner'

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  onAuthSuccess: (user: User) => void
  onLogout: () => Promise<void>
}

type AuthMode = 'login' | 'register' | 'reset-request' | 'reset-confirm'

const passwordHint = 'Min. 8 znaków, 1 wielka litera i 1 cyfra.'

export function AuthDialog({ open, onOpenChange, user, onAuthSuccess, onLogout }: AuthDialogProps) {
  const [mode, setMode] = useState<AuthMode>('login')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  useEffect(() => {
    if (!open) {
      setError(null)
      setIsLoading(false)
    }
  }, [open])

  useEffect(() => {
    if (!open || user) return
    const url = new URL(window.location.href)
    const tokenFromUrl = url.searchParams.get('resetToken')
    if (tokenFromUrl) {
      setResetToken(tokenFromUrl)
      setMode('reset-confirm')
    }
  }, [open, user])

  const handleLogin = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await authApi.login(email, password)
      onAuthSuccess(result.user)
      toast.success('Zalogowano pomyślnie')
      onOpenChange(false)
    } catch (err: any) {
      setError(err?.message || 'Nie udało się zalogować')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Hasła muszą być takie same')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await authApi.register({
        email,
        password,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      })
      onAuthSuccess(result.user)
      toast.success('Konto zostało utworzone')
      onOpenChange(false)
    } catch (err: any) {
      setError(err?.message || 'Nie udało się zarejestrować')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await onLogout()
      toast.success('Wylogowano')
      onOpenChange(false)
    } catch (err: any) {
      setError(err?.message || 'Nie udało się wylogować')
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await authApi.forgotPassword(email)
      toast.success(result.message || 'Sprawdź skrzynkę email')
      setMode('reset-confirm')
    } catch (err: any) {
      setError(err?.message || 'Nie udało się wysłać linku')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setError('Hasła muszą być takie same')
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const result = await authApi.resetPassword(resetToken, password)
      toast.success(result.message || 'Hasło zostało zresetowane')
      setMode('login')
      setPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setError(err?.message || 'Nie udało się zresetować hasła')
    } finally {
      setIsLoading(false)
    }
  }

  const isLogin = mode === 'login'
  const isRegister = mode === 'register'
  const isResetRequest = mode === 'reset-request'
  const isResetConfirm = mode === 'reset-confirm'

  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => onOpenChange(false)}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        <motion.div
          className="relative border-white/10 bg-black/95 text-white max-w-md w-full rounded-lg p-6"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {user ? (
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">Twoje konto</h2>
              <p className="text-white/60 text-sm mb-6">
                Jesteś zalogowany jako <span className="text-white">{user.email}</span>
              </p>
              <div className="flex flex-col gap-4">
                <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-sm text-white/70">Imię i nazwisko</p>
                  <p className="text-white">
                    {user.firstName || user.lastName ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '—'}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={handleLogout}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                  Wyloguj
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {isLogin
                    ? 'Zaloguj się'
                    : isRegister
                    ? 'Załóż konto'
                    : isResetRequest
                    ? 'Reset hasła'
                    : 'Ustaw nowe hasło'}
                </h2>
                <p className="text-white/60 text-sm mt-1">
                  {isLogin
                    ? 'Zaloguj się, aby składać zamówienia.'
                    : isRegister
                    ? 'Zarejestruj się i kupuj szybciej.'
                    : isResetRequest
                    ? 'Wyślemy link do ustawienia nowego hasła.'
                    : 'Wprowadź token z maila i nowe hasło.'}
                </p>
              </div>

            {(isLogin || isRegister) && (
              <div className="flex items-center gap-2 rounded-full bg-white/5 p-1">
                <button
                  className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition ${isLogin ? 'bg-white text-black' : 'text-white/70 hover:text-white'}`}
                  onClick={() => setMode('login')}
                >
                  Logowanie
                </button>
                <button
                  className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition ${isRegister ? 'bg-white text-black' : 'text-white/70 hover:text-white'}`}
                  onClick={() => setMode('register')}
                >
                  Rejestracja
                </button>
              </div>
            )}

            {(isResetRequest || isResetConfirm) && (
              <button
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/50 hover:text-white"
                onClick={() => setMode('login')}
              >
                <ArrowLeft className="h-3 w-3" />
                Wróć do logowania
              </button>
            )}

            {error && (
              <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </div>
            )}

            <form 
              onSubmit={(e) => {
                e.preventDefault()
                if (isLogin) handleLogin()
                else if (isRegister) handleRegister()
                else if (isResetRequest) handleForgotPassword()
                else if (isResetConfirm) handleResetPassword()
              }}
              className="space-y-3"
            >
              {isRegister && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-white/50">Imię</label>
                    <div className="relative">
                      <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                      <Input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Anna"
                        className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-white/50">Nazwisko</label>
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Kowalska"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>
                </div>
              )}

              {(isLogin || isRegister || isResetRequest) && (
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-white/50">Email</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="twoj@email.pl"
                      className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>
                </div>
              )}

              {(isLogin || isRegister || isResetConfirm) && (
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-white/50">Hasło</label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>
                  {(isRegister || isResetConfirm) && <p className="text-xs text-white/40">{passwordHint}</p>}
                </div>
              )}

              {(isRegister || isResetConfirm) && (
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-white/50">
                    {isResetConfirm ? 'Powtórz nowe hasło' : 'Powtórz hasło'}
                  </label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>
              )}

              {isResetConfirm && (
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-white/50">Token resetu</label>
                  <Input
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    placeholder="Wklej token z maila"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={
                  isLoading ||
                  (isLogin && (!email || !password)) ||
                  (isRegister && (!email || !password)) ||
                  (isResetRequest && !email) ||
                  (isResetConfirm && (!resetToken || !password))
                }
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isLogin ? (
                  <UserIcon className="h-4 w-4" />
                ) : isRegister ? (
                  <UserPlus className="h-4 w-4" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                {isLogin
                  ? 'Zaloguj się'
                  : isRegister
                  ? 'Utwórz konto'
                  : isResetRequest
                  ? 'Wyślij link resetu'
                  : 'Ustaw nowe hasło'}
              </Button>
            </form>

            {isLogin && (
              <button
                className="text-xs uppercase tracking-widest text-white/50 hover:text-white"
                onClick={() => setMode('reset-request')}
              >
                Nie pamiętasz hasła?
              </button>
            )}
          </div>
        )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
