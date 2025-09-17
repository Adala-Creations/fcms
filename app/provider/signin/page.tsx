'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AuthLayout from '@/components/layout/auth-layout'

export default function ProviderSignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Provider sign in:', formData)
    window.location.href = '/provider/dashboard'
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <AuthLayout
      title="Service Provider Sign In"
      subtitle="Access your service provider portal"
      role="service-provider"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </Label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="pl-10"
              placeholder="provider@fcms.com"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </Label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              className="pl-10 pr-10"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              checked={formData.rememberMe}
              onChange={handleInputChange}
            />
            <Label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
              Remember me
            </Label>
          </div>

          <div className="text-sm">
            <Link
              href="/provider/forgot-password"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <div>
          <Button type="submit" className="w-full flex justify-center items-center">
            Sign In
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              href="/provider/signup"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}
