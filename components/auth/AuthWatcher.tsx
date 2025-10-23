"use client"

import { useEffect } from 'react'
import { initAuthExpiryWatcher, clearAuthExpiryWatcher, getUserRole, logout } from '@/lib/auth'

export default function AuthWatcher() {
  useEffect(() => {
    // Define onExpire behavior: show toast, logout and redirect to sign-in for current role or root
    const onExpire = () => {
      try {
        // Dispatch a global toast event so the GlobalToastHost can display the message
        window.dispatchEvent(new CustomEvent('fcms:toast', { detail: { message: 'Session expired — please sign in again', type: 'info', duration: 5000 } }))
      } catch {}
      try { logout() } catch {}
      const signinPath = process.env.NEXT_PUBLIC_SIGNIN_PATH || '/'
      try { window.location.replace(signinPath) } catch { window.location.replace('/') }
    }

    initAuthExpiryWatcher(onExpire)

    return () => {
      clearAuthExpiryWatcher()
    }
  }, [])

  return null
}
