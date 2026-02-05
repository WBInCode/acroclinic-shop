import { useState, useEffect } from 'react'
import { Clock, Package, Truck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function OrderCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()
      const currentDay = now.getDate()

      // Target is 11th of current month, or 11th of next month if we're past the 11th
      let targetDate: Date
      if (currentDay < 11) {
        // Still before the 11th this month
        targetDate = new Date(currentYear, currentMonth, 11, 23, 59, 59)
      } else {
        // Past the 11th, target next month
        targetDate = new Date(currentYear, currentMonth + 1, 11, 23, 59, 59)
      }

      const difference = targetDate.getTime() - now.getTime()

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((difference / 1000 / 60) % 60)
        const seconds = Math.floor((difference / 1000) % 60)

        setTimeLeft({ days, hours, minutes, seconds })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatNumber = (num: number) => num.toString().padStart(2, '0')

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-brand-gold/20 via-brand-gold/10 to-brand-gold/20 border-b border-brand-gold/30 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center py-2 md:py-3">
          {/* Main countdown section */}
          <div className="flex-1 flex items-center justify-center gap-2 md:gap-6">
            <div className="flex items-center gap-2 text-brand-gold">
              <Clock className="w-4 h-4 md:w-5 md:h-5 animate-pulse" />
              <span className="text-[10px] md:text-xs uppercase tracking-wider font-bold hidden sm:inline">
                Zamówienia na odzież do:
              </span>
              <span className="text-[10px] md:text-xs uppercase tracking-wider font-bold sm:hidden">
                Do zamknięcia:
              </span>
            </div>

            {/* Timer display */}
            <div className="flex items-center gap-1 md:gap-2">
              <div className="flex flex-col items-center">
                <span className="font-mono text-lg md:text-2xl font-bold text-white tabular-nums">
                  {formatNumber(timeLeft.days)}
                </span>
                <span className="text-[8px] md:text-[10px] text-white/60 uppercase">dni</span>
              </div>
              <span className="text-brand-gold text-lg md:text-2xl font-bold">:</span>
              <div className="flex flex-col items-center">
                <span className="font-mono text-lg md:text-2xl font-bold text-white tabular-nums">
                  {formatNumber(timeLeft.hours)}
                </span>
                <span className="text-[8px] md:text-[10px] text-white/60 uppercase">godz</span>
              </div>
              <span className="text-brand-gold text-lg md:text-2xl font-bold">:</span>
              <div className="flex flex-col items-center">
                <span className="font-mono text-lg md:text-2xl font-bold text-white tabular-nums">
                  {formatNumber(timeLeft.minutes)}
                </span>
                <span className="text-[8px] md:text-[10px] text-white/60 uppercase">min</span>
              </div>
              <span className="text-brand-gold text-lg md:text-2xl font-bold hidden md:inline">:</span>
              <div className="hidden md:flex flex-col items-center">
                <span className="font-mono text-lg md:text-2xl font-bold text-white tabular-nums">
                  {formatNumber(timeLeft.seconds)}
                </span>
                <span className="text-[8px] md:text-[10px] text-white/60 uppercase">sek</span>
              </div>
            </div>

            {/* Info button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-2 text-[10px] md:text-xs text-brand-gold/80 hover:text-brand-gold underline underline-offset-2 transition-colors"
            >
              {isExpanded ? 'Zwiń' : 'Więcej info'}
            </button>
          </div>
        </div>

        {/* Expanded info section */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pb-4 pt-2 border-t border-brand-gold/20">
                <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                  {/* Clothing info */}
                  <div className="flex items-start gap-3 bg-white/5 rounded-lg p-4">
                    <div className="p-2 bg-brand-gold/20 rounded-lg shrink-0">
                      <Package className="w-5 h-5 text-brand-gold" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm mb-1">Odzież sportowa - szycie na zamówienie</h4>
                      <p className="text-white/60 text-xs leading-relaxed">
                        Nasza odzież jest <span className="text-brand-gold font-semibold">szyta specjalnie na zamówienie</span> z możliwością personalizacji. 
                        Zamówienia zbieramy do <span className="text-brand-gold font-semibold">11 dnia każdego miesiąca</span>, 
                        po czym wszystkie są przekazywane do produkcji. 
                        Czas realizacji: około 2 tygodnie od daty produkcji.
                      </p>
                    </div>
                  </div>

                  {/* Accessories info */}
                  <div className="flex items-start gap-3 bg-white/5 rounded-lg p-4">
                    <div className="p-2 bg-green-500/20 rounded-lg shrink-0">
                      <Truck className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm mb-1">Akcesoria</h4>
                      <p className="text-white/60 text-xs leading-relaxed">
                        Akcesoria (kostki do jogi, gumy, itp.) są <span className="text-green-400 font-semibold">wysyłane od razu</span> po złożeniu zamówienia. 
                        Standardowy czas dostawy: 1-3 dni robocze.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
