'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AuthLayout from '@/components/layout/auth-layout'

export default function TenantForgotPassword() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Password reset for:', email)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <AuthLayout
        title="Check Your Email"
        subtitle="We've sent password reset instructions to your email"
        role="tenant"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Reset Link Sent
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            We've sent password reset instructions to <strong>{email}</strong>. 
            Please check your email and follow the link to reset your password.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="w-full"
            >
              Send Another Email
            </Button>
            <Link
              href="/tenant/signin"
              className="block text-sm text-primary-600 hover:text-primary-500"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your email to receive reset instructions"
      role="tenant"
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
              placeholder="tenant@fcms.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Button type="submit" className="w-full flex justify-center items-center">
            Send Reset Instructions
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <Link
              href="/tenant/signin"
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
