'use client'

import { Building2 } from 'lucide-react'
import Link from 'next/link'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
  role: string
}

export default function AuthLayout({ children, title, subtitle, role }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <Link href="/" className="flex items-center space-x-2">
            <Building2 className="h-10 w-10 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">FCMS</span>
          </Link>
        </div>
        
        {/* Title */}
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {title}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {subtitle}
        </p>
        
        {/* Role Badge */}
        <div className="mt-4 flex justify-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 capitalize">
            {role.replace('-', ' ')} Portal
          </span>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>

      {/* Back to Role Selection */}
      <div className="mt-6 text-center">
        <Link 
          href="/" 
          className="text-sm text-primary-600 hover:text-primary-500"
        >
          ← Back to Role Selection
        </Link>
      </div>
    </div>
  )
}
