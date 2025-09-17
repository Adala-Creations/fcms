'use client'

import { useState } from 'react'
import { 
  Wrench, 
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
  MapPin,
  DollarSign,
  FileText
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Header from '@/components/layout/header'

// Mock data for service provider jobs
const jobs = [
  {
    id: 1,
    unit: 'A-01',
    tenantName: 'Jane Smith',
    category: 'Plumbing',
    title: 'Leaky faucet in kitchen',
    description: 'The kitchen faucet has been dripping continuously for the past week. Water is pooling under the sink and causing damage to the cabinet.',
    priority: 'Medium',
    status: 'assigned',
    assignedAt: '2024-01-15T10:30:00',
    scheduledFor: '2024-01-16T14:00:00',
    startedAt: null,
    completedAt: null,
    estimatedCost: 50,
    actualCost: null,
    estimatedDuration: '2 hours',
    actualDuration: null,
    tenantPhone: '+263 77 111 1111',
    tenantEmail: 'jane.smith@email.com',
    tenantAddress: 'Unit A-01, Block A, Sunset Gardens Complex',
    specialInstructions: 'Please bring replacement washers and check for any pipe damage.',
    materials: ['Faucet washers', 'Pipe wrench', 'Plumber\'s tape'],
    tools: ['Adjustable wrench', 'Screwdriver set', 'Pipe cutter']
  },
  {
    id: 2,
    unit: 'B-05',
    tenantName: 'Mike Davis',
    category: 'Electrical',
    title: 'Light not working in bedroom',
    description: 'The bedroom light fixture stopped working yesterday. Tried changing the bulb but still no power. The switch also feels loose.',
    priority: 'High',
    status: 'in-progress',
    assignedAt: '2024-01-14T16:45:00',
    scheduledFor: '2024-01-15T09:00:00',
    startedAt: '2024-01-15T09:15:00',
    completedAt: null,
    estimatedCost: 75,
    actualCost: null,
    estimatedDuration: '1.5 hours',
    actualDuration: null,
    tenantPhone: '+263 77 222 2222',
    tenantEmail: 'mike.davis@email.com',
    tenantAddress: 'Unit B-05, Block B, Sunset Gardens Complex',
    specialInstructions: 'Check the wiring in the switch box and replace if necessary.',
    materials: ['Light switch', 'Electrical wire', 'Wire nuts'],
    tools: ['Voltage tester', 'Wire strippers', 'Screwdriver set']
  },
  {
    id: 3,
    unit: 'C-08',
    tenantName: 'Alice Brown',
    category: 'Maintenance',
    title: 'Door lock is sticking',
    description: 'The front door lock has become difficult to turn and sometimes gets stuck. Need lubrication or repair.',
    priority: 'Low',
    status: 'completed',
    assignedAt: '2024-01-10T09:00:00',
    scheduledFor: '2024-01-12T10:00:00',
    startedAt: '2024-01-12T10:15:00',
    completedAt: '2024-01-12T11:30:00',
    estimatedCost: 30,
    actualCost: 25,
    estimatedDuration: '1 hour',
    actualDuration: '1 hour 15 minutes',
    tenantPhone: '+263 77 333 3333',
    tenantEmail: 'alice.brown@email.com',
    tenantAddress: 'Unit C-08, Block C, Sunset Gardens Complex',
    specialInstructions: 'Apply lubricant and adjust if needed.',
    materials: ['Lock lubricant', 'Replacement key'],
    tools: ['Screwdriver set', 'Lock picks']
  },
  {
    id: 4,
    unit: 'A-12',
    tenantName: 'Bob Wilson',
    category: 'Plumbing',
    title: 'Toilet not flushing properly',
    description: 'The toilet is not flushing properly and water level is low. Suspected issue with the flapper or fill valve.',
    priority: 'Medium',
    status: 'pending',
    assignedAt: '2024-01-16T11:20:00',
    scheduledFor: '2024-01-17T15:00:00',
    startedAt: null,
    completedAt: null,
    estimatedCost: 40,
    actualCost: null,
    estimatedDuration: '1 hour',
    actualDuration: null,
    tenantPhone: '+263 77 444 4444',
    tenantEmail: 'bob.wilson@email.com',
    tenantAddress: 'Unit A-12, Block A, Sunset Gardens Complex',
    specialInstructions: 'Check both flapper and fill valve, replace as needed.',
    materials: ['Toilet flapper', 'Fill valve', 'Toilet wax ring'],
    tools: ['Adjustable wrench', 'Plunger', 'Toilet repair kit']
  }
]

const statusColors = {
  pending: 'bg-gray-100 text-gray-800',
  assigned: 'bg-warning-100 text-warning-800',
  'in-progress': 'bg-primary-100 text-primary-800',
  completed: 'bg-success-100 text-success-800',
  cancelled: 'bg-danger-100 text-danger-800'
}

const statusIcons = {
  pending: Clock,
  assigned: AlertCircle,
  'in-progress': AlertCircle,
  completed: CheckCircle,
  cancelled: XCircle
}

const priorityColors = {
  Low: 'bg-gray-100 text-gray-800',
  Medium: 'bg-warning-100 text-warning-800',
  High: 'bg-danger-100 text-danger-800'
}

export default function ProviderJobs() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [selectedJob, setSelectedJob] = useState(null)

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus
    const matchesCategory = filterCategory === 'all' || job.category === filterCategory
    return matchesSearch && matchesStatus && matchesCategory
  })

  const stats = {
    total: jobs.length,
    pending: jobs.filter(j => j.status === 'pending').length,
    assigned: jobs.filter(j => j.status === 'assigned').length,
    inProgress: jobs.filter(j => j.status === 'in-progress').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    totalEarnings: jobs.filter(j => j.status === 'completed').reduce((sum, j) => sum + (j.actualCost || 0), 0)
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

  const updateJobStatus = (jobId: number, newStatus: string) => {
    // In a real app, this would update the job status via API
    console.log(`Updating job ${jobId} to status: ${newStatus}`)
  }

  return (
    <div className="space-y-6">
      <Header 
        title="My Jobs" 
        subtitle="Manage your assigned service requests and jobs"
      />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Wrench className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
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
                <p className="text-sm font-medium text-gray-600">Assigned</p>
                <p className="text-2xl font-bold text-gray-900">{stats.assigned}</p>
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
              <DollarSign className="h-8 w-8 text-success-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalEarnings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search jobs..."
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
                <option value="assigned">Assigned</option>
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

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => {
          const StatusIcon = statusIcons[job.status as keyof typeof statusIcons]
          return (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {job.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {job.unit} • {job.tenantName}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {getDaysAgo(job.assignedAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${priorityColors[job.priority as keyof typeof priorityColors]}`}>
                          {job.priority}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${statusColors[job.status as keyof typeof statusColors]}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {job.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{job.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Category:</span>
                        <p className="font-medium">{job.category}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Estimated Cost:</span>
                        <p className="font-medium">${job.estimatedCost}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Duration:</span>
                        <p className="font-medium">{job.estimatedDuration}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Scheduled:</span>
                        <p className="font-medium">{formatDateTime(job.scheduledFor)}</p>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          {job.tenantPhone}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          {job.tenantEmail}
                        </div>
                        <div className="flex items-center text-gray-600 md:col-span-2">
                          <MapPin className="h-4 w-4 mr-2" />
                          {job.tenantAddress}
                        </div>
                      </div>
                    </div>

                    {/* Special Instructions */}
                    {job.specialInstructions && (
                      <div className="mt-4 p-4 bg-warning-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Special Instructions</h4>
                        <p className="text-sm text-gray-700">{job.specialInstructions}</p>
                      </div>
                    )}

                    {/* Materials and Tools */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Required Materials</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {job.materials.map((material, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                              {material}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Required Tools</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {job.tools.map((tool, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                              {tool}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 lg:mt-0 lg:ml-6">
                    <div className="flex flex-col space-y-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      {job.status === 'assigned' && (
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => updateJobStatus(job.id, 'in-progress')}
                        >
                          <Wrench className="h-4 w-4 mr-1" />
                          Start Job
                        </Button>
                      )}
                      {job.status === 'in-progress' && (
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => updateJobStatus(job.id, 'completed')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete Job
                        </Button>
                      )}
                      {job.status === 'completed' && (
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
    </div>
  )
}
