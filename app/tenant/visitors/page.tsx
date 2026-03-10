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
  Mail,
  X
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Header from '@/components/layout/header'
import { useToast } from '@/lib/hooks/useToast'
import { useApi } from '@/lib/hooks/useApi'
import { visitorService } from '@/lib/services/api.service'
import type { VisitorDto } from '@/lib/types/api'

// Mock data for tenant's visitors - mapped to match VisitorDto where possible
const visitorsData: any[] = [
  {
    id: 1,
    name: 'John Doe',
    visitReason: 'Social Visit',
    checkIn: '2024-03-20T10:00:00',
    checkOut: null,
    status: 'Active',
    code: '123456',
    contactNumber: '+263 77 000 0001'
  },
  {
    id: 2,
    name: 'Alice Smith',
    visitReason: 'Delivery',
    checkIn: '2024-03-19T14:30:00',
    checkOut: '2024-03-19T14:45:00',
    status: 'Completed',
    code: '654321',
    contactNumber: '+263 77 000 0002'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    visitReason: 'Maintenance',
    checkIn: '2024-03-18T09:00:00',
    checkOut: null,
    status: 'Expired',
    code: '111222',
    contactNumber: '+263 77 000 0003'
  },
  {
    id: 4,
    name: 'Alice Brown',
    visitReason: 'Social Visit',
    checkIn: '2024-03-20T16:00:00',
    checkOut: null,
    status: 'Active',
    code: 'VST-004',
    contactNumber: '+263 77 456 7890'
  }
]

const statusColors = {
  Active: 'bg-success-100 text-success-800',
  Completed: 'bg-primary-100 text-primary-800',
  Expired: 'bg-danger-100 text-danger-800',
  Pending: 'bg-warning-100 text-warning-800'
}

const statusIcons = {
  Active: CheckCircle,
  Completed: CheckCircle,
  Expired: AlertCircle,
  Pending: Clock
}

export default function TenantVisitors() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const { info, success, error: showError } = useToast()
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [visitorName, setVisitorName] = useState('')
  const [generatedCode, setGeneratedCode] = useState<string | null>(null)

  // Fetch real visitors from API
  const { data: apiVisitors, loading, error, refetch } = useApi(
    () => visitorService.getVisitors(),
    []
  )

  // Use API data if available, otherwise fallback to mock data
  const visitors = apiVisitors || visitorsData

  const filteredVisitors = visitors.filter(visitor => {
    const matchesSearch = (visitor.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (visitor.visitReason || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      ((visitor as any).code || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || (visitor as any).status?.toLowerCase() === filterStatus.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: visitors.length,
    active: visitors.filter(v => (v as any).status === 'Active').length,
    completed: visitors.filter(v => (v as any).status === 'Completed').length,
    expired: visitors.filter(v => (v as any).status === 'Expired').length
  }

  const formatTime = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString()
  }

  const getDuration = (checkIn: string, checkOut: string | null) => {
    if (!checkIn) return 'N/A'
    if (!checkOut) return 'In progress'
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diff = end.getTime() - start.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    success("Visitor code copied to clipboard.")
  }

  const handleAction = (action: string, visitor?: any) => {
    if (action === 'Generate New Code') {
      // This will open the form to generate a new code
      // For now, we'll simulate generation and show the code modal
      const newCode = "VST-" + Math.floor(Math.random() * 1000).toString().padStart(3, '0')
      setGeneratedCode(newCode)
      setVisitorName('New Visitor') // Placeholder
      setShowCodeModal(true)
    } else if (action === 'Show QR Code' && visitor) {
      setGeneratedCode(visitor.code)
      setVisitorName(visitor.name)
      setShowCodeModal(true)
    } else {
      info(`Performing ${action.toLowerCase()} action. This feature is being simulated for now.`)
    }
  }

  const handleGenerateCode = () => {
    // This function would typically handle form submission and API call
    // For now, it's integrated into handleAction for simulation
    setShowCodeModal(false) // Close the code display modal
    success("New visitor code generated!")
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
              <Button onClick={() => handleAction('Generate New Code')} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Generate New Code
              </Button>
              <Button onClick={() => handleAction('Scan QR Code')} variant="outline" className="w-full sm:w-auto">
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
                          {visitor.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {visitor.visitReason}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatTime(visitor.checkIn)}
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
                        <p className="font-medium">{visitor.contactNumber}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Time In:</span>
                        <p className="font-medium">
                          {visitor.checkIn ? formatTime(visitor.checkIn) : 'Not arrived'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Duration:</span>
                        <p className="font-medium">
                          {getDuration(visitor.checkIn, visitor.checkOut)}
                        </p>
                      </div>
                    </div>

                    {visitor.status === 'Active' && (
                      <div className="mt-4 p-4 bg-success-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-success-800">
                              Visitor is currently on the premises
                            </p>
                            <p className="text-xs text-success-600">
                              Expected to leave by {formatTime(visitor.checkOut || '')}
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
                      <Button onClick={() => handleAction('View Details', visitor)} variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button onClick={() => handleAction('Show QR Code', visitor)} variant="outline" size="sm" className="w-full">
                        <QrCode className="h-4 w-4 mr-1" />
                        Show QR Code
                      </Button>
                      <Button onClick={() => handleAction('Download QR Code', visitor)} variant="outline" size="sm" className="w-full">
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
                  <div className={`w-2 h-2 rounded-full ${visitor.status === 'Active' ? 'bg-success-500' :
                    visitor.status === 'Completed' ? 'bg-primary-500' :
                      'bg-danger-500'
                    }`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {visitor.name} - {visitor.visitReason}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTime(visitor.checkIn)} • Code: {visitor.code}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {visitor.status === 'Active' ? 'Currently inside' :
                      visitor.status === 'Completed' ? 'Visit completed' :
                        'Code expired'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {visitor.checkIn ? formatTime(visitor.checkIn) : 'Not arrived'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generate Code Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Visitor Access Code</CardTitle>
                <CardDescription>Send this code to {visitorName}</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowCodeModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="purpose">Purpose of Visit</Label>
                  <Input id="purpose" placeholder="e.g. Social, Delivery, Maintenance" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryHours">Expires In (Hours)</Label>
                    <Input id="expiryHours" type="number" defaultValue={8} />
                  </div>
                </div>
                <div className="flex space-x-3 pt-4">
                  <Button onClick={handleGenerateCode} className="flex-1">
                    Generate Code
                  </Button>
                  <Button variant="outline" onClick={() => setShowCodeModal(false)}>
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
