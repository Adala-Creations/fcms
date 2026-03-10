'use client'

import { useState } from 'react'
import {
  Wrench,
  Plus,
  Search,
  Filter,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Calendar,
  User,
  Phone,
  Mail,
  Camera,
  FileText
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Header from '@/components/layout/header'
import { useToast } from '@/lib/hooks/useToast'
import { useApi } from '@/lib/hooks/useApi'
import { serviceRequestService } from '@/lib/services/api.service'
import type { ServiceRequestDto } from '@/lib/types/api'

// Mock data for service requests - mapped to match ServiceRequestDto where possible
const serviceRequestsData: any[] = [
  {
    id: 1,
    category: 'Plumbing',
    title: 'Leaking Tap',
    description: 'The kitchen tap is leaking constantly, wasting a lot of water.',
    priority: 'Medium',
    status: 'pending',
    requestedAt: '2024-03-10T10:30:00Z',
    unit: 'B-05'
  },
  {
    id: 2,
    category: 'Electrical',
    title: 'Flickering Lights',
    description: 'Living room lights are flickering.',
    priority: 'High',
    status: 'in-progress',
    requestedAt: '2024-03-09T14:00:00Z',
    unit: 'B-05',
    assignedTo: 'John Doe'
  }
]

const statusColors = {
  pending: 'bg-warning-100 text-warning-800',
  'in-progress': 'bg-primary-100 text-primary-800',
  completed: 'bg-success-100 text-success-800',
  cancelled: 'bg-danger-100 text-danger-800'
}

const statusIcons = {
  pending: Clock,
  'in-progress': AlertCircle,
  completed: CheckCircle,
  cancelled: XCircle
}

const priorityColors = {
  Low: 'bg-gray-100 text-gray-800',
  Medium: 'bg-warning-100 text-warning-800',
  High: 'bg-danger-100 text-danger-800'
}

export default function TenantRequests() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { info, success, error: showError } = useToast()

  const [createForm, setCreateForm] = useState({
    category: 'Plumbing',
    title: '',
    description: '',
    priority: 'Medium'
  })

  // Fetch real requests from API
  const { data: apiRequests, loading, error, refetch } = useApi(
    () => serviceRequestService.getServiceRequests(),
    []
  )

  const handleAction = (title: string) => {
    info(`Action Triggered: ${title}. Real functionality coming soon.`)
  }

  const handleCreateChange = (e: any) => {
    const { id, value } = e.target
    setCreateForm(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmitRequest = async () => {
    try {
      await serviceRequestService.createServiceRequest({
        ...createForm,
        unit: 'B-05', // Mock unit for now
        requestedAt: new Date().toISOString(),
        status: 'pending'
      } as any)

      setShowCreateModal(false)
      success("Service request submitted successfully!")
      refetch()
    } catch (err: any) {
      showError(`Failed to submit: ${err.message}`)
    }
  }

  // Use API data if available, otherwise fallback to mock data
  const requests = apiRequests || serviceRequestsData

  const filteredRequests = requests.filter(request => {
    const matchesSearch = ((request as any).title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      ((request as any).description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      ((request as any).category || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || (request as any).status === filterStatus
    const matchesCategory = filterCategory === 'all' || (request as any).category === filterCategory
    return matchesSearch && matchesStatus && matchesCategory
  })

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    inProgress: requests.filter(r => r.status === 'in-progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
    cancelled: requests.filter(r => r.status === 'cancelled').length
  }

  const categories = ['Plumbing', 'Electrical', 'Maintenance', 'Cleaning', 'Security', 'Other']

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getDaysAgo = (dateString: string) => {
    const now = new Date()
    const requestDate = new Date(dateString)
    const diffTime = Math.abs(now.getTime() - requestDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays === 0 ? 'Today' : `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }

  return (
    <div className="space-y-6">
      <Header
        title="Service Requests"
        subtitle="Request maintenance and report issues for your unit"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Wrench className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-warning-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-success-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-danger-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              <p className="text-sm text-gray-600">Report issues or request maintenance services</p>
            </div>
            <div className="flex space-x-3">
              <Button onClick={() => setShowCreateModal(true)} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
              <Button onClick={() => handleAction('Report Issue')} variant="outline" className="w-full sm:w-auto">
                <Camera className="h-4 w-4 mr-2" />
                Report Issue
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search requests..."
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
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

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
          </div>
        </CardContent>
      </Card>

      {/* Service Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => {
          const StatusIcon = statusIcons[request.status as keyof typeof statusIcons]
          return (
            <Card key={request.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {request.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {request.unit}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDateTime((request as any).requestedAt || (request as any).requestDate)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${priorityColors[request.priority as keyof typeof priorityColors]}`}>
                          {request.priority}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${statusColors[request.status as keyof typeof statusColors]}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {request.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{request.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Category:</span>
                        <p className="font-medium">{request.category}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Estimated Cost:</span>
                        <p className="font-medium">${(request as any).estimatedCost}</p>
                      </div>
                      {(request as any).actualCost && (
                        <div>
                          <span className="text-gray-600">Actual Cost:</span>
                          <p className="font-medium">${(request as any).actualCost}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-600">Requested:</span>
                        <p className="font-medium">{formatDateTime(request.requestedAt)}</p>
                      </div>
                    </div>

                    {(request as any).images?.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-900 mb-2">Attached Images:</p>
                        <div className="flex space-x-2">
                          {(request as any).images.map((image: string, index: number) => (
                            <div key={index} className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Camera className="h-6 w-6 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {request.assignedTo && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Assigned Service Provider</h4>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{request.assignedTo}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span className="flex items-center">
                                <Phone className="h-4 w-4 mr-1" />
                                {(request as any).assignedToPhone}
                              </span>
                              <span className="flex items-center">
                                <Mail className="h-4 w-4 mr-1" />
                                {(request as any).assignedToEmail}
                              </span>
                            </div>
                          </div>
                          {(request as any).scheduledFor && (
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Scheduled for:</p>
                              <p className="font-medium">{formatDateTime((request as any).scheduledFor)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 lg:mt-0 lg:ml-6">
                    <div className="flex flex-col space-y-2">
                      <Button onClick={() => handleAction('View Details')} variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      {request.status === 'pending' && (
                        <Button onClick={() => handleAction('Update Request')} variant="outline" size="sm" className="w-full">
                          <Wrench className="h-4 w-4 mr-1" />
                          Update Request
                        </Button>
                      )}
                      {request.status === 'completed' && (
                        <Button onClick={() => handleAction('View Report')} variant="outline" size="sm" className="w-full">
                          <FileText className="h-4 w-4 mr-1" />
                          View Report
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Create Request Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Create Service Request</CardTitle>
              <CardDescription>Report an issue or request maintenance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={createForm.category}
                    onChange={handleCreateChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={createForm.title}
                    onChange={handleCreateChange}
                    placeholder="Brief description of the issue"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    rows={3}
                    value={createForm.description}
                    onChange={handleCreateChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Detailed description of the issue"
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    value={createForm.priority}
                    onChange={handleCreateChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="flex space-x-3">
                  <Button onClick={handleSubmitRequest} className="flex-1">Submit Request</Button>
                  <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
