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
  Copy
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Header from '@/components/layout/header'

// Mock data for visitors
const visitors = [
  {
    id: 1,
    visitorName: 'Mike Johnson',
    unit: 'A-01',
    tenantName: 'Jane Smith',
    code: 'VST-001',
    qrCode: '/qr-codes/vst-001.png',
    status: 'active',
    issuedAt: '2024-01-15T10:30:00',
    expiresAt: '2024-01-15T18:30:00',
    timeIn: '2024-01-15T11:00:00',
    timeOut: null,
    purpose: 'Family visit',
    phone: '+263 77 123 4567',
    issuedBy: 'Jane Smith'
  },
  {
    id: 2,
    visitorName: 'Sarah Lee',
    unit: 'B-01',
    tenantName: 'Mike Davis',
    code: 'VST-002',
    qrCode: '/qr-codes/vst-002.png',
    status: 'completed',
    issuedAt: '2024-01-14T14:00:00',
    expiresAt: '2024-01-14T22:00:00',
    timeIn: '2024-01-14T14:30:00',
    timeOut: '2024-01-14T17:45:00',
    purpose: 'Delivery',
    phone: '+263 77 234 5678',
    issuedBy: 'Mike Davis'
  },
  {
    id: 3,
    visitorName: 'John Wilson',
    unit: 'A-01',
    tenantName: 'Jane Smith',
    code: 'VST-003',
    qrCode: '/qr-codes/vst-003.png',
    status: 'expired',
    issuedAt: '2024-01-13T09:00:00',
    expiresAt: '2024-01-13T17:00:00',
    timeIn: '2024-01-13T09:15:00',
    timeOut: null,
    purpose: 'Maintenance',
    phone: '+263 77 345 6789',
    issuedBy: 'Jane Smith'
  },
  {
    id: 4,
    visitorName: 'Alice Brown',
    unit: 'B-01',
    tenantName: 'Mike Davis',
    code: 'VST-004',
    qrCode: '/qr-codes/vst-004.png',
    status: 'active',
    issuedAt: '2024-01-15T16:00:00',
    expiresAt: '2024-01-15T20:00:00',
    timeIn: '2024-01-15T16:30:00',
    timeOut: null,
    purpose: 'Social visit',
    phone: '+263 77 456 7890',
    issuedBy: 'Mike Davis'
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

export default function OwnerVisitors() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [viewVisitor, setViewVisitor] = useState<typeof visitors[0] | null>(null)
  const [generatedCode, setGeneratedCode] = useState<string | null>(null)

  const filteredVisitors = visitors.filter(visitor => {
    const matchesSearch = visitor.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visitor.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visitor.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
  }

  const handleGenerateCode = () => {
    // Generate a fresh random code every time
    const random = Math.floor(Math.random() * 1000)
    const code = 'VST-' + String(random).padStart(3, '0')
    setGeneratedCode(code)
  }

  const handleViewVisitor = (v: typeof visitors[0]) => setViewVisitor(v)
  const handleDownloadVisitor = (v: typeof visitors[0]) => {
    const csv = `Visitor,Unit,Tenant,Code,Status,Time In,Purpose\n${v.visitorName},${v.unit},${v.tenantName},${v.code},${v.status},${v.timeIn},${v.purpose}`
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `visitor-${v.code}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Header 
        title="Visitor Management" 
        subtitle="Generate and manage visitor access codes"
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

      {/* Filters and Actions */}
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
            
            <Button onClick={() => setShowGenerateModal(true)} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Generate Code
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Visitors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Visitor Records ({filteredVisitors.length})</CardTitle>
          <CardDescription>
            Track all visitor access codes and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Visitor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Unit</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Code</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Time In</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Duration</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisitors.map((visitor) => {
                  const StatusIcon = statusIcons[visitor.status as keyof typeof statusIcons]
                  return (
                    <tr key={visitor.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{visitor.visitorName}</div>
                          <div className="text-sm text-gray-500">{visitor.phone}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{visitor.unit}</div>
                          <div className="text-sm text-gray-500">{visitor.tenantName}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            {visitor.code}
                          </span>
                          <button
                            onClick={() => copyToClipboard(visitor.code)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${statusColors[visitor.status as keyof typeof statusColors]}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {visitor.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-900">
                        {visitor.timeIn ? formatTime(visitor.timeIn) : '-'}
                      </td>
                      <td className="py-3 px-4 text-gray-900">
                        {getDuration(visitor.timeIn, visitor.timeOut)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewVisitor(visitor)} title="View details">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleViewVisitor(visitor)} title="View / Show QR code">
                            <QrCode className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDownloadVisitor(visitor)} title="Download">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

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
                      {visitor.visitorName} visited {visitor.unit}
                    </p>
                    <p className="text-xs text-gray-500">
                      {visitor.purpose} • {formatTime(visitor.issuedAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{visitor.code}</p>
                  <p className="text-xs text-gray-500">
                    {visitor.status === 'active' ? 'Currently inside' :
                     visitor.status === 'completed' ? 'Visit completed' :
                     'Code expired'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => { setShowGenerateModal(false); setGeneratedCode(null) }}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Generate Visitor Code</h3>
            {!generatedCode ? (
              <p className="text-sm text-gray-600 mb-4">Generate a one-time visitor access code for a tenant&apos;s guest.</p>
            ) : (
              <div className="p-4 bg-gray-100 rounded-lg mb-4">
                <p className="text-sm text-gray-600">Generated code:</p>
                <p className="text-2xl font-mono font-bold mt-1">{generatedCode}</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => copyToClipboard(generatedCode)}>Copy Code</Button>
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => { setShowGenerateModal(false); setGeneratedCode(null) }}>Close</Button>
              {!generatedCode ? (
                <Button onClick={handleGenerateCode}>Generate</Button>
              ) : (
                <Button onClick={() => { setGeneratedCode(null); handleGenerateCode() }}>Generate Another</Button>
              )}
            </div>
          </div>
        </div>
      )}

      {viewVisitor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setViewVisitor(null)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Visitor Details</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-600">Visitor:</span> {viewVisitor.visitorName}</p>
              <p><span className="text-gray-600">Unit:</span> {viewVisitor.unit} ({viewVisitor.tenantName})</p>
              <p><span className="text-gray-600">Code:</span> <span className="font-mono">{viewVisitor.code}</span> <button className="text-primary-600 ml-1" onClick={() => copyToClipboard(viewVisitor.code)}>Copy</button></p>
              <p><span className="text-gray-600">Status:</span> {viewVisitor.status}</p>
              <p><span className="text-gray-600">Time In:</span> {formatTime(viewVisitor.timeIn)}</p>
              <p><span className="text-gray-600">Purpose:</span> {viewVisitor.purpose}</p>
            </div>
            <Button variant="outline" className="mt-4" onClick={() => setViewVisitor(null)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  )
}
