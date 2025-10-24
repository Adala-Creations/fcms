'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import AuthLayout from '@/components/layout/auth-layout'
import { login } from '@/lib/auth'
import { setAuthToken } from '@/lib/api-client'

export default function AdminSignIn() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    secretCode: '',
    rememberMe: false
  })

  const SECRET_CODE = '$3cR3Tc0DE_Adin1StrAt10N'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate secret code first
    if (formData.secretCode.trim() !== SECRET_CODE) {
      setError('Invalid secret code. Please contact your administrator for access.')
      setLoading(false)
      return
    }

    try {
      const response = await login(formData.username, formData.password)
      
        // Try different possible token property names
        const token = response.token || response.accessToken || response.jwtToken || response.jwt || response.access_token
      
      if (token) {
        // Set token in api-client
        setAuthToken(token)
        
        console.log('Login successful!')
        
        // Redirect to admin dashboard
        router.push('/admin/dashboard')
      } else {
          // Wait a moment before showing error in case token arrives slightly delayed
          await new Promise(resolve => setTimeout(resolve, 500))
          console.error('Server response:', response)
          setError(`No token received from server. Response keys: ${Object.keys(response).join(', ')}`)
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
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
      title="Admin Sign In"
      subtitle="Access your property management dashboard"
      role="admin"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div>
          <Label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </Label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="pl-10"
              placeholder="Your username"
              value={formData.username}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="secretCode" className="block text-sm font-medium text-gray-700">
            Secret Code
          </Label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="secretCode"
              name="secretCode"
              type="password"
              required
              className="pl-10"
              placeholder="Enter your secret code"
              value={formData.secretCode}
              onChange={handleInputChange}
              disabled={loading}
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
              disabled={loading}
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
              href="/admin/forgot-password"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <div>
          <Button type="submit" className="w-full flex justify-center items-center" disabled={loading}>
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              href="/admin/account_request"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Request access here
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}
