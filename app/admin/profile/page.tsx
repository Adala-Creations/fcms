'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, Building2, Save, Camera, Lock, Trash2, AlertTriangle, Bell, Shield, Eye, EyeOff } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Header from '@/components/layout/header'
import { useApi } from '@/lib/hooks/useApi'
import { useToast } from '@/lib/hooks/useToast'
import { authService, userService } from '@/lib/services/api.service'
import type { UserDto } from '@/lib/types/api'

export default function AdminProfilePage() {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    phoneNumber: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userId, setUserId] = useState<string>('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    paymentAlerts: true,
    visitorAlerts: true,
    maintenanceAlerts: true
  })

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'private',
    dataSharing: false,
    analyticsTracking: true
  })
  
  const toast = useToast()
  const router = useRouter()

  // Get user ID from localStorage on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId') || ''
    setUserId(storedUserId)
  }, [])

  const { data: user, loading, error, refetch } = useApi<UserDto>(
    () => {
      if (!userId) {
        return Promise.reject('No user ID')
      }
      return userService.getUserById(userId)
    },
    [userId]
  )

  // Update form when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || ''
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || !user) return
    
    setIsSubmitting(true)
    try {
      await userService.updateUser(userId, {
        ...user,
        userName: formData.userName,
        email: formData.email,
        phoneNumber: formData.phoneNumber
      })
      toast.showToast('Profile updated successfully', 'success')
      refetch()
    } catch (error: any) {
      toast.showToast(error.message || 'Failed to update profile', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE' || !userId) return
    
    setIsDeleting(true)
    try {
      await userService.deleteUser(userId)
      toast.showToast('Account deleted successfully', 'success')
      
      // Clear all localStorage data
      localStorage.clear()
      
      // Redirect to signin page
      setTimeout(() => {
        router.push('/admin/signin')
      }, 1000)
    } catch (error: any) {
      toast.showToast(error.message || 'Failed to delete account', 'error')
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
      setDeleteConfirmation('')
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.showToast('New passwords do not match', 'error')
      return
    }
    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      toast.showToast('Password updated successfully', 'success')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setShowPasswordModal(false)
      setShowCurrentPassword(false)
      setShowNewPassword(false)
      setShowConfirmPassword(false)
    } catch (error: any) {
      toast.showToast(error.message || 'Failed to update password', 'error')
    }
  }

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }))
    toast.showToast('Notification settings updated', 'success')
  }

  const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setPrivacySettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
    toast.showToast('Privacy settings updated', 'success')
  }

  if (loading || !userId) {
    return (
      <div>
        <Header 
          title="Profile & Settings" 
          subtitle="Manage your personal information and account settings"
        />
        <div className="p-6">
          <Card>
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                <p className="text-gray-600">Loading profile...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div>
        <Header 
          title="Profile & Settings" 
          subtitle="Manage your personal information and account settings"
        />
        <div className="p-6">
          <Card>
            <CardContent className="p-12">
              <div className="text-center space-y-4">
                <div className="bg-warning-50 border-2 border-warning-200 rounded-lg p-8">
                  <h3 className="text-2xl font-bold text-warning-800 mb-2">⚠️ Unable to Load Profile</h3>
                  <p className="text-warning-700 mb-4">Could not fetch user data</p>
                  <p className="text-sm text-warning-600">Please make sure you're logged in</p>
                  <Button className="mt-4" onClick={() => window.location.href = '/admin/signin'}>
                    Go to Sign In
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header 
        title="Profile & Settings" 
        subtitle="Manage your personal information and account settings"
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
                  <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center">
                    <User className="h-12 w-12 text-primary-600" />
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
              <CardDescription>Update your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="userName">Username</Label>
                  <Input
                    id="userName"
                    name="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., +263 77 123 4567"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>View your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-500">Email Confirmed</Label>
                <p className="text-gray-900 mt-1">
                  {user.emailConfirmed ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                      ✓ Confirmed
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
                      Pending
                    </span>
                  )}
                </p>
              </div>
              <div>
                <Label className="text-gray-500">Phone Confirmed</Label>
                <p className="text-gray-900 mt-1">
                  {user.phoneNumberConfirmed ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                      ✓ Confirmed
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
                      Pending
                    </span>
                  )}
                </p>
              </div>
              <div>
                <Label className="text-gray-500">Two-Factor Authentication</Label>
                <p className="text-gray-900 mt-1">
                  {user.twoFactorEnabled ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                      Enabled
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Disabled
                    </span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Lock className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Change Password</p>
                    <p className="text-sm text-gray-500">Update your account password</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setShowPasswordModal(true)}>
                  Change
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                </div>
                <Button variant="outline">
                  {user.twoFactorEnabled ? 'Disable' : 'Enable'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <input
                  id="emailNotifications"
                  name="emailNotifications"
                  type="checkbox"
                  checked={notificationSettings.emailNotifications}
                  onChange={handleNotificationChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="smsNotifications">SMS Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                </div>
                <input
                  id="smsNotifications"
                  name="smsNotifications"
                  type="checkbox"
                  checked={notificationSettings.smsNotifications}
                  onChange={handleNotificationChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <p className="text-sm text-gray-500">Receive push notifications in browser</p>
                </div>
                <input
                  id="pushNotifications"
                  name="pushNotifications"
                  type="checkbox"
                  checked={notificationSettings.pushNotifications}
                  onChange={handleNotificationChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Notification Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="paymentAlerts">Payment Alerts</Label>
                      <p className="text-sm text-gray-500">Get notified about payment activities</p>
                    </div>
                    <input
                      id="paymentAlerts"
                      name="paymentAlerts"
                      type="checkbox"
                      checked={notificationSettings.paymentAlerts}
                      onChange={handleNotificationChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="visitorAlerts">Visitor Alerts</Label>
                      <p className="text-sm text-gray-500">Get notified about visitor activities</p>
                    </div>
                    <input
                      id="visitorAlerts"
                      name="visitorAlerts"
                      type="checkbox"
                      checked={notificationSettings.visitorAlerts}
                      onChange={handleNotificationChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="maintenanceAlerts">Maintenance Alerts</Label>
                      <p className="text-sm text-gray-500">Get notified about maintenance requests</p>
                    </div>
                    <input
                      id="maintenanceAlerts"
                      name="maintenanceAlerts"
                      type="checkbox"
                      checked={notificationSettings.maintenanceAlerts}
                      onChange={handleNotificationChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Privacy Settings
            </CardTitle>
            <CardDescription>Control your privacy and data sharing preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="profileVisibility">Profile Visibility</Label>
                <select
                  id="profileVisibility"
                  name="profileVisibility"
                  value={privacySettings.profileVisibility}
                  onChange={handlePrivacyChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="contacts">Contacts Only</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dataSharing">Data Sharing</Label>
                  <p className="text-sm text-gray-500">Allow sharing of anonymized data for analytics</p>
                </div>
                <input
                  id="dataSharing"
                  name="dataSharing"
                  type="checkbox"
                  checked={privacySettings.dataSharing}
                  onChange={handlePrivacyChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="analyticsTracking">Analytics Tracking</Label>
                  <p className="text-sm text-gray-500">Allow tracking for usage analytics</p>
                </div>
                <input
                  id="analyticsTracking"
                  name="analyticsTracking"
                  type="checkbox"
                  checked={privacySettings.analyticsTracking}
                  onChange={handlePrivacyChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions that affect your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
              <div className="flex items-center space-x-3">
                <Trash2 className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-900">Delete Account</p>
                  <p className="text-sm text-red-700">Permanently delete your account and all associated data</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="border-red-300 text-red-600 hover:bg-red-100"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Lock className="h-6 w-6 text-primary-600" />
                <CardTitle>Change Password</CardTitle>
              </div>
              <CardDescription>
                Enter your current password and choose a new one
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowPasswordModal(false)
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                      setShowCurrentPassword(false)
                      setShowNewPassword(false)
                      setShowConfirmPassword(false)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Update Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <CardTitle className="text-red-600">Delete Account</CardTitle>
              </div>
              <CardDescription>
                This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  <strong>Warning:</strong> All your data including profile information, settings, and history will be permanently deleted.
                </p>
              </div>
              
              <div>
                <Label htmlFor="deleteConfirmation">
                  Type <strong>DELETE</strong> to confirm
                </Label>
                <Input
                  id="deleteConfirmation"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="Type DELETE to confirm"
                  className="mt-1"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteModal(false)
                    setDeleteConfirmation('')
                  }}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmation !== 'DELETE' || isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete Account'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
