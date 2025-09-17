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

// Mock data for service requests
const serviceRequests = [
  {
    id: 1,
    category: 'Plumbing',
    title: 'Leaky faucet in kitchen',
    description: 'The kitchen faucet has been dripping continuously for the past week. Water is pooling under the sink and causing damage to the cabinet.',
    priority: 'Medium',
    status: 'in-progress',
    assignedTo: 'John Plumbing Services',
    assignedToPhone: '+263 77 123 4567',
    assignedToEmail: 'john@plumbing.co.zw',
    requestedAt: '2024-01-15T10:30:00',
    scheduledFor: '2024-01-16T14:00:00',
    completedAt: null,
    estimatedCost: 50,
    actualCost: null,
    images: ['/images/leaky-faucet-1.jpg', '/images/leaky-faucet-2.jpg'],
    unit: 'B-05'
  },
  {
    id: 2,
    category: 'Electrical',
    title: 'Light not working in bedroom',
    description: 'The bedroom light fixture stopped working yesterday. Tried changing the bulb but still no power. The switch also feels loose.',
    priority: 'High',
    status: 'pending',
    assignedTo: null,
    assignedToPhone: null,
    assignedToEmail: null,
    requestedAt: '2024-01-14T16:45:00',
    scheduledFor: null,
    completedAt: null,
    estimatedCost: 75,
    actualCost: null,
    images: ['/images/broken-light.jpg'],
    unit: 'B-05'
  },
  {
    id: 3,
    category: 'Maintenance',
    title: 'Door lock is sticking',
    description: 'The front door lock has become difficult to turn and sometimes gets stuck. Need lubrication or repair.',
    priority: 'Low',
    status: 'completed',
    assignedTo: 'Maintenance Team',
    assignedToPhone: '+263 77 333 3333',
    assignedToEmail: 'maintenance@complex.co.zw',
    requestedAt: '2024-01-10T09:00:00',
    scheduledFor: '2024-01-12T10:00:00',
    completedAt: '2024-01-12T15:30:00',
    estimatedCost: 30,
    actualCost: 25,
    images: [],
    unit: 'B-05'
  },
  {
    id: 4,
    category: 'Cleaning',
    title: 'Deep clean after renovation',
    description: 'Unit needs deep cleaning after recent renovation work. Carpets, walls, and fixtures need attention.',
    priority: 'Medium',
    status: 'cancelled',
    assignedTo: 'Clean Supplies Ltd',
    assignedToPhone: '+263 77 444 4444',
    assignedToEmail: 'contact@cleansupplies.co.zw',
    requestedAt: '2024-01-13T11:20:00',
    scheduledFor: '2024-01-15T09:00:00',
    completedAt: null,
    estimatedCost: 120,
    actualCost: null,
    images: [],
    unit: 'B-05'
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

  const filteredRequests = serviceRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus
    const matchesCategory = filterCategory === 'all' || request.category === filterCategory
    return matchesSearch && matchesStatus && matchesCategory
  })

  const stats = {
    total: serviceRequests.length,
    pending: serviceRequests.filter(r => r.status === 'pending').length,
    inProgress: serviceRequests.filter(r => r.status === 'in-progress').length,
    completed: serviceRequests.filter(r => r.status === 'completed').length,
    cancelled: serviceRequests.filter(r => r.status === 'cancelled').length
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
              <Button variant="outline" className="w-full sm:w-auto">
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
                            {getDaysAgo(request.requestedAt)}
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
                        <p className="font-medium">${request.estimatedCost}</p>
                      </div>
                      {request.actualCost && (
                        <div>
                          <span className="text-gray-600">Actual Cost:</span>
                          <p className="font-medium">${request.actualCost}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-600">Requested:</span>
                        <p className="font-medium">{formatDateTime(request.requestedAt)}</p>
                      </div>
                    </div>

                    {request.images.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-900 mb-2">Attached Images:</p>
                        <div className="flex space-x-2">
                          {request.images.map((image, index) => (
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
                                {request.assignedToPhone}
                              </span>
                              <span className="flex items-center">
                                <Mail className="h-4 w-4 mr-1" />
                                {request.assignedToEmail}
                              </span>
                            </div>
                          </div>
                          {request.scheduledFor && (
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Scheduled for:</p>
                              <p className="font-medium">{formatDateTime(request.scheduledFor)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 lg:mt-0 lg:ml-6">
                    <div className="flex flex-col space-y-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      {request.status === 'pending' && (
                        <Button variant="outline" size="sm" className="w-full">
                          <Wrench className="h-4 w-4 mr-1" />
                          Update Request
                        </Button>
                      )}
                      {request.status === 'completed' && (
                        <Button variant="outline" size="sm" className="w-full">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Brief description of the issue" />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Detailed description of the issue"
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="flex space-x-3">
                  <Button className="flex-1">Submit Request</Button>
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
