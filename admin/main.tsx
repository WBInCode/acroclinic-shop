import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'sonner'
import { AdminLogin } from '../src/components/admin/AdminLogin'
import { AdminPanel } from '../src/components/admin/AdminPanel'
import './admin.css'

type AdminView = 'login' | 'panel'

function AdminApp() {
  const [currentView, setCurrentView] = useState<AdminView>('login')

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      setCurrentView('panel')
    }
  }, [])

  const handleLogin = () => {
    setCurrentView('panel')
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setCurrentView('login')
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {currentView === 'login' ? (
          <AdminLogin
            key="admin-login"
            onLogin={handleLogin}
            onBack={handleLogout}
          />
        ) : (
          <AdminPanel
            key="admin-panel"
            onBack={handleLogout}
          />
        )}
      </AnimatePresence>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#fff',
          },
        }}
      />
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdminApp />
  </StrictMode>,
)
