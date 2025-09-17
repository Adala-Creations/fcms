'use client'

import { useState } from 'react'
import { 
  Shield, 
  Plus, 
  Search, 
  Filter, 
  Eye,
  QrCode,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Copy,
  User,
  Phone,
  Mail
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Header from '@/components/layout/header'

// Mock data for tenant's visitors
const visitors = [
  {
    id: 1,
    visitorName: 'Mike Johnson',
    unit: 'B-05',
    code: 'VST-001',
    qrCode: '/qr-codes/vst-001.png',
    status: 'active',
    issuedAt: '2024-01-15T10:30:00',
    expiresAt: '2024-01-15T18:30:00',
    timeIn: '2024-01-15T11:00:00',
    timeOut: null,
    purpose: 'Family visit',
    phone: '+263 77 123 4567',
    email: 'mike.johnson@email.com',
    issuedBy: 'Jane Smith'
  },
  {
    id: 2,
    visitorName: 'Sarah Lee',
    unit: 'B-05',
    code: 'VST-002',
    qrCode: '/qr-codes/vst-002.png',
    status: 'completed',
    issuedAt: '2024-01-14T14:00:00',
    expiresAt: '2024-01-14T22:00:00',
    timeIn: '2024-01-14T14:30:00',
    timeOut: '2024-01-14T17:45:00',
    purpose: 'Delivery',
    phone: '+263 77 234 5678',
    email: 'sarah.lee@email.com',
    issuedBy: 'Jane Smith'
  },
  {
    id: 3,
    visitorName: 'John Wilson',
    unit: 'B-05',
    code: 'VST-003',
    qrCode: '/qr-codes/vst-003.png',
    status: 'expired',
    issuedAt: '2024-01-13T09:00:00',
    expiresAt: '2024-01-13T17:00:00',
    timeIn: '2024-01-13T09:15:00',
    timeOut: null,
    purpose: 'Maintenance',
    phone: '+263 77 345 6789',
    email: 'john.wilson@email.com',
    issuedBy: 'Jane Smith'
  },
  {
    id: 4,
    visitorName: 'Alice Brown',
    unit: 'B-05',
    code: 'VST-004',
    qrCode: '/qr-codes/vst-004.png',
    status: 'active',
    issuedAt: '2024-01-15T16:00:00',
    expiresAt: '2024-01-15T20:00:00',
    timeIn: '2024-01-15T16:30:00',
    timeOut: null,
    purpose: 'Social visit',
    phone: '+263 77 456 7890',
    email: 'alice.brown@email.com',
    issuedBy: 'Jane Smith'
  }
]

const statusColors = {
  active: 'bg-success-100 text-success-800',
  completed: 'bg-primary-100 text-primary-800',
  expired: 'bg-danger-100 text-danger-800',
  pending: 'bg-warning-100 text-warning-800'
}

const statusIcons = {
  active: CheckCircle,
  completed: CheckCircle,
  expired: AlertCircle,
  pending: Clock
}

export default function TenantVisitors() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showGenerateModal, setShowGenerateModal] = useState(false)

  const filteredVisitors = visitors.filter(visitor => {
    const matchesSearch = visitor.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visitor.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visitor.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || visitor.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: visitors.length,
    active: visitors.filter(v => v.status === 'active').length,
    completed: visitors.filter(v => v.status === 'completed').length,
    expired: visitors.filter(v => v.status === 'expired').length
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getDuration = (timeIn: string, timeOut: string | null) => {
    if (!timeOut) return 'In progress'
    const start = new Date(timeIn)
    const end = new Date(timeOut)
    const diff = end.getTime() - start.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Show success message
  }

  const generateVisitorCode = () => {
    // In a real app, this would generate a new visitor code
    console.log('Generating new visitor code...')
  }

  return (
    <div className="space-y-6">
      <Header 
        title="Visitor Management" 
        subtitle="Generate and manage visitor access codes for your unit"
      />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Visitors</p>
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
              <Clock className="h-8 w-8 text-primary-600" />
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
              <AlertCircle className="h-8 w-8 text-danger-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Expired</p>
                <p className="text-2xl font-bold text-gray-900">{stats.expired}</p>
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
              <p className="text-sm text-gray-600">Generate visitor codes and manage access</p>
            </div>
            <div className="flex space-x-3">
              <Button onClick={generateVisitorCode} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Generate New Code
              </Button>
              <Button variant="outline" className="w-full sm:w-auto">
                <QrCode className="h-4 w-4 mr-2" />
                Scan QR Code
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search visitors..."
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
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="expired">Expired</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visitors List */}
      <div className="space-y-4">
        {filteredVisitors.map((visitor) => {
          const StatusIcon = statusIcons[visitor.status as keyof typeof statusIcons]
          return (
            <Card key={visitor.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {visitor.visitorName}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {visitor.purpose}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatTime(visitor.issuedAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${statusColors[visitor.status as keyof typeof statusColors]}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {visitor.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Visitor Code:</span>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                            {visitor.code}
                          </span>
                          <button
                            onClick={() => copyToClipboard(visitor.code)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <p className="font-medium">{visitor.phone}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Time In:</span>
                        <p className="font-medium">
                          {visitor.timeIn ? formatTime(visitor.timeIn) : 'Not arrived'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Duration:</span>
                        <p className="font-medium">
                          {getDuration(visitor.timeIn, visitor.timeOut)}
                        </p>
                      </div>
                    </div>

                    {visitor.status === 'active' && (
                      <div className="mt-4 p-4 bg-success-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-success-800">
                              Visitor is currently on the premises
                            </p>
                            <p className="text-xs text-success-600">
                              Expected to leave by {formatTime(visitor.expiresAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-success-600">QR Code Active</p>
                            <p className="text-xs text-success-500">Show to security</p>
                          </div>
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
                      <Button variant="outline" size="sm" className="w-full">
                        <QrCode className="h-4 w-4 mr-1" />
                        Show QR Code
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest visitor activities and access events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredVisitors.slice(0, 5).map((visitor) => (
              <div key={visitor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    visitor.status === 'active' ? 'bg-success-500' :
                    visitor.status === 'completed' ? 'bg-primary-500' :
                    'bg-danger-500'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {visitor.visitorName} - {visitor.purpose}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTime(visitor.issuedAt)} • Code: {visitor.code}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {visitor.status === 'active' ? 'Currently inside' :
                     visitor.status === 'completed' ? 'Visit completed' :
                     'Code expired'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {visitor.timeIn ? formatTime(visitor.timeIn) : 'Not arrived'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
