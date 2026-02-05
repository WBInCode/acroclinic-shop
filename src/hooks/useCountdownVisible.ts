import { useState, useEffect } from 'react'

// Global state for countdown visibility
let countdownVisibleListeners: ((visible: boolean) => void)[] = []
let isCountdownVisible = true

export function setCountdownVisible(visible: boolean) {
  isCountdownVisible = visible
  countdownVisibleListeners.forEach(l => l(visible))
}

export function getInitialCountdownVisible() {
  if (typeof window !== 'undefined') {
    const dismissed = sessionStorage.getItem('countdownDismissed')
    isCountdownVisible = dismissed !== 'true'
  }
  return isCountdownVisible
}

export function useCountdownVisible() {
  const [visible, setVisible] = useState(isCountdownVisible)
  
  useEffect(() => {
    const listener = (v: boolean) => setVisible(v)
    countdownVisibleListeners.push(listener)
    return () => {
      countdownVisibleListeners = countdownVisibleListeners.filter(l => l !== listener)
    }
  }, [])
  
  return visible
}
