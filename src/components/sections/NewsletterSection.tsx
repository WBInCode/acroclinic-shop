import { useState } from 'react'
import { Send, CheckCircle, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { newsletterApi } from '@/lib/api'

const transition = { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const }

export function NewsletterSection() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSubscribed, setIsSubscribed] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email.trim()) {
            toast.error('Podaj adres email')
            return
        }

        setIsLoading(true)
        try {
            const result = await newsletterApi.subscribe(email)
            if (result.success) {
                setIsSubscribed(true)
                toast.success(result.message)
            }
        } catch (error: any) {
            toast.error(error.message || 'Wystąpił błąd. Spróbuj ponownie.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <motion.section
            className="container mx-auto px-6 py-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={transition}
        >
            <div className="max-w-2xl mx-auto">
                {/* Glassmorphism card */}
                <motion.div
                    className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm"
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ ...transition, delay: 0.1 }}
                >
                    {/* Subtle gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/[0.03] via-transparent to-brand-gold/[0.02]" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/[0.04] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative px-8 py-12 md:px-14 md:py-16">
                        {/* Icon */}
                        <motion.div
                            className="flex justify-center mb-6"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ ...transition, delay: 0.2 }}
                        >
                            <div className="w-12 h-12 rounded-full border border-brand-gold/20 flex items-center justify-center bg-brand-gold/[0.05]">
                                <Sparkles className="w-5 h-5 text-brand-gold/70" />
                            </div>
                        </motion.div>

                        {/* Header */}
                        <motion.span
                            className="text-xs tracking-[0.4em] uppercase text-brand-gold/50 block mb-4 text-center"
                            style={{ fontFamily: "'Lato', sans-serif" }}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ ...transition, delay: 0.25 }}
                        >
                            Newsletter
                        </motion.span>

                        <motion.h2
                            className="text-3xl md:text-4xl text-white font-light mb-4 text-center"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ ...transition, delay: 0.3 }}
                        >
                            Bądź na <span className="text-brand-gold italic">bieżąco</span>
                        </motion.h2>

                        {/* Divider */}
                        <motion.div
                            className="flex items-center justify-center gap-4 mb-6"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ ...transition, delay: 0.35 }}
                        >
                            <div className="w-12 h-px bg-gradient-to-r from-transparent to-brand-gold/30" />
                            <div className="w-1.5 h-1.5 rotate-45 border border-brand-gold/40" />
                            <div className="w-12 h-px bg-gradient-to-l from-transparent to-brand-gold/30" />
                        </motion.div>

                        <motion.p
                            className="text-white/40 text-sm mb-10 font-light tracking-wide text-center max-w-md mx-auto"
                            style={{ fontFamily: "'Lato', sans-serif" }}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ ...transition, delay: 0.4 }}
                        >
                            Zapisz się, aby otrzymywać informacje o nowościach, ekskluzywnych ofertach i premierach produktów
                        </motion.p>

                        {/* Form / Success */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ ...transition, delay: 0.5 }}
                        >
                            {isSubscribed ? (
                                <motion.div
                                    className="flex flex-col items-center gap-4 py-4"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div className="w-14 h-14 rounded-full border border-green-500/30 flex items-center justify-center bg-green-500/[0.08]">
                                        <CheckCircle className="w-7 h-7 text-green-400" />
                                    </div>
                                    <p
                                        className="text-white/70 text-sm text-center"
                                        style={{ fontFamily: "'Lato', sans-serif" }}
                                    >
                                        Dziękujemy! Sprawdź swoją skrzynkę email,
                                        <br />aby potwierdzić subskrypcję.
                                    </p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                                    <div className="flex-1 relative">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Twój adres email"
                                            className="w-full px-5 py-4 bg-white/[0.03] text-white text-sm border border-white/[0.08] rounded-full outline-none transition-all duration-300 focus:border-brand-gold/40 focus:bg-brand-gold/[0.02] placeholder:text-white/25"
                                            style={{ fontFamily: "'Lato', sans-serif" }}
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Wysyłanie...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Send className="w-4 h-4" />
                                                Zapisz się
                                            </span>
                                        )}
                                    </button>
                                </form>
                            )}
                        </motion.div>

                        {/* Privacy note */}
                        {!isSubscribed && (
                            <motion.p
                                className="text-white/20 text-[11px] text-center mt-5 tracking-wide"
                                style={{ fontFamily: "'Lato', sans-serif" }}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ ...transition, delay: 0.6 }}
                            >
                                Możesz się wypisać w dowolnym momencie. Szanujemy Twoją prywatność.
                            </motion.p>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.section>
    )
}
