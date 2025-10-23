import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthWatcher from '@/components/auth/AuthWatcher'
import GlobalToastHost from '@/components/ui/GlobalToastHost'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FCMS - Flat/Complex Management System',
  description: 'A comprehensive management system for residential complexes and flats',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthWatcher />
        <GlobalToastHost />
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
}
