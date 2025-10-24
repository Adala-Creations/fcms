'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function TenantSettingsPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/tenant/profile')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600">Redirecting to Profile & Settings...</p>
    </div>
  )
}
