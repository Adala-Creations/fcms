'use client'

import { useState } from 'react'
import { Search, Filter, QrCode, Clock, CheckCircle, XCircle, Plus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Header from '@/components/layout/header'
import { formatDate, formatDateTime, getStatusColor } from '@/lib/utils'
import { useApi } from '@/lib/hooks/useApi'
import { useToast } from '@/lib/hooks/useToast'
import { visitorService } from '@/lib/services/api.service'
import type { VisitorDto } from '@/lib/types/api'

const purposeOptions = ['all', 'Social visit', 'Delivery', 'Maintenance', 'Family visit', 'Business']

export default function VisitorsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [purposeFilter, setPurposeFilter] = useState('all')
  const [showQRModal, setShowQRModal] = useState(false)
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorDto | null>(null)
  const [visitorForm, setVisitorForm] = useState({ name: '', purpose: 'Social visit', contact: '', unitId: 1 })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { success, error: showError } = useToast()

  // Fetch visitors from backend
  const { data: visitors, loading, error, refetch } = useApi(
    () => visitorService.getVisitors(),
    []
  )

  // Helper function to determine visitor status
  const getVisitorStatus = (visitor: VisitorDto) => {
    if (visitor.checkOut) return 'completed'
    if (visitor.checkIn) return 'active'
    return 'pending'
  }

  const filteredVisitors = (visitors || []).filter(visitor => {
    const matchesSearch = visitor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visitor.contactNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visitor.visitReason?.toLowerCase().includes(searchTerm.toLowerCase())
    const status = getVisitorStatus(visitor)
    const matchesStatus = statusFilter === 'all' || status === statusFilter
    const matchesPurpose = purposeFilter === 'all' || visitor.visitReason === purposeFilter
    
    return matchesSearch && matchesStatus && matchesPurpose
  })

  const activeVisitors = (visitors || []).filter(v => v.checkIn && !v.checkOut).length
  const completedToday = (visitors || []).filter(v => 
    v.checkOut && new Date(v.checkOut).toDateString() === new Date().toDateString()
  ).length

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' }
  ]

  const handleGenerateQR = (visitor: VisitorDto) => {
    setSelectedVisitor(visitor)
    setVisitorForm({ name: '', purpose: 'Social visit', contact: '', unitId: 1 })
    setShowQRModal(true)
  }

  const handleCreateVisitor = async () => {
    if (!visitorForm.name.trim()) {
      showError('Please enter visitor name.')
      return
    }
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
    if (!userId) {
      showError('You must be logged in to create a visitor.')
      return
    }
    setIsSubmitting(true)
    try {
      await visitorService.createVisitor({
        name: visitorForm.name.trim(),
        visitReason: visitorForm.purpose,
        contactNumber: visitorForm.contact.trim() || undefined,
        checkIn: new Date().toISOString(),
        unitId: visitorForm.unitId,
        createdBy: userId
      })
      success('Visitor created successfully!')
      setShowQRModal(false)
      setVisitorForm({ name: '', purpose: 'Social visit', contact: '', unitId: 1 })
      refetch()
    } catch (err: any) {
      showError(err.message || 'Failed to create visitor')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <Header 
        title="Visitor Management" 
        subtitle="Manage visitor access codes and track visitor logs"
      />
      
      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Visitors</CardTitle>
              <Clock className="h-4 w-4 text-primary-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-600">{activeVisitors}</div>
              <p className="text-xs text-muted-foreground">Currently on premises</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-success-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success-600">{completedToday}</div>
              <p className="text-xs text-muted-foreground">Visits completed today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total This Month</CardTitle>
              <QrCode className="h-4 w-4 text-warning-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning-600">{visitors?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Visitor codes generated</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <CardTitle>Visitor Logs</CardTitle>
                <CardDescription>Track all visitor access and activities</CardDescription>
              </div>
              <Button onClick={() => { setVisitorForm({ name: '', purpose: 'Social visit', contact: '', unitId: 1 }); setShowQRModal(true) }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Visitor
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search visitors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                value={purposeFilter}
                onChange={(e) => setPurposeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {purposeOptions.map(purpose => (
                  <option key={purpose} value={purpose}>
                    {purpose === 'all' ? 'All Purposes' : purpose}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading visitors...</div>
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
                <h2 className="text-2xl font-bold text-yellow-800">Failed to load visitors</h2>
              </div>
              <p className="text-sm text-yellow-700 max-w-md">{String(error)}</p>
              <Button variant="outline" onClick={refetch}>Retry</Button>
            </div>
          </div>
        )}

        {/* Visitors Table */}
        {!loading && !error && (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Visitor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Resident / Unit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Purpose
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time In
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time Out
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredVisitors.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                          No visitors found
                        </td>
                      </tr>
                    ) : (
                      filteredVisitors.map((visitor) => (
                        <tr key={visitor.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{visitor.name}</div>
                            <div className="text-sm text-gray-500">{visitor.contactNumber}</div>
                            <div className="text-xs text-gray-400">ID: {visitor.id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{visitor.createdBy || 'N/A'}</div>
                            <div className="text-sm text-gray-500">Unit {visitor.unitId || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {visitor.visitReason || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(getVisitorStatus(visitor))}`}>
                              {getVisitorStatus(visitor).charAt(0).toUpperCase() + getVisitorStatus(visitor).slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {visitor.checkIn ? formatDateTime(visitor.checkIn) : 'Not checked in'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {visitor.checkOut ? formatDateTime(visitor.checkOut) : 'Still active'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleGenerateQR(visitor)}
                              >
                                <QrCode className="h-4 w-4" />
                              </Button>
                              {getVisitorStatus(visitor) === 'active' && (
                                <Button variant="ghost" size="sm" className="text-danger-600 hover:text-danger-700">
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Visitor Modal */}
      {showQRModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">Create Visitor</h3>
              <p className="text-sm text-gray-500 mb-4">Add a visitor to the log. Visitors created by tenants will also appear here.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Visitor Name *</label>
                  <Input
                    placeholder="Enter visitor name"
                    value={visitorForm.name}
                    onChange={e => setVisitorForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={visitorForm.purpose}
                    onChange={e => setVisitorForm(prev => ({ ...prev, purpose: e.target.value }))}
                  >
                    {purposeOptions.filter(p => p !== 'all').map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <Input
                    placeholder="Enter visitor phone number"
                    value={visitorForm.contact}
                    onChange={e => setVisitorForm(prev => ({ ...prev, contact: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setShowQRModal(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button onClick={handleCreateVisitor} disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Visitor'}
                </Button>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}
