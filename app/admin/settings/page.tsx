'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminSettingsPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to profile page as settings are now merged there
    router.replace('/admin/profile')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600">Redirecting to Profile & Settings...</p>
    </div>
  )
}