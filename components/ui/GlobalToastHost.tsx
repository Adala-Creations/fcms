"use client"

import { useEffect, useState } from 'react'
import { ToastContainer } from './toast'
import type { ToastType } from './toast'

interface InternalToast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

let idCounter = 0

export default function GlobalToastHost() {
  const [toasts, setToasts] = useState<InternalToast[]>([])

  useEffect(() => {
    function onToast(e: Event) {
      const detail = (e as CustomEvent).detail || {}
      const { message, type = 'info', duration = 4000 } = detail
      const id = `global-toast-${++idCounter}`
      setToasts((t) => [...t, { id, message, type, duration }])

      if (duration) {
        setTimeout(() => {
          setToasts((t) => t.filter(x => x.id !== id))
        }, duration)
      }
    }

    window.addEventListener('fcms:toast', onToast as EventListener)
    return () => window.removeEventListener('fcms:toast', onToast as EventListener)
  }, [])

  const handleDismiss = (id: string) => {
    setToasts((t) => t.filter(x => x.id !== id))
  }

  return <ToastContainer toasts={toasts} onDismiss={handleDismiss} />
}
