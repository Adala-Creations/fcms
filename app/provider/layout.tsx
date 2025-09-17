'use client'

import { usePathname } from 'next/navigation'
import Sidebar from '@/components/layout/sidebar'

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAuthPage = pathname?.includes('/signin') || pathname?.includes('/signup') || pathname?.includes('/forgot-password')

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <Sidebar userRole="service-provider" />
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
