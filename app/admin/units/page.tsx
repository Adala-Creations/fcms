'use client'

import { useState } from 'react'
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  Home,
  AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Header from '@/components/layout/header'
import { useApi } from '@/lib/hooks/useApi'
import { unitService, propertyService } from '@/lib/services/api.service'
import { useToast } from '@/lib/hooks/useToast'
import { ToastContainer } from '@/components/ui/toast'
import type { UnitDto } from '@/lib/types/api'

const statusColors = {
  occupied: 'bg-success-100 text-success-800',
  vacant: 'bg-gray-100 text-gray-800',
  maintenance: 'bg-warning-100 text-warning-800'
}

export default function AdminUnits() {
  const { toasts, dismissToast, success, error: showError } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [createLoading, setCreateLoading] = useState(false)
  const [optimisticUnits, setOptimisticUnits] = useState<UnitDto[]>([])
  const [createForm, setCreateForm] = useState({
    propertyId: '' as number | '' ,
    unitNumber: '',
    floor: '',
    sizeSqM: '' as number | '' ,
    isOccupied: false
  })

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({
    propertyId: '' as number | '' ,
    unitNumber: '',
    floor: '',
    sizeSqM: '' as number | '' ,
    isOccupied: false
  })
  const [rowActionId, setRowActionId] = useState<number | null>(null)

  // Fetch units from backend
  const { data: units, loading, error, refetch } = useApi(
    () => unitService.getUnits(),
    []
  )

  // Fetch properties for lookup
  const { data: properties } = useApi(
    () => propertyService.getProperties(),
    []
  )

  // Merge optimistic units with fetched units
  const allUnits = [...optimisticUnits, ...(units || [])]

  // Filter units based on search and status
  const filteredUnits = allUnits.filter(unit => {
    const matchesSearch = unit.unitNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'occupied' && unit.isOccupied) ||
      (filterStatus === 'vacant' && !unit.isOccupied)
    return matchesSearch && matchesFilter
  })

  // Calculate stats
  const stats = {
    total: allUnits.length,
    occupied: allUnits.filter(u => u.isOccupied).length,
    vacant: allUnits.filter(u => !u.isOccupied).length,
    maintenance: 0 // Not tracked in backend yet
  }

  // Get property name by ID
  const getPropertyName = (propertyId: number | null) => {
    if (!propertyId || !properties) return 'N/A'
    const property = properties.find(p => p.id === propertyId)
    return property?.name || 'Unknown'
  }

  // Handlers: Create Unit
  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as any
    setCreateForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'propertyId' || name === 'sizeSqM' ? (value === '' ? '' : Number(value)) : value
    }))
  }

  const resetCreateForm = () => {
    setCreateForm({ propertyId: '', unitNumber: '', floor: '', sizeSqM: '', isOccupied: false })
    setCreateError(null)
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateError(null)
    setCreateLoading(true)
    
    if (createForm.propertyId === '' || createForm.unitNumber.trim() === '') {
      setCreateError('Property and Unit Number are required')
      setCreateLoading(false)
      return
    }

    // Optimistic update
    const optimisticUnit: UnitDto = {
      id: Date.now(), // temp ID
      propertyId: Number(createForm.propertyId),
      unitNumber: createForm.unitNumber,
      floor: createForm.floor || null,
      sizeSqM: createForm.sizeSqM === '' ? null : Number(createForm.sizeSqM),
      isOccupied: !!createForm.isOccupied,
      createdAt: new Date().toISOString(),
      updatedAt: null
    }
    setOptimisticUnits(prev => [optimisticUnit, ...prev])
    
    try {
      await unitService.createUnit({
        propertyId: Number(createForm.propertyId),
        unitNumber: createForm.unitNumber,
        floor: createForm.floor || null,
        sizeSqM: createForm.sizeSqM === '' ? null : Number(createForm.sizeSqM),
        isOccupied: !!createForm.isOccupied
      } as any)
      
      success('Unit created successfully!')
      resetCreateForm()
      setShowAddModal(false)
      
      // Clear optimistic state before refetch to avoid duplicates
      setOptimisticUnits([])
      await refetch()
    } catch (err: any) {
      // Remove optimistic unit on error
      setOptimisticUnits(prev => prev.filter(u => u.id !== optimisticUnit.id))
      setCreateError(err.message || 'Failed to create unit')
      showError(err.message || 'Failed to create unit')
    } finally {
      setCreateLoading(false)
    }
  }

  // Handlers: Edit Unit
  const startEdit = (unit: any) => {
    setEditingId(unit.id)
    setEditForm({
      propertyId: unit.propertyId || '',
      unitNumber: unit.unitNumber || '',
      floor: unit.floor || '',
      sizeSqM: unit.sizeSqM ?? '',
      isOccupied: !!unit.isOccupied
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as any
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'propertyId' || name === 'sizeSqM' ? (value === '' ? '' : Number(value)) : value
    }))
  }

  const saveEdit = async (id: number) => {
    setRowActionId(id)
    try {
      // Get the current unit to preserve all fields
      const currentUnit = allUnits.find(u => u.id === id)
      if (!currentUnit) {
        showError('Unit not found')
        return
      }

      // Merge with edited values
      const updatedUnit: UnitDto = {
        ...currentUnit,
        propertyId: editForm.propertyId === '' ? currentUnit.propertyId : Number(editForm.propertyId),
        unitNumber: editForm.unitNumber,
        floor: editForm.floor || null,
        sizeSqM: editForm.sizeSqM === '' ? null : Number(editForm.sizeSqM),
        isOccupied: !!editForm.isOccupied,
        updatedAt: new Date().toISOString()
      }

      await unitService.updateUnit(id, updatedUnit)
      
      success('Unit updated successfully!')
      setEditingId(null)
      await refetch()
    } catch (err: any) {
      showError(err.message || 'Failed to update unit')
    } finally {
      setRowActionId(null)
    }
  }

  // Handler: Delete Unit
  const deleteUnit = async (id: number) => {
    if (!confirm('Delete this unit? This action cannot be undone.')) return
    setRowActionId(id)
    
    // Optimistic removal
    const unitToDelete = allUnits.find(u => u.id === id)
    if (unitToDelete) {
      setOptimisticUnits(prev => prev.filter(u => u.id !== id))
    }
    
    try {
      await unitService.deleteUnit(id)
      success('Unit deleted successfully!')
      await refetch()
      setOptimisticUnits([])
    } catch (err: any) {
      // Restore on error if it was optimistic
      if (unitToDelete && optimisticUnits.some(u => u.id === id)) {
        setOptimisticUnits(prev => [...prev, unitToDelete])
      }
      showError(err.message || 'Failed to delete unit')
    } finally {
      setRowActionId(null)
    }
  }

  return (
    <div className="space-y-6">
      <Header 
        title="Units Management" 
        subtitle="Manage all units, owners, and tenants"
      />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Units</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-success-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Occupied</p>
                <p className="text-2xl font-bold text-gray-900">{stats.occupied}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-gray-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Vacant</p>
                <p className="text-2xl font-bold text-gray-900">{stats.vacant}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-warning-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Maintenance</p>
                <p className="text-2xl font-bold text-gray-900">{stats.maintenance}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search units, owners, or tenants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="occupied">Occupied</option>
                <option value="vacant">Vacant</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            
            <Button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Unit
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Units Table */}
      <Card>
        <CardHeader>
          <CardTitle>Units ({filteredUnits.length})</CardTitle>
          <CardDescription>
            Manage all units in the complex
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading units...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              Error loading units: {error}
              <Button onClick={refetch} variant="outline" className="ml-4">
                Retry
              </Button>
            </div>
          ) : filteredUnits.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No units found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Unit</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Property</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Floor</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Size (sqm)</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Occupancy</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Created</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUnits.map((unit) => (
                    <tr key={unit.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {editingId === unit.id ? (
                          <Input
                            name="unitNumber"
                            value={editForm.unitNumber}
                            onChange={handleEditChange}
                            placeholder="Unit number"
                          />
                        ) : (
                          <>
                            <div className="font-medium text-gray-900">{unit.unitNumber || 'N/A'}</div>
                            <div className="text-sm text-gray-500">ID: {unit.id}</div>
                          </>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-900">
                        {editingId === unit.id ? (
                          <select
                            name="propertyId"
                            value={editForm.propertyId}
                            onChange={handleEditChange}
                            className="px-3 py-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select property</option>
                            {(properties || []).map(p => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                        ) : (
                          getPropertyName(unit.propertyId)
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-900">
                        {editingId === unit.id ? (
                          <Input name="floor" value={editForm.floor} onChange={handleEditChange} placeholder="Floor" />
                        ) : (
                          unit.floor || '-'
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-900">
                        {editingId === unit.id ? (
                          <Input
                            name="sizeSqM"
                            type="number"
                            value={editForm.sizeSqM as any}
                            onChange={handleEditChange}
                            placeholder="Size (sqm)"
                          />
                        ) : (
                          unit.sizeSqM ? `${unit.sizeSqM} m²` : '-'
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editingId === unit.id ? (
                          <label className="inline-flex items-center space-x-2">
                            <input type="checkbox" name="isOccupied" checked={editForm.isOccupied} onChange={handleEditChange} />
                            <span className="text-sm">Occupied</span>
                          </label>
                        ) : (
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            unit.isOccupied 
                              ? 'bg-success-100 text-success-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {unit.isOccupied ? 'Occupied' : 'Vacant'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-900">
                        {new Date(unit.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          {editingId === unit.id ? (
                            <>
                              <Button size="sm" onClick={() => saveEdit(unit.id)} disabled={rowActionId === unit.id}>
                                Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={cancelEdit}>
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button variant="outline" size="sm" onClick={() => startEdit(unit)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => deleteUnit(unit.id)}
                                disabled={rowActionId === unit.id}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Add Unit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Add Unit</h3>
              <p className="text-sm text-gray-500">Create a new unit</p>
            </div>
            {createError && (
              <div className="mb-3 text-sm text-red-600">{createError}</div>
            )}
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
                <select
                  name="propertyId"
                  value={createForm.propertyId as any}
                  onChange={handleCreateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select property</option>
                  {(properties || []).map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit Number</label>
                <Input name="unitNumber" value={createForm.unitNumber} onChange={handleCreateChange} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
                  <Input name="floor" value={createForm.floor} onChange={handleCreateChange} placeholder="e.g., 1st" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Size (sqm)</label>
                  <Input name="sizeSqM" type="number" value={createForm.sizeSqM as any} onChange={handleCreateChange} />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="isOccupied" name="isOccupied" checked={createForm.isOccupied} onChange={handleCreateChange} />
                <label htmlFor="isOccupied" className="text-sm">Occupied</label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button type="submit" disabled={createLoading}>{createLoading ? 'Creating...' : 'Create Unit'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
