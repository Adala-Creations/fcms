'use client'

import { useEffect, useRef, useState } from 'react'
import { User, Mail, Phone, Wrench, Save, Camera } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Header from '@/components/layout/header'
import { useToast } from '@/lib/hooks/useToast'
import { serviceProviderService, userService } from '@/lib/services/api.service'
import type { ServiseProviderDto, UserDto } from '@/lib/types/api'

export default function ProviderProfilePage() {
  const { success, error: showError } = useToast()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [user, setUser] = useState<UserDto | null>(null)
  const [provider, setProvider] = useState<ServiseProviderDto | null>(null)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    phoneNumber: '',
    businessName: '',
    serviceCategory: '',
    contactNumber: ''
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
        if (!userId) {
          setLoading(false)
          return
        }

        const [userDto, providers] = await Promise.all([
          userService.getUserById(userId),
          serviceProviderService.getProviders()
        ])

        const providerDto = providers.find(p => p.userId === userId) || null

        setUser(userDto)
        setProvider(providerDto || null)

        setFormData({
          userName: userDto.userName || '',
          email: userDto.email || '',
          phoneNumber: userDto.phoneNumber || '',
          businessName: providerDto?.companyName || '',
          serviceCategory: providerDto?.serviceType || '',
          contactNumber: providerDto?.contactNumber || ''
        })
      } catch (err: any) {
        showError(err.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [showError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      // Update user core details
      await userService.updateUser(user.id || '', {
        userName: formData.userName,
        email: formData.email,
        phoneNumber: formData.phoneNumber
      })

      // Update provider business details if provider exists
      if (provider) {
        await serviceProviderService.updateProvider(provider.id, {
          id: provider.id,
          userId: provider.userId,
          companyName: formData.businessName,
          serviceType: formData.serviceCategory,
          contactNumber: formData.contactNumber
        })
      }

      success('Profile updated successfully')
    } catch (err: any) {
      showError(err.message || 'Failed to update profile')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleChangePhotoClick = () => {
    fileInputRef.current?.click()
  }

  if (loading) {
    return (
      <div>
        <Header 
          title="Profile Settings" 
          subtitle="Manage your service provider profile"
        />
        <div className="p-4 lg:p-6 text-sm text-gray-500">Loading profile...</div>
      </div>
    )
  }

  return (
    <div>
      <Header 
        title="Profile Settings" 
        subtitle="Manage your service provider profile"
      />
      
      <div className="p-4 lg:p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Update your profile photo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-secondary-100 flex items-center justify-center">
                    <User className="h-12 w-12 text-secondary-600" />
                  </div>
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-md border"
                    onClick={handleChangePhotoClick}
                  >
                    <Camera className="h-4 w-4 text-gray-600" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <Button variant="outline" size="sm" type="button" onClick={handleChangePhotoClick}>
                  Change Photo
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="userName">Username</Label>
                    <Input
                      id="userName"
                      name="userName"
                      value={formData.userName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Details about your service business</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="serviceCategory">Service Category</Label>
                <select
                  id="serviceCategory"
                  name="serviceCategory"
                  value={formData.serviceCategory}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Security">Security</option>
                  <option value="Landscaping">Landscaping</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <Label htmlFor="contactNumber">Business Contact Number</Label>
                <Input
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}