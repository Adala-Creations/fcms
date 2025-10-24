'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Lock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const SECRET_CODE = '$3cR3Tc0DE_Adin1StrAt10N'

export default function AdminAccountRequest() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate secret code
    if (code.trim() === SECRET_CODE) {
      // Redirect to admin signup page
      router.push('/admin/signup')
    } else {
      setError('Invalid access code. Please contact your administrator.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <Building2 className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Access Request
          </h1>
          <p className="text-gray-600">
            Enter the secret access code to proceed to admin registration
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md text-sm">
              <strong>Note:</strong> Admin account creation requires a special access code. Contact your system administrator if you don't have one.
            </div>

            <div>
              <Label htmlFor="code" className="block text-sm font-medium text-gray-700">
                Access Code
              </Label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="code"
                  name="code"
                  type="password"
                  required
                  className="pl-10"
                  placeholder="Enter secret access code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Verifying...' : (
                <>
                  Verify & Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
              >
                ← Back to home
              </button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            This page is protected to prevent unauthorized admin account creation.
          </p>
        </div>
      </div>
    </div>
  )
}
