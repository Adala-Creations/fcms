'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  CreditCard, 
  Receipt, 
  Shield, 
  Wrench, 
  FileText, 
  Settings,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Key } from 'lucide-react'

interface SidebarProps {
  userRole: string
}

const navigationItems = {
  admin: [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Roles', href: '/admin/roles', icon: Key },
    { name: 'Units', href: '/admin/units', icon: Building2 },
    { name: 'Payments', href: '/admin/payments', icon: CreditCard },
    { name: 'Expenses', href: '/admin/expenses', icon: Receipt },
    { name: 'Visitors', href: '/admin/visitors', icon: Shield },
    { name: 'Service Providers', href: '/admin/providers', icon: Wrench },
    { name: 'Reports', href: '/admin/reports', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ],
  owner: [
    { name: 'Dashboard', href: '/owner/dashboard', icon: LayoutDashboard },
    { name: 'My Units', href: '/owner/units', icon: Building2 },
    { name: 'Payments', href: '/owner/payments', icon: CreditCard },
    { name: 'Visitors', href: '/owner/visitors', icon: Shield },
    { name: 'Service Requests', href: '/owner/requests', icon: Wrench },
    { name: 'Reports', href: '/owner/reports', icon: FileText },
  ],
  tenant: [
    { name: 'Dashboard', href: '/tenant/dashboard', icon: LayoutDashboard },
    { name: 'My Unit', href: '/tenant/unit', icon: Building2 },
    { name: 'Payments', href: '/tenant/payments', icon: CreditCard },
    { name: 'Visitors', href: '/tenant/visitors', icon: Shield },
    { name: 'Service Requests', href: '/tenant/requests', icon: Wrench },
  ],
  'service-provider': [
    { name: 'Dashboard', href: '/provider/dashboard', icon: LayoutDashboard },
    { name: 'My Jobs', href: '/provider/jobs', icon: Wrench },
    { name: 'Receipts', href: '/provider/receipts', icon: Receipt },
    { name: 'Profile', href: '/provider/profile', icon: Settings },
  ],
  security: [
    { name: 'Dashboard', href: '/security/dashboard', icon: LayoutDashboard },
    { name: 'Visitor Scanner', href: '/security/scanner', icon: Shield },
    { name: 'Visitor Logs', href: '/security/logs', icon: FileText },
  ],
  authority: [
    { name: 'Dashboard', href: '/authority/dashboard', icon: LayoutDashboard },
    { name: 'Reports', href: '/authority/reports', icon: FileText },
    { name: 'Compliance', href: '/authority/compliance', icon: Shield },
  ],
}

export default function Sidebar({ userRole }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const items = navigationItems[userRole as keyof typeof navigationItems] || []
  const profileRef = useRef<HTMLDivElement>(null)

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const getUserInitials = (role: string) => {
    const roleMap: { [key: string]: string } = {
      'admin': 'A',
      'owner': 'O', 
      'tenant': 'T',
      'service-provider': 'P',
      'security': 'S',
      'authority': 'A'
    }
    return roleMap[role] || 'U'
  }

  const getUserName = (role: string) => {
    const nameMap: { [key: string]: string } = {
      'admin': 'Admin User',
      'owner': 'Property Owner', 
      'tenant': 'Tenant User',
      'service-provider': 'Service Provider',
      'security': 'Security Personnel',
      'authority': 'Authority User'
    }
    return nameMap[role] || 'User'
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md bg-white shadow-md border border-gray-200"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b">
            <Building2 className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">FCMS</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {items.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-primary-100 text-primary-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="px-4 py-4 border-t">
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center w-full text-left hover:bg-gray-50 rounded-md p-2 -m-2"
              >
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-700">
                      {getUserInitials(userRole)}
                    </span>
                  </div>
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {getUserName(userRole)}
                  </p>
                  <p className="text-xs text-gray-500 capitalize truncate">
                    {userRole.replace('-', ' ')}
                  </p>
                </div>
                <ChevronDown className={cn(
                  "ml-2 h-4 w-4 text-gray-400 transition-transform",
                  isProfileOpen && "rotate-180"
                )} />
              </button>

              {/* Profile dropdown */}
              {isProfileOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <Link
                    href={`/${userRole}/profile`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User className="mr-3 h-4 w-4" />
                    Profile Settings
                  </Link>
                  <Link
                    href={`/${userRole}/settings`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Settings className="mr-3 h-4 w-4" />
                    Account Settings
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false)
                      // Navigate to landing page
                      router.push('/')
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
