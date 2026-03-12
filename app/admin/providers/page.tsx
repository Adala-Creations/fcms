'use client'

import { useState } from 'react'
import { 
  Wrench, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Star,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Header from '@/components/layout/header'
import { useApi } from '@/lib/hooks/useApi'
import { serviceProviderService } from '@/lib/services/api.service'
import type { ServiseProviderDto } from '@/lib/types/api'
import { useToast } from '@/lib/hooks/useToast'

// Mock data for service providers
const providers = [
  {
    id: 1,
    name: 'John Plumbing Services',
    category: 'Plumbing',
    phone: '+263 77 123 4567',
    email: 'john@plumbing.co.zw',
    address: '123 Main St, Harare',
    rating: 4.8,
    jobsCompleted: 45,
    status: 'active',
    specialties: ['Leak repairs', 'Pipe installation', 'Drain cleaning'],
    joinDate: '2023-01-15',
    lastJob: '2024-01-10'
  },
  {
    id: 2,
    name: 'Electric Solutions Ltd',
    category: 'Electrical',
    phone: '+263 77 234 5678',
    email: 'info@electricsolutions.co.zw',
    address: '456 Electric Ave, Harare',
    rating: 4.6,
    jobsCompleted: 32,
    status: 'active',
    specialties: ['Wiring', 'Panel repairs', 'Light installation'],
    joinDate: '2023-03-20',
    lastJob: '2024-01-12'
  },
  {
    id: 3,
    name: 'Clean Supplies Ltd',
    category: 'Cleaning',
    phone: '+263 77 345 6789',
    email: 'contact@cleansupplies.co.zw',
    address: '789 Clean St, Harare',
    rating: 4.2,
    jobsCompleted: 28,
    status: 'inactive',
    specialties: ['Office cleaning', 'Window cleaning', 'Floor maintenance'],
    joinDate: '2023-02-10',
    lastJob: '2023-12-15'
  },
  {
    id: 4,
    name: 'Garden Care Pro',
    category: 'Landscaping',
    phone: '+263 77 456 7890',
    email: 'info@gardencare.co.zw',
    address: '321 Garden Rd, Harare',
    rating: 4.9,
    jobsCompleted: 67,
    status: 'active',
    specialties: ['Lawn care', 'Tree trimming', 'Garden design'],
    joinDate: '2022-11-05',
    lastJob: '2024-01-14'
  },
  {
    id: 5,
    name: 'Security Guard Services',
    category: 'Security',
    phone: '+263 77 567 8901',
    email: 'security@guardservices.co.zw',
    address: '654 Security Blvd, Harare',
    rating: 4.7,
    jobsCompleted: 89,
    status: 'active',
    specialties: ['Patrol services', 'Access control', 'Emergency response'],
    joinDate: '2022-08-12',
    lastJob: '2024-01-15'
  }
]

const categoryColors: Record<string, string> = {
  Plumbing: 'bg-blue-100 text-blue-800',
  Electrical: 'bg-yellow-100 text-yellow-800',
  Cleaning: 'bg-green-100 text-green-800',
  Landscaping: 'bg-emerald-100 text-emerald-800',
  Security: 'bg-red-100 text-red-800',
  Maintenance: 'bg-purple-100 text-purple-800',
  Other: 'bg-gray-100 text-gray-800'
}

const serviceTypes = [
  'Plumbing',
  'Electrical',
  'Cleaning',
  'Landscaping',
  'Security',
  'Maintenance',
  'HVAC',
  'Painting',
  'Carpentry',
  'Pest Control',
  'Other'
]

export default function AdminProviders() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<ServiseProviderDto | null>(null)
  const [formData, setFormData] = useState({
    companyName: '',
    serviceType: '',
    contactNumber: '',
    userId: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showToast } = useToast()

  // Fetch providers from backend
  const { data: backendProviders, loading, error, refetch } = useApi(
    () => serviceProviderService.getProviders(),
    []
  )

  // Use backend data if available, otherwise show empty
  const providers = backendProviders || []

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.serviceType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.contactNumber?.includes(searchTerm)
    const matchesCategory = filterCategory === 'all' || provider.serviceType === filterCategory
    return matchesSearch && matchesCategory
  })

  const stats = {
    total: providers.length,
    active: providers.length,
    inactive: 0,
    totalJobs: 0,
    avgRating: 0
  }

  // Get unique categories from providers
  const categories = Array.from(new Set(providers.map(p => p.serviceType).filter(Boolean) as string[]))

  const handleAdd = () => {
    setFormData({
      companyName: '',
      serviceType: '',
      contactNumber: '',
      userId: ''
    })
    setShowAddModal(true)
  }

  const handleEdit = (provider: ServiseProviderDto) => {
    setSelectedProvider(provider)
    setFormData({
      companyName: provider.companyName || '',
      serviceType: provider.serviceType || '',
      contactNumber: provider.contactNumber || '',
      userId: provider.userId || ''
    })
    setShowEditModal(true)
  }

  const handleDelete = (provider: ServiseProviderDto) => {
    setSelectedProvider(provider)
    setShowDeleteModal(true)
  }

  const handleView = (provider: ServiseProviderDto) => {
    setSelectedProvider(provider)
    setShowViewModal(true)
  }

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // userId is required by backend - use current admin's ID if not provided
      const userId = formData.userId?.trim() || (typeof window !== 'undefined' ? localStorage.getItem('userId') : null)
      if (!userId) {
        showToast('User ID is required. Please log in again or enter a user ID.', 'error')
        setIsSubmitting(false)
        return
      }
      await serviceProviderService.createProvider({ ...formData, userId })
      showToast('Provider added successfully', 'success')
      setShowAddModal(false)
      refetch()
    } catch (error: any) {
      showToast(error.message || 'Failed to add provider', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProvider) return
    setIsSubmitting(true)
    try {
      await serviceProviderService.updateProvider(selectedProvider.id, formData)
      showToast('Provider updated successfully', 'success')
      setShowEditModal(false)
      refetch()
    } catch (error: any) {
      showToast(error.message || 'Failed to update provider', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedProvider) return
    setIsSubmitting(true)
    try {
      await serviceProviderService.deleteProvider(selectedProvider.id)
      showToast('Provider deleted successfully', 'success')
      setShowDeleteModal(false)
      refetch()
    } catch (error: any) {
      showToast(error.message || 'Failed to delete provider', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Header 
        title="Service Providers" 
        subtitle="Manage service providers and their performance"
      />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Wrench className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Providers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-success-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-gray-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-warning-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgRating}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search providers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <Button onClick={() => setShowAddModal(true)} className="w-full lg:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Provider
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="text-gray-500">Loading providers...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-lg p-8 shadow-sm">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="flex items-center space-x-2">
              <svg className="h-8 w-8 text-yellow-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <h2 className="text-2xl font-bold text-yellow-800">Failed to load service providers</h2>
            </div>
            <p className="text-sm text-yellow-700 max-w-md">{String(error)}</p>
            <Button variant="outline" onClick={refetch}>Retry</Button>
          </div>
        </div>
      )}

      {/* Providers Grid */}
      {!loading && !error && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProviders.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No service providers found
          </div>
        ) : (
          filteredProviders.map((provider) => (
            <Card key={provider.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{provider.companyName || 'N/A'}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${categoryColors[provider.serviceType as keyof typeof categoryColors] || categoryColors.Other}`}>
                        {provider.serviceType || 'Other'}
                      </span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {provider.contactNumber || 'N/A'}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {provider.userId || 'N/A'}
                  </div>
                  
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium text-gray-900 mb-1">Provider ID:</p>
                    <p className="text-xs text-gray-600">{provider.id}</p>
                  </div>

                  <div className="pt-2 border-t flex justify-end items-center">
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm" onClick={() => handleView(provider)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(provider)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(provider)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      )}

      {/* Add Provider Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Provider</h3>
            <form onSubmit={handleSubmitAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                <Input
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Type *</label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select service type</option>
                  {serviceTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number *</label>
                <Input
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  required
                  placeholder="Enter contact number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
                <Input
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  placeholder="Leave blank to use your account"
                />
                <p className="text-xs text-gray-500 mt-1">Optional. Uses your account if blank.</p>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Add Provider'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Provider Modal */}
      {showEditModal && selectedProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Provider</h3>
            <form onSubmit={handleSubmitEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                <Input
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Type *</label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select service type</option>
                  {serviceTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number *</label>
                <Input
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  required
                  placeholder="Enter contact number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
                <Input
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  placeholder="Enter user ID (optional)"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button type="button" variant="outline" onClick={() => setShowEditModal(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Update Provider'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-red-600">Delete Provider</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{selectedProvider.companyName}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowDeleteModal(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button 
                type="button" 
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View Provider Modal */}
      {showViewModal && selectedProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Provider Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Company Name</p>
                <p className="text-base text-gray-900">{selectedProvider.companyName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Service Type</p>
                <p className="text-base text-gray-900">{selectedProvider.serviceType || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Contact Number</p>
                <p className="text-base text-gray-900">{selectedProvider.contactNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">User ID</p>
                <p className="text-base text-gray-900">{selectedProvider.userId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Provider ID</p>
                <p className="text-base text-gray-900">{selectedProvider.id}</p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button onClick={() => setShowViewModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
