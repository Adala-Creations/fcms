'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminAccountRequest() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/admin/signup')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-xl font-semibold text-gray-900">Redirecting…</h1>
          <p className="text-sm text-gray-600 mt-2">Taking you to admin signup.</p>
        </div>
      </div>
    </div>
  )
}
