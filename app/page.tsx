'use client'

import { useState } from 'react'
import { Building2, Users, Shield, Wrench, UserCheck, FileText } from 'lucide-react'
import Link from 'next/link'

const userRoles = [
  {
    id: 'admin',
    name: 'Admin/Committee',
    description: 'Full system access for property management',
    icon: Building2,
    color: 'bg-primary-600',
    href: '/admin/signin'
  },
  {
    id: 'owner',
    name: 'Property Owner',
    description: 'Manage your property and view financials',
    icon: Users,
    color: 'bg-success-600',
    href: '/owner/signin'
  },
  {
    id: 'tenant',
    name: 'Tenant',
    description: 'Pay rent, request services, manage visitors',
    icon: UserCheck,
    color: 'bg-warning-600',
    href: '/tenant/signin'
  },
  {
    id: 'service-provider',
    name: 'Service Provider',
    description: 'Manage service requests and upload receipts',
    icon: Wrench,
    color: 'bg-secondary-600',
    href: '/provider/signin'
  },
  {
    id: 'security',
    name: 'Security Personnel',
    description: 'Scan visitor codes and manage access',
    icon: Shield,
    color: 'bg-danger-600',
    href: '/security/signin'
  },
  {
    id: 'authority',
    name: 'Authority',
    description: 'View reports and compliance data',
    icon: FileText,
    color: 'bg-purple-600',
    href: '/authority/signin'
  }
]

export default function HomePage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">FCMS</h1>
            </div>
            <div className="text-sm text-gray-500">
              Flat/Complex Management System
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to FCMS
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Streamline your residential complex management with our comprehensive platform. 
            Choose your role to access the appropriate dashboard.
          </p>
        </div>

        {/* Role Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {userRoles.map((role) => {
            const Icon = role.icon
            return (
              <Link
                key={role.id}
                href={role.href}
                className="group"
                onMouseEnter={() => setSelectedRole(role.id)}
                onMouseLeave={() => setSelectedRole(null)}
              >
                <div className={`
                  relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 
                  transform hover:-translate-y-1 border-2 
                  ${selectedRole === role.id ? 'border-primary-300' : 'border-gray-200'}
                `}>
                  <div className="p-6">
                    <div className={`
                      w-16 h-16 rounded-lg ${role.color} flex items-center justify-center mb-4
                      group-hover:scale-110 transition-transform duration-300
                    `}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {role.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {role.description}
                    </p>
                  </div>
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:to-primary-500/10 transition-all duration-300" />
                </div>
              </Link>
            )
          })}
        </div>

        {/* Features Overview */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            System Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Building2 className="h-6 w-6 text-primary-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Financial Management</h4>
              <p className="text-sm text-gray-600">Track levies, rent, and contributions with automated reminders</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-success-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Access Control</h4>
              <p className="text-sm text-gray-600">Digital visitor codes and QR scanning for security</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Wrench className="h-6 w-6 text-warning-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Service Management</h4>
              <p className="text-sm text-gray-600">Directory of vetted service providers and request tracking</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-danger-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FileText className="h-6 w-6 text-danger-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Reports & Analytics</h4>
              <p className="text-sm text-gray-600">Comprehensive reporting and defaulter tracking</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 FCMS - Flat/Complex Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
