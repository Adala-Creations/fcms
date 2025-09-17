'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, FileText, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AuthLayout from '@/components/layout/auth-layout'

export default function AuthoritySignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    authorityId: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })

  const departments = [
    'Housing Authority',
    'City Planning',
    'Building Inspector',
    'Health Department',
    'Fire Department',
    'Environmental Agency',
    'Other'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    console.log('Authority sign up:', formData)
    window.location.href = '/authority/dashboard'
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <AuthLayout
      title="Authority Registration"
      subtitle="Register for regulatory oversight access"
      role="authority"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <Label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </Label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                className="pl-10"
                placeholder="Jane"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </Label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                className="pl-10"
                placeholder="Smith"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

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
              placeholder="authority@fcms.com"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </Label>
          <div className="mt-1">
            <Input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              placeholder="+263 77 123 4567"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <Label htmlFor="department" className="block text-sm font-medium text-gray-700">
              Department
            </Label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="department"
                name="department"
                required
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={formData.department}
                onChange={handleInputChange}
              >
                <option value="">Select department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="position" className="block text-sm font-medium text-gray-700">
              Position/Title
            </Label>
            <div className="mt-1">
              <Input
                id="position"
                name="position"
                type="text"
                required
                placeholder="Inspector"
                value={formData.position}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="authorityId" className="block text-sm font-medium text-gray-700">
            Authority ID/Badge Number
          </Label>
          <div className="mt-1">
            <Input
              id="authorityId"
              name="authorityId"
              type="text"
              required
              placeholder="AUTH123456"
              value={formData.authorityId}
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
              autoComplete="new-password"
              required
              className="pl-10 pr-10"
              placeholder="Create a strong password"
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

        <div>
          <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </Label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              className="pl-10 pr-10"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="agreeToTerms"
            name="agreeToTerms"
            type="checkbox"
            required
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
          />
          <Label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
            I agree to the{' '}
            <Link href="/terms" className="text-primary-600 hover:text-primary-500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary-600 hover:text-primary-500">
              Privacy Policy
            </Link>
          </Label>
        </div>

        <div>
          <Button type="submit" className="w-full flex justify-center items-center">
            Create Account
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              href="/authority/signin"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}
