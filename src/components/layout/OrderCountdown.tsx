import { useState, useEffect } from 'react'
import { Clock, Package, Truck, CalendarClock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

/**
 * Oblicza deadline bieżącej tury i numer tury.
 * Tura 1: dni 1-14 → deadline = 14. dnia miesiąca o 23:59:59
 * Tura 2: dni 15-koniec miesiąca → deadline = ostatni dzień miesiąca o 23:59:59
 */
export function getOrderDeadline(now: Date = new Date()) {
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  const currentDay = now.getDate()

  let targetDate: Date
  let round: 1 | 2

  if (currentDay <= 14) {
    // Tura 1: do 14. dnia bieżącego miesiąca
    round = 1
    targetDate = new Date(currentYear, currentMonth, 14, 23, 59, 59)
  } else {
    // Tura 2: do ostatniego dnia bieżącego miesiąca
    round = 2
    const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate()
    targetDate = new Date(currentYear, currentMonth, lastDay, 23, 59, 59)
  }

  return { targetDate, round }
}

/**
 * Oblicza przewidywaną datę dostawy odzieży na bazie tury.
 * Po deadline danej tury + 10 dni produkcja + 3 dni dostawa = 13 dni.
 */
export function getEstimatedClothingShipDate(now: Date = new Date()): Date {
  const { targetDate } = getOrderDeadline(now)
  const shipDate = new Date(targetDate)
  shipDate.setDate(shipDate.getDate() + 13) // 10 dni produkcja + 3 dni dostawa
  return shipDate
}

/**
 * Oblicza przewidywaną datę dostawy akcesoriów (1-3 dni robocze).
 */
export function getEstimatedAccessoriesDelivery(now: Date = new Date()): string {
  const minDays = 1
  const maxDays = 3
  const minDate = new Date(now)
  minDate.setDate(minDate.getDate() + minDays)
  const maxDate = new Date(now)
  maxDate.setDate(maxDate.getDate() + maxDays)

  const fmt = (d: Date) => d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' })
  return `${fmt(minDate)} – ${fmt(maxDate)}`
}

export function OrderCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [currentRound, setCurrentRound] = useState<1 | 2>(1)
  const [deadlineDate, setDeadlineDate] = useState<Date>(new Date())
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const { targetDate, round } = getOrderDeadline(now)

      setCurrentRound(round)
      setDeadlineDate(targetDate)

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

  const estimatedClothingShip = getEstimatedClothingShipDate()
  const estimatedAccessories = getEstimatedAccessoriesDelivery()
  const formatDate = (d: Date) => d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })

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
                {currentRound} Tura - Czas do zamknięcia listy zamówień
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
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
                        Szyta na zamówienie. Zbieramy zamówienia w turach co 14 dni.
                        Bieżąca tura kończy się <span className="text-brand-gold/70">{formatDate(deadlineDate)}</span>.
                        Produkcja: 10 dni + dostawa: 3 dni.
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
                        Wysyłane natychmiast po złożeniu zamówienia (1-3 dni robocze).
                      </p>
                    </div>
                  </div>

                  {/* Estimated delivery */}
                  <div className="flex items-start gap-4 p-5 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
                    <CalendarClock className="w-5 h-5 text-brand-gold/60 shrink-0 mt-0.5" />
                    <div>
                      <h4
                        className="text-white/80 text-sm mb-2"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        Przewidywana dostawa odzieży
                      </h4>
                      <p
                        className="text-white/40 text-xs leading-relaxed"
                        style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
                      >
                        Koniec listy zamówień: <span className="text-brand-gold/70">{formatDate(deadlineDate)}</span>.<br />
                        Produkcja (10 dni) + dostawa (3 dni) = dostawa ok. <span className="text-brand-gold/70">{formatDate(estimatedClothingShip)}</span>.
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
