'use client'

import { useState } from 'react'
import { Search, Filter, QrCode, Clock, CheckCircle, XCircle, Plus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Header from '@/components/layout/header'
import { formatDate, formatDateTime, getStatusColor } from '@/lib/utils'

// Mock data
const visitors = [
  {
    id: 1,
    visitorName: 'Mike Johnson',
    residentName: 'John Doe',
    unit: 'A-12',
    code: 'QR-001-2024',
    status: 'active',
    issuedBy: 'John Doe',
    scannedBy: 'Security Guard 1',
    timeIn: '2024-01-15T10:30:00Z',
    timeOut: null,
    purpose: 'Social visit',
    phone: '+263 77 123 4567'
  },
  {
    id: 2,
    visitorName: 'Sarah Wilson',
    residentName: 'Jane Smith',
    unit: 'B-05',
    code: 'QR-002-2024',
    status: 'completed',
    issuedBy: 'Jane Smith',
    scannedBy: 'Security Guard 2',
    timeIn: '2024-01-14T15:45:00Z',
    timeOut: '2024-01-14T18:30:00Z',
    purpose: 'Delivery',
    phone: '+263 77 234 5678'
  },
  {
    id: 3,
    visitorName: 'David Brown',
    residentName: 'Bob Wilson',
    unit: 'C-08',
    code: 'QR-003-2024',
    status: 'expired',
    issuedBy: 'Bob Wilson',
    scannedBy: null,
    timeIn: null,
    timeOut: null,
    purpose: 'Maintenance',
    phone: '+263 77 345 6789'
  },
  {
    id: 4,
    visitorName: 'Lisa Davis',
    residentName: 'Alice Brown',
    unit: 'A-15',
    code: 'QR-004-2024',
    status: 'active',
    issuedBy: 'Alice Brown',
    scannedBy: 'Security Guard 1',
    timeIn: '2024-01-15T14:20:00Z',
    timeOut: null,
    purpose: 'Family visit',
    phone: '+263 77 456 7890'
  }
]

const statusOptions = ['all', 'active', 'completed', 'expired']
const purposeOptions = ['all', 'Social visit', 'Delivery', 'Maintenance', 'Family visit', 'Business']

export default function VisitorsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [purposeFilter, setPurposeFilter] = useState('all')
  const [showQRModal, setShowQRModal] = useState(false)
  const [selectedVisitor, setSelectedVisitor] = useState(null)

  const filteredVisitors = visitors.filter(visitor => {
    const matchesSearch = visitor.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visitor.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visitor.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visitor.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || visitor.status === statusFilter
    const matchesPurpose = purposeFilter === 'all' || visitor.purpose === purposeFilter
    
    return matchesSearch && matchesStatus && matchesPurpose
  })

  const activeVisitors = visitors.filter(v => v.status === 'active').length
  const completedToday = visitors.filter(v => 
    v.status === 'completed' && 
    v.timeOut && new Date(v.timeOut).toDateString() === new Date().toDateString()
  ).length

  const handleGenerateQR = (visitor: any) => {
    setSelectedVisitor(visitor)
    setShowQRModal(true)
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
              <div className="text-2xl font-bold text-warning-600">{visitors.length}</div>
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
              <Button onClick={() => setShowQRModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Generate QR Code
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
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
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

        {/* Visitors Table */}
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
                      Resident
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
                  {filteredVisitors.map((visitor) => (
                    <tr key={visitor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{visitor.visitorName}</div>
                          <div className="text-sm text-gray-500">{visitor.phone}</div>
                          <div className="text-xs text-gray-400">{visitor.code}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{visitor.residentName}</div>
                          <div className="text-sm text-gray-500">Unit {visitor.unit}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {visitor.purpose}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(visitor.status)}`}>
                          {visitor.status.charAt(0).toUpperCase() + visitor.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {visitor.timeIn ? formatDateTime(visitor.timeIn) : 'Not scanned'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {visitor.timeOut ? formatDateTime(visitor.timeOut) : 'Still active'}
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
                          {visitor.status === 'active' && (
                            <Button variant="ghost" size="sm" className="text-danger-600 hover:text-danger-700">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Modal */}
        {showQRModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">Generate Visitor QR Code</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Visitor Name</label>
                  <Input placeholder="Enter visitor name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resident</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option>Select resident</option>
                    <option>John Doe (A-12)</option>
                    <option>Jane Smith (B-05)</option>
                    <option>Bob Wilson (C-08)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option>Social visit</option>
                    <option>Delivery</option>
                    <option>Maintenance</option>
                    <option>Family visit</option>
                    <option>Business</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <Input placeholder="Enter visitor phone number" />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setShowQRModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowQRModal(false)}>
                  Generate QR Code
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
