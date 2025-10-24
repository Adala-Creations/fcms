'use client'

import { useState, useEffect } from 'react'
import { Building, Plus, Search, Edit, Trash2, MapPin, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { useApi } from '@/lib/hooks/useApi'
import { useToast } from '@/lib/hooks/useToast'
import { propertyService } from '@/lib/services/api.service'
import type { PropertyDto } from '@/lib/types/api'

export default function PropertiesPage() {
  const { data: properties, loading, error, refetch } = useApi<PropertyDto[]>(
    () => propertyService.getProperties()
  )
  const toast = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [currentProperty, setCurrentProperty] = useState<PropertyDto | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    address: ''
  })

  const filteredProperties = (properties || []).filter(property =>
    property.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenModal = (property?: PropertyDto) => {
    if (property) {
      setIsEditing(true)
      setCurrentProperty(property)
      setFormData({
        name: property.name || '',
        address: property.address || ''
      })
    } else {
      setIsEditing(false)
      setCurrentProperty(null)
      setFormData({
        name: '',
        address: ''
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setCurrentProperty(null)
    setIsEditing(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      if (isEditing && currentProperty) {
        // Update existing property
        await propertyService.updateProperty(currentProperty.id, {
          ...currentProperty,
          ...formData
        })
        toast.showToast('Property updated successfully', 'success')
      } else {
        // Create new property
        await propertyService.createProperty(formData)
        toast.showToast('Property created successfully', 'success')
      }
      
      // Reload properties
      await refetch()
      handleCloseModal()
    } catch (error) {
      console.error('Failed to save property:', error)
      toast.showToast('Failed to save property. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = (property: PropertyDto) => {
    setCurrentProperty(property)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (currentProperty) {
      try {
        await propertyService.deleteProperty(currentProperty.id)
        toast.showToast('Property deleted successfully', 'success')
        await refetch()
        setShowDeleteModal(false)
        setCurrentProperty(null)
      } catch (error) {
        console.error('Failed to delete property:', error)
        toast.showToast('Failed to delete property. Please try again.', 'error')
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties Management</h1>
          <p className="text-gray-600 mt-1">Manage all properties in the system</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Property
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search properties by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading properties...</p>
        </div>
      )}

      {/* Properties Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <Building className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{property.name}</h3>
                    <p className="text-xs text-gray-500">ID: {property.id}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(property)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(property)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">{property.address || 'No address provided'}</p>
                </div>

                <div className="pt-3 border-t mt-3">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>Created: {new Date(property.createdAt).toLocaleDateString()}</span>
                  </div>
                  {property.updatedAt && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>Updated: {new Date(property.updatedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first property'}
          </p>
          {!searchTerm && (
            <Button onClick={() => handleOpenModal()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          )}
        </div>
      )}

      {/* Add/Edit Property Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {isEditing ? 'Edit Property' : 'Add New Property'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Property Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={submitting}
                    placeholder="e.g., Sunset Apartments"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address *</Label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    disabled={submitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={4}
                    placeholder="Full address including street, city, state, ZIP, country..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the complete address for this property
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1" disabled={submitting}>
                    {submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isEditing ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      isEditing ? 'Update Property' : 'Create Property'
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCloseModal} 
                    className="flex-1"
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && currentProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Delete Property</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{currentProperty.name}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Delete
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
