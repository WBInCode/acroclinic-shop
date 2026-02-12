import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X } from 'lucide-react'

const COOKIE_CONSENT_KEY = 'acroclinic_cookie_consent'

interface CookieConsentBannerProps {
    onOpenPrivacyPolicy: () => void
}

export function CookieConsentBanner({ onOpenPrivacyPolicy }: CookieConsentBannerProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Check if user already gave consent
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
        if (!consent) {
            // Delay showing the banner slightly so it doesn't flash on load
            const timer = setTimeout(() => setIsVisible(true), 1500)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted')
        setIsVisible(false)
    }

    const handleDecline = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'declined')
        setIsVisible(false)
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
                >
                    <div className="max-w-4xl mx-auto bg-[#111] border border-white/10 rounded-lg shadow-2xl shadow-black/50 backdrop-blur-xl">
                        <div className="p-5 md:p-6">
                            {/* Close button */}
                            <button
                                onClick={handleDecline}
                                className="absolute top-3 right-3 text-white/30 hover:text-white/60 transition-colors"
                                aria-label="Zamknij"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                                {/* Icon + Text */}
                                <div className="flex items-start gap-3 flex-1">
                                    <Cookie className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-white/80 text-sm font-[family-name:var(--font-body)] leading-relaxed">
                                            Używamy plików cookies, aby zapewnić prawidłowe działanie sklepu, obsługę koszyka i logowania.{' '}
                                            <button
                                                onClick={onOpenPrivacyPolicy}
                                                className="text-brand-gold hover:underline inline cursor-pointer"
                                            >
                                                Polityka prywatności
                                            </button>
                                        </p>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex items-center gap-3 flex-shrink-0 w-full md:w-auto">
                                    <button
                                        onClick={handleDecline}
                                        className="flex-1 md:flex-none px-5 py-2.5 text-white/50 hover:text-white/80 text-xs uppercase tracking-wider font-[family-name:var(--font-body)] transition-colors border border-white/10 hover:border-white/20 cursor-pointer"
                                    >
                                        Odrzuć
                                    </button>
                                    <button
                                        onClick={handleAccept}
                                        className="flex-1 md:flex-none px-5 py-2.5 bg-brand-gold hover:bg-brand-gold/80 text-black text-xs uppercase tracking-wider font-bold font-[family-name:var(--font-body)] transition-colors cursor-pointer"
                                    >
                                        Akceptuję
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
