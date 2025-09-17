'use client'

import { useState } from 'react'
import { 
  Shield, 
  Search, 
  Filter, 
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building2,
  Users,
  DollarSign,
  Calendar,
  FileText,
  Download,
  Edit,
  XCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Header from '@/components/layout/header'

// Mock data for compliance monitoring
const complianceRecords = [
  {
    id: 1,
    property: 'Sunset Gardens',
    unit: 'A-01',
    tenantName: 'Jane Smith',
    violationType: 'Safety Violation',
    description: 'Blocked emergency exit with furniture',
    severity: 'High',
    status: 'Resolved',
    reportedDate: '2024-01-15',
    resolvedDate: '2024-01-16',
    fine: 500,
    inspector: 'John Inspector',
    notes: 'Furniture removed, exit cleared. Follow-up inspection scheduled.',
    images: ['/images/violation-001.jpg', '/images/violation-002.jpg']
  },
  {
    id: 2,
    property: 'Riverside Complex',
    unit: 'B-05',
    tenantName: 'Mike Davis',
    violationType: 'Building Code',
    description: 'Unauthorized structural modification to load-bearing wall',
    severity: 'Medium',
    status: 'Pending',
    reportedDate: '2024-01-14',
    resolvedDate: null,
    fine: 300,
    inspector: 'Sarah Inspector',
    notes: 'Structural engineer assessment required before resolution.',
    images: ['/images/violation-003.jpg']
  },
  {
    id: 3,
    property: 'Valley Heights',
    unit: 'C-08',
    tenantName: 'Alice Brown',
    violationType: 'Fire Safety',
    description: 'Missing fire extinguisher in common area',
    severity: 'High',
    status: 'Under Review',
    reportedDate: '2024-01-13',
    resolvedDate: null,
    fine: 200,
    inspector: 'Bob Inspector',
    notes: 'Fire department inspection scheduled for next week.',
    images: ['/images/violation-004.jpg', '/images/violation-005.jpg']
  },
  {
    id: 4,
    property: 'Mountain View',
    unit: 'D-12',
    tenantName: 'Carol Green',
    violationType: 'Environmental',
    description: 'Improper waste disposal in common area',
    severity: 'Low',
    status: 'Resolved',
    reportedDate: '2024-01-12',
    resolvedDate: '2024-01-13',
    fine: 100,
    inspector: 'John Inspector',
    notes: 'Waste properly disposed of, additional bins installed.',
    images: ['/images/violation-006.jpg']
  },
  {
    id: 5,
    property: 'Sunset Gardens',
    unit: 'A-15',
    tenantName: 'David Wilson',
    violationType: 'Safety Violation',
    description: 'Broken handrail on staircase',
    severity: 'Medium',
    status: 'Pending',
    reportedDate: '2024-01-11',
    resolvedDate: null,
    fine: 150,
    inspector: 'Sarah Inspector',
    notes: 'Repair work scheduled with maintenance team.',
    images: ['/images/violation-007.jpg']
  }
]

const severityColors = {
  High: 'bg-danger-100 text-danger-800',
  Medium: 'bg-warning-100 text-warning-800',
  Low: 'bg-success-100 text-success-800'
}

const statusColors = {
  Resolved: 'bg-success-100 text-success-800',
  Pending: 'bg-warning-100 text-warning-800',
  'Under Review': 'bg-primary-100 text-primary-800',
  'Not Started': 'bg-gray-100 text-gray-800'
}

const statusIcons = {
  Resolved: CheckCircle,
  Pending: Clock,
  'Under Review': AlertTriangle,
  'Not Started': XCircle
}

export default function AuthorityCompliance() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterSeverity, setFilterSeverity] = useState('all')
  const [selectedRecord, setSelectedRecord] = useState<any>(null)

  const filteredRecords = complianceRecords.filter(record => {
    const matchesSearch = record.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.violationType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus
    const matchesSeverity = filterSeverity === 'all' || record.severity === filterSeverity
    return matchesSearch && matchesStatus && matchesSeverity
  })

  const stats = {
    total: complianceRecords.length,
    resolved: complianceRecords.filter(r => r.status === 'Resolved').length,
    pending: complianceRecords.filter(r => r.status === 'Pending').length,
    underReview: complianceRecords.filter(r => r.status === 'Under Review').length,
    totalFines: complianceRecords.reduce((sum, r) => sum + r.fine, 0),
    collectedFines: complianceRecords.filter(r => r.status === 'Resolved').reduce((sum, r) => sum + r.fine, 0)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getDaysAgo = (dateString: string) => {
    const now = new Date()
    const recordDate = new Date(dateString)
    const diffTime = Math.abs(now.getTime() - recordDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays === 0 ? 'Today' : `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }

  const handleUpdateStatus = (recordId: number, newStatus: string) => {
    // In a real app, this would update the record status
    console.log(`Updating record ${recordId} to status: ${newStatus}`)
  }

  return (
    <div className="space-y-6">
      <Header 
        title="Compliance Monitoring" 
        subtitle="Track and manage compliance violations and resolutions"
      />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Records</p>
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
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
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
              <AlertTriangle className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Under Review</p>
                <p className="text-2xl font-bold text-gray-900">{stats.underReview}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-danger-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Fines</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalFines}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-success-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Collected</p>
                <p className="text-2xl font-bold text-gray-900">${stats.collectedFines}</p>
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
                  placeholder="Search compliance records..."
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
                <option value="Resolved">Resolved</option>
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Not Started">Not Started</option>
              </select>

              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Severity</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Records */}
      <div className="space-y-4">
        {filteredRecords.map((record) => {
          const StatusIcon = statusIcons[record.status as keyof typeof statusIcons]
          return (
            <Card key={record.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {record.property} - {record.unit}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {record.tenantName}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {getDaysAgo(record.reportedDate)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${severityColors[record.severity as keyof typeof severityColors]}`}>
                          {record.severity}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${statusColors[record.status as keyof typeof statusColors]}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {record.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{record.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Violation Type:</span>
                        <p className="font-medium">{record.violationType}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Fine Amount:</span>
                        <p className="font-medium">${record.fine}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Inspector:</span>
                        <p className="font-medium">{record.inspector}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Reported:</span>
                        <p className="font-medium">{formatDate(record.reportedDate)}</p>
                      </div>
                    </div>

                    {record.images.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-900 mb-2">Evidence Images:</p>
                        <div className="flex space-x-2">
                          {record.images.map((image, index) => (
                            <div key={index} className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                              <FileText className="h-6 w-6 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {record.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-1">Inspector Notes</h4>
                        <p className="text-sm text-gray-700">{record.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 lg:mt-0 lg:ml-6">
                    <div className="flex flex-col space-y-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => setSelectedRecord(record)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      {record.status === 'Pending' && (
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleUpdateStatus(record.id, 'Under Review')}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Start Review
                        </Button>
                      )}
                      {record.status === 'Under Review' && (
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleUpdateStatus(record.id, 'Resolved')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark Resolved
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

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Compliance Record Details</CardTitle>
              <CardDescription>Complete information for record {selectedRecord.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Property Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Property:</span>
                        <span className="font-medium">{selectedRecord.property}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Unit:</span>
                        <span className="font-medium">{selectedRecord.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tenant:</span>
                        <span className="font-medium">{selectedRecord.tenantName}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Violation Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">{selectedRecord.violationType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Severity:</span>
                        <span className={`font-medium px-2 py-1 rounded text-xs ${severityColors[selectedRecord.severity as keyof typeof severityColors]}`}>
                          {selectedRecord.severity}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fine:</span>
                        <span className="font-medium">${selectedRecord.fine}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Status Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`font-medium px-2 py-1 rounded text-xs ${statusColors[selectedRecord.status as keyof typeof statusColors]}`}>
                          {selectedRecord.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Inspector:</span>
                        <span className="font-medium">{selectedRecord.inspector}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reported:</span>
                        <span className="font-medium">{formatDate(selectedRecord.reportedDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Resolved:</span>
                        <span className="font-medium">
                          {selectedRecord.resolvedDate ? formatDate(selectedRecord.resolvedDate) : 'Not resolved'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      {selectedRecord.description}
                    </p>
                  </div>

                  {selectedRecord.notes && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Inspector Notes</h4>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                        {selectedRecord.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedRecord(null)}>
                  Close
                </Button>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Export Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
