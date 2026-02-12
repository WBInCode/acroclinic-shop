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

      // Target is 14th of current month, or 14th of next month if we're past the 14th
      let targetDate: Date
      if (currentDay < 14) {
        // Still before the 14th this month
        targetDate = new Date(currentYear, currentMonth, 14, 23, 59, 59)
      } else {
        // Past the 14th, target next month
        targetDate = new Date(currentYear, currentMonth + 1, 14, 23, 59, 59)
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
    <div className="fixed top-0 left-0 right-0 z-[60] bg-[#0a0a0a]/95 backdrop-blur-md border-b border-brand-gold/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center py-3 md:py-4">
          {/* Main countdown section */}
          <div className="flex-1 flex items-center justify-center gap-3 md:gap-8">
            <div className="flex items-center gap-2 text-brand-gold/70">
              <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span
                className="text-[10px] md:text-xs tracking-[0.15em] uppercase hidden sm:inline"
                style={{ fontFamily: "'Lato', sans-serif", fontWeight: 400 }}
              >
                Do zamówienia
              </span>
            </div>

            {/* Timer display - elegancki */}
            <div className="flex items-center gap-3 md:gap-4">
              <div className="flex flex-col items-center">
                <span
                  className="text-xl md:text-2xl text-white font-light tabular-nums"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {formatNumber(timeLeft.days)}
                </span>
                <span
                  className="text-[8px] md:text-[9px] text-white/30 uppercase tracking-wider"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  dni
                </span>
              </div>
              <span className="text-brand-gold/40 text-lg">:</span>
              <div className="flex flex-col items-center">
                <span
                  className="text-xl md:text-2xl text-white font-light tabular-nums"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {formatNumber(timeLeft.hours)}
                </span>
                <span
                  className="text-[8px] md:text-[9px] text-white/30 uppercase tracking-wider"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  godz
                </span>
              </div>
              <span className="text-brand-gold/40 text-lg">:</span>
              <div className="flex flex-col items-center">
                <span
                  className="text-xl md:text-2xl text-white font-light tabular-nums"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {formatNumber(timeLeft.minutes)}
                </span>
                <span
                  className="text-[8px] md:text-[9px] text-white/30 uppercase tracking-wider"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  min
                </span>
              </div>
              <span className="text-brand-gold/40 text-lg hidden md:inline">:</span>
              <div className="hidden md:flex flex-col items-center">
                <span
                  className="text-xl md:text-2xl text-white font-light tabular-nums"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {formatNumber(timeLeft.seconds)}
                </span>
                <span
                  className="text-[8px] md:text-[9px] text-white/30 uppercase tracking-wider"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  sek
                </span>
              </div>
            </div>

            {/* Info button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-4 text-[10px] md:text-xs text-white/30 hover:text-brand-gold/70 transition-colors duration-300"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              {isExpanded ? 'Zwiń' : 'Info'}
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
              <div className="pb-6 pt-4 border-t border-white/[0.06]">
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {/* Clothing info */}
                  <div className="flex items-start gap-4 p-5 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
                    <Package className="w-5 h-5 text-brand-gold/60 shrink-0 mt-0.5" />
                    <div>
                      <h4
                        className="text-white/80 text-sm mb-2"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        Odzież sportowa
                      </h4>
                      <p
                        className="text-white/40 text-xs leading-relaxed"
                        style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
                      >
                        Szyta na zamówienie. Zbieramy do <span className="text-brand-gold/70">14 dnia każdego miesiąca</span>.
                        Realizacja: ~2 tygodnie.
                      </p>
                    </div>
                  </div>

                  {/* Accessories info */}
                  <div className="flex items-start gap-4 p-5 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
                    <Truck className="w-5 h-5 text-brand-gold/60 shrink-0 mt-0.5" />
                    <div>
                      <h4
                        className="text-white/80 text-sm mb-2"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        Akcesoria
                      </h4>
                      <p
                        className="text-white/40 text-xs leading-relaxed"
                        style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
                      >
                        Wysyłane natychmiast po złożeniu zamówienia. Dostawa: 1-3 dni robocze.
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

