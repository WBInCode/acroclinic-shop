import { motion } from 'framer-motion'
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

const ease = [0.22, 1, 0.36, 1] as const

interface ContactPageProps {
  onBack: () => void
}

export function ContactPage({ onBack }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Wiadomość została wysłana!', {
      description: 'Odpowiemy najszybciej jak to możliwe.'
    })
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'kontakt@acroclinic.pl',
      href: 'mailto:kontakt@acroclinic.pl'
    },
    {
      icon: Phone,
      title: 'Telefon',
      value: '+48 123 456 789',
      href: 'tel:+48123456789'
    },
    {
      icon: MapPin,
      title: 'Adres',
      value: 'ul. Sportowa 15, Warszawa',
      href: '#'
    },
    {
      icon: Clock,
      title: 'Godziny pracy',
      value: 'Pon-Pt: 9:00-17:00',
      href: '#'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease }}
      className="min-h-screen pt-28 pb-32"
    >
      <div className="container mx-auto px-4">
        {/* Back button */}
        <motion.button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-white/60 hover:text-brand-gold transition-colors duration-300 mb-12 group cursor-pointer"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-[family-name:var(--font-body)] text-xs uppercase tracking-widest">Powrót</span>
        </motion.button>

        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <span className="text-xs uppercase tracking-[0.3em] text-brand-gold/60 font-[family-name:var(--font-body)] block mb-4">Skontaktuj się</span>
          <h1 className="font-[family-name:var(--font-heading)] font-bold text-4xl md:text-5xl text-white uppercase tracking-tight mb-6">
            <span className="text-brand-gold">Kontakt</span>
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
          >
            <h2 className="font-[family-name:var(--font-heading)] font-bold text-xl text-white mb-8">
              Napisz do nas
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/40 text-xs uppercase tracking-wider mb-2 font-[family-name:var(--font-body)]">
                    Imię i nazwisko
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/10 text-white font-[family-name:var(--font-body)] focus:border-brand-gold/50 focus:outline-none transition-colors"
                    placeholder="Jan Kowalski"
                  />
                </div>
                <div>
                  <label className="block text-white/40 text-xs uppercase tracking-wider mb-2 font-[family-name:var(--font-body)]">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/10 text-white font-[family-name:var(--font-body)] focus:border-brand-gold/50 focus:outline-none transition-colors"
                    placeholder="jan@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-white/40 text-xs uppercase tracking-wider mb-2 font-[family-name:var(--font-body)]">
                  Temat
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white/[0.02] border border-white/10 text-white font-[family-name:var(--font-body)] focus:border-brand-gold/50 focus:outline-none transition-colors"
                  placeholder="W czym możemy pomóc?"
                />
              </div>
              
              <div>
                <label className="block text-white/40 text-xs uppercase tracking-wider mb-2 font-[family-name:var(--font-body)]">
                  Wiadomość
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-white/[0.02] border border-white/10 text-white font-[family-name:var(--font-body)] focus:border-brand-gold/50 focus:outline-none transition-colors resize-none"
                  placeholder="Twoja wiadomość..."
                />
              </div>
              
              <button type="submit" className="btn-primary">
                <Send className="w-4 h-4" />
                Wyślij wiadomość
              </button>
            </form>
          </motion.div>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.3 }}
          >
            <h2 className="font-[family-name:var(--font-heading)] font-bold text-xl text-white mb-8">
              Dane kontaktowe
            </h2>
            
            <div className="space-y-6 mb-12">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={info.title}
                  href={info.href}
                  className="flex items-start gap-4 p-4 bg-white/[0.02] border border-white/10 hover:border-brand-gold/30 transition-all duration-300 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease, delay: 0.4 + index * 0.1 }}
                >
                  <div className="w-12 h-12 flex items-center justify-center border border-brand-gold/30 group-hover:bg-brand-gold/10 transition-colors duration-300">
                    <info.icon className="w-5 h-5 text-brand-gold" />
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-heading)] font-bold text-white text-sm uppercase tracking-wider mb-1">
                      {info.title}
                    </h3>
                    <p className="text-white/50 font-[family-name:var(--font-body)]">
                      {info.value}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="aspect-video bg-white/[0.02] border border-white/10 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-brand-gold/40 mx-auto mb-3" />
                <p className="text-white/30 text-sm font-[family-name:var(--font-body)]">Mapa lokalizacji</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
