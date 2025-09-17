'use client'

import { useState } from 'react'
import { 
  Receipt, 
  Plus, 
  Search, 
  Filter, 
  Eye,
  Download,
  Upload,
  DollarSign,
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Camera
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Header from '@/components/layout/header'

// Mock data for receipts
const receipts = [
  {
    id: 1,
    jobId: 1,
    jobTitle: 'Leaky faucet in kitchen',
    unit: 'A-01',
    tenantName: 'Jane Smith',
    amount: 50,
    status: 'approved',
    submittedAt: '2024-01-16T15:30:00',
    approvedAt: '2024-01-16T16:45:00',
    approvedBy: 'Admin User',
    receiptUrl: '/receipts/plumbing-001.pdf',
    description: 'Replaced faucet washers and repaired pipe connections',
    materials: [
      { name: 'Faucet washers', cost: 15, quantity: 2 },
      { name: 'Pipe wrench', cost: 25, quantity: 1 },
      { name: 'Plumber\'s tape', cost: 5, quantity: 1 }
    ],
    labor: 25,
    totalCost: 50,
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'pending'
  },
  {
    id: 2,
    jobId: 2,
    jobTitle: 'Light not working in bedroom',
    unit: 'B-05',
    tenantName: 'Mike Davis',
    amount: 75,
    status: 'pending',
    submittedAt: '2024-01-15T11:20:00',
    approvedAt: null,
    approvedBy: null,
    receiptUrl: '/receipts/electrical-001.pdf',
    description: 'Replaced light switch and repaired wiring',
    materials: [
      { name: 'Light switch', cost: 20, quantity: 1 },
      { name: 'Electrical wire', cost: 15, quantity: 1 },
      { name: 'Wire nuts', cost: 5, quantity: 1 }
    ],
    labor: 35,
    totalCost: 75,
    paymentMethod: 'EcoCash',
    paymentStatus: 'pending'
  },
  {
    id: 3,
    jobId: 3,
    jobTitle: 'Door lock is sticking',
    unit: 'C-08',
    tenantName: 'Alice Brown',
    amount: 25,
    status: 'approved',
    submittedAt: '2024-01-12T12:00:00',
    approvedAt: '2024-01-12T14:30:00',
    approvedBy: 'Admin User',
    receiptUrl: '/receipts/maintenance-001.pdf',
    description: 'Applied lubricant and adjusted lock mechanism',
    materials: [
      { name: 'Lock lubricant', cost: 10, quantity: 1 },
      { name: 'Replacement key', cost: 5, quantity: 1 }
    ],
    labor: 10,
    totalCost: 25,
    paymentMethod: 'Cash',
    paymentStatus: 'paid'
  },
  {
    id: 4,
    jobId: 4,
    jobTitle: 'Toilet not flushing properly',
    unit: 'A-12',
    tenantName: 'Bob Wilson',
    amount: 40,
    status: 'rejected',
    submittedAt: '2024-01-17T16:15:00',
    approvedAt: '2024-01-17T17:30:00',
    approvedBy: 'Admin User',
    receiptUrl: '/receipts/plumbing-002.pdf',
    description: 'Replaced toilet flapper and fill valve',
    materials: [
      { name: 'Toilet flapper', cost: 15, quantity: 1 },
      { name: 'Fill valve', cost: 20, quantity: 1 },
      { name: 'Toilet wax ring', cost: 5, quantity: 1 }
    ],
    labor: 20,
    totalCost: 40,
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'rejected',
    rejectionReason: 'Receipt image is unclear. Please resubmit with better quality photo.'
  }
]

const statusColors = {
  approved: 'bg-success-100 text-success-800',
  pending: 'bg-warning-100 text-warning-800',
  rejected: 'bg-danger-100 text-danger-800'
}

const statusIcons = {
  approved: CheckCircle,
  pending: Clock,
  rejected: AlertCircle
}

const paymentStatusColors = {
  paid: 'bg-success-100 text-success-800',
  pending: 'bg-warning-100 text-warning-800',
  rejected: 'bg-danger-100 text-danger-800'
}

export default function ProviderReceipts() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('all')
  const [showUploadModal, setShowUploadModal] = useState(false)

  const filteredReceipts = receipts.filter(receipt => {
    const matchesSearch = receipt.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receipt.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receipt.tenantName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || receipt.status === filterStatus
    const matchesPaymentStatus = filterPaymentStatus === 'all' || receipt.paymentStatus === filterPaymentStatus
    return matchesSearch && matchesStatus && matchesPaymentStatus
  })

  const stats = {
    total: receipts.length,
    approved: receipts.filter(r => r.status === 'approved').length,
    pending: receipts.filter(r => r.status === 'pending').length,
    rejected: receipts.filter(r => r.status === 'rejected').length,
    totalAmount: receipts.reduce((sum, r) => sum + r.amount, 0),
    paidAmount: receipts.filter(r => r.paymentStatus === 'paid').reduce((sum, r) => sum + r.amount, 0),
    pendingAmount: receipts.filter(r => r.paymentStatus === 'pending').reduce((sum, r) => sum + r.amount, 0)
  }

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

  const handleUploadReceipt = () => {
    // In a real app, this would handle file upload
    console.log('Uploading receipt...')
  }

  const handleDownloadReceipt = (receiptUrl: string) => {
    // In a real app, this would download the receipt
    console.log(`Downloading receipt: ${receiptUrl}`)
  }

  return (
    <div className="space-y-6">
      <Header 
        title="Receipts" 
        subtitle="Manage your service receipts and payments"
      />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Receipt className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Receipts</p>
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
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
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
              <AlertCircle className="h-8 w-8 text-danger-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-success-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalAmount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Paid Amount</p>
                <p className="text-2xl font-bold text-gray-900">${stats.paidAmount}</p>
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
              <p className="text-sm text-gray-600">Upload receipts and manage payments</p>
            </div>
            <div className="flex space-x-3">
              <Button onClick={() => setShowUploadModal(true)} className="w-full sm:w-auto">
                <Upload className="h-4 w-4 mr-2" />
                Upload Receipt
              </Button>
              <Button variant="outline" className="w-full sm:w-auto">
                <Camera className="h-4 w-4 mr-2" />
                Take Photo
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
                  placeholder="Search receipts..."
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
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={filterPaymentStatus}
                onChange={(e) => setFilterPaymentStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Payment Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Receipts List */}
      <div className="space-y-4">
        {filteredReceipts.map((receipt) => {
          const StatusIcon = statusIcons[receipt.status as keyof typeof statusIcons]
          return (
            <Card key={receipt.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {receipt.jobTitle}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <FileText className="h-4 w-4 mr-1" />
                            {receipt.unit} • {receipt.tenantName}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {getDaysAgo(receipt.submittedAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${statusColors[receipt.status as keyof typeof statusColors]}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {receipt.status}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${paymentStatusColors[receipt.paymentStatus as keyof typeof paymentStatusColors]}`}>
                          {receipt.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{receipt.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Amount:</span>
                        <p className="font-medium text-lg">${receipt.amount}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Payment Method:</span>
                        <p className="font-medium">{receipt.paymentMethod}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Submitted:</span>
                        <p className="font-medium">{formatDateTime(receipt.submittedAt)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Approved By:</span>
                        <p className="font-medium">{receipt.approvedBy || 'Pending'}</p>
                      </div>
                    </div>

                    {/* Materials Breakdown */}
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Cost Breakdown</h4>
                      <div className="space-y-2">
                        {receipt.materials.map((material, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              {material.name} (x{material.quantity})
                            </span>
                            <span className="font-medium">${material.cost}</span>
                          </div>
                        ))}
                        <div className="flex justify-between text-sm border-t pt-2">
                          <span className="text-gray-600">Labor</span>
                          <span className="font-medium">${receipt.labor}</span>
                        </div>
                        <div className="flex justify-between text-sm font-semibold border-t pt-2">
                          <span className="text-gray-900">Total</span>
                          <span className="text-gray-900">${receipt.totalCost}</span>
                        </div>
                      </div>
                    </div>

                    {/* Rejection Reason */}
                    {receipt.rejectionReason && (
                      <div className="mt-4 p-4 bg-danger-50 rounded-lg">
                        <h4 className="font-medium text-danger-800 mb-2">Rejection Reason</h4>
                        <p className="text-sm text-danger-700">{receipt.rejectionReason}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 lg:mt-0 lg:ml-6">
                    <div className="flex flex-col space-y-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-1" />
                        View Receipt
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleDownloadReceipt(receipt.receiptUrl)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      {receipt.status === 'rejected' && (
                        <Button size="sm" className="w-full">
                          <Upload className="h-4 w-4 mr-1" />
                          Resubmit
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

      {/* Upload Modal Placeholder */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Upload Receipt</CardTitle>
              <CardDescription>Upload a receipt for your completed job</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Job
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option>Select a completed job...</option>
                    <option>Leaky faucet in kitchen - A-01</option>
                    <option>Light not working in bedroom - B-05</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Receipt
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button className="flex-1" onClick={handleUploadReceipt}>
                    Upload Receipt
                  </Button>
                  <Button variant="outline" onClick={() => setShowUploadModal(false)}>
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
