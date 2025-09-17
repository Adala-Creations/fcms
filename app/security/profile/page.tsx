'use client'

import { useState } from 'react'
import { User, Mail, Phone, Shield, Save, Camera } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Header from '@/components/layout/header'

export default function SecurityProfilePage() {
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'security@fcms.com',
    phone: '+263 77 123 4567',
    employeeId: 'SEC001',
    shift: 'Morning (6AM - 2PM)',
    badgeNumber: 'BADGE123',
    department: 'Security'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Profile updated:', formData)
    alert('Profile updated successfully!')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div>
      <Header 
        title="Profile Settings" 
        subtitle="Manage your security personnel profile"
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
                  <div className="h-24 w-24 rounded-full bg-danger-100 flex items-center justify-center">
                    <User className="h-12 w-12 text-danger-600" />
                  </div>
                  <button className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-md border">
                    <Camera className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <Button variant="outline" size="sm">
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
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
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
                    name="phone"
                    value={formData.phone}
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

        {/* Security Information */}
        <Card>
          <CardHeader>
            <CardTitle>Security Information</CardTitle>
            <CardDescription>Details about your security role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="badgeNumber">Badge Number</Label>
                <Input
                  id="badgeNumber"
                  name="badgeNumber"
                  value={formData.badgeNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="shift">Shift</Label>
                <select
                  id="shift"
                  name="shift"
                  value={formData.shift}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="Morning (6AM - 2PM)">Morning (6AM - 2PM)</option>
                  <option value="Afternoon (2PM - 10PM)">Afternoon (2PM - 10PM)</option>
                  <option value="Night (10PM - 6AM)">Night (10PM - 6AM)</option>
                  <option value="Full Day (24/7)">Full Day (24/7)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  name="department"
                  value={formData.department}
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
