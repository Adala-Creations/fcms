'use client'

import { useState, useRef } from 'react'
import { 
  Shield, 
  QrCode, 
  Search, 
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Camera,
  Scan,
  RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Header from '@/components/layout/header'

// Mock data for visitor codes
const visitorCodes = [
  {
    id: 1,
    code: 'VST-001',
    qrCode: '/qr-codes/vst-001.png',
    visitorName: 'Mike Johnson',
    unit: 'A-01',
    tenantName: 'Jane Smith',
    purpose: 'Family visit',
    issuedAt: '2024-01-15T10:30:00',
    expiresAt: '2024-01-15T18:30:00',
    status: 'active',
    timeIn: null,
    timeOut: null,
    phone: '+263 77 123 4567',
    email: 'mike.johnson@email.com'
  },
  {
    id: 2,
    code: 'VST-002',
    qrCode: '/qr-codes/vst-002.png',
    visitorName: 'Sarah Lee',
    unit: 'B-05',
    tenantName: 'Mike Davis',
    purpose: 'Delivery',
    issuedAt: '2024-01-15T14:00:00',
    expiresAt: '2024-01-15T20:00:00',
    status: 'active',
    timeIn: '2024-01-15T14:30:00',
    timeOut: null,
    phone: '+263 77 234 5678',
    email: 'sarah.lee@email.com'
  },
  {
    id: 3,
    code: 'VST-003',
    qrCode: '/qr-codes/vst-003.png',
    visitorName: 'John Wilson',
    unit: 'C-08',
    tenantName: 'Alice Brown',
    purpose: 'Maintenance',
    issuedAt: '2024-01-15T09:00:00',
    expiresAt: '2024-01-15T17:00:00',
    status: 'expired',
    timeIn: '2024-01-15T09:15:00',
    timeOut: '2024-01-15T16:45:00',
    phone: '+263 77 345 6789',
    email: 'john.wilson@email.com'
  }
]

const statusColors = {
  active: 'bg-success-100 text-success-800',
  expired: 'bg-danger-100 text-danger-800',
  completed: 'bg-primary-100 text-primary-800'
}

const statusIcons = {
  active: CheckCircle,
  expired: AlertCircle,
  completed: CheckCircle
}

export default function SecurityScanner() {
  const [scannedCode, setScannedCode] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedVisitor, setSelectedVisitor] = useState<any>(null)
  const [isScanning, setIsScanning] = useState(false)
  const fileInputRef = useRef(null)

  const handleScan = () => {
    setIsScanning(true)
    // Simulate QR code scanning
    setTimeout(() => {
      const randomCode = visitorCodes[Math.floor(Math.random() * visitorCodes.length)]
      setScannedCode(randomCode.code)
      setSelectedVisitor(randomCode)
      setIsScanning(false)
    }, 2000)
  }

  const handleManualSearch = () => {
    const visitor = visitorCodes.find(v => 
      v.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.visitorName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    if (visitor) {
      setSelectedVisitor(visitor)
      setScannedCode(visitor.code)
    }
  }

  const handleTimeIn = (visitorId: number) => {
    // In a real app, this would update the visitor record
    console.log(`Time in recorded for visitor ${visitorId}`)
    setSelectedVisitor((prev: any) => ({
      ...prev,
      timeIn: new Date().toISOString(),
      status: 'active'
    }))
  }

  const handleTimeOut = (visitorId: number) => {
    // In a real app, this would update the visitor record
    console.log(`Time out recorded for visitor ${visitorId}`)
    setSelectedVisitor((prev: any) => ({
      ...prev,
      timeOut: new Date().toISOString(),
      status: 'completed'
    }))
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const isCodeExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date()
  }

  const getDuration = (timeIn: string, timeOut: string | null) => {
    if (!timeIn) return 'Not arrived'
    if (!timeOut) return 'Currently inside'
    
    const start = new Date(timeIn)
    const end = new Date(timeOut)
    const diff = end.getTime() - start.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="space-y-6">
      <Header 
        title="Visitor Scanner" 
        subtitle="Scan QR codes and manage visitor access"
      />
      
      {/* Scanner Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code Scanner */}
        <Card>
          <CardHeader>
            <CardTitle>QR Code Scanner</CardTitle>
            <CardDescription>Scan visitor QR codes for access verification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              {isScanning ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Scanning QR code...</p>
                </div>
              ) : (
                <div className="text-center">
                  <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Position QR code within the frame</p>
                  <Button onClick={handleScan} className="w-full">
                    <Scan className="h-4 w-4 mr-2" />
                    Start Scanning
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1">
                <Camera className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
              <Button variant="outline" className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Manual Search */}
        <Card>
          <CardHeader>
            <CardTitle>Manual Search</CardTitle>
            <CardDescription>Search for visitors by code or name</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Enter visitor code or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
              />
              <Button onClick={handleManualSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Recent Scans</h4>
              {visitorCodes.slice(0, 3).map((visitor) => (
                <div
                  key={visitor.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                  onClick={() => setSelectedVisitor(visitor)}
                >
                  <div>
                    <p className="text-sm font-medium">{visitor.visitorName}</p>
                    <p className="text-xs text-gray-500">{visitor.code} • {visitor.unit}</p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[visitor.status as keyof typeof statusColors]}`}>
                    {visitor.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visitor Details */}
      {selectedVisitor && (
        <Card>
          <CardHeader>
            <CardTitle>Visitor Details</CardTitle>
            <CardDescription>Information for scanned visitor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedVisitor.visitorName}</h3>
                    <p className="text-gray-600">{selectedVisitor.purpose}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${statusColors[selectedVisitor.status as keyof typeof statusColors]}`}>
                      {selectedVisitor.status.toUpperCase()}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">{selectedVisitor.code}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Unit:</span>
                    <p className="font-medium">{selectedVisitor.unit}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Tenant:</span>
                    <p className="font-medium">{selectedVisitor.tenantName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Issued:</span>
                    <p className="font-medium">{formatDateTime(selectedVisitor.issuedAt)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Expires:</span>
                    <p className="font-medium">{formatDateTime(selectedVisitor.expiresAt)}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {selectedVisitor.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {selectedVisitor.email}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Access Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time In:</span>
                      <span className="font-medium">
                        {selectedVisitor.timeIn ? formatDateTime(selectedVisitor.timeIn) : 'Not arrived'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time Out:</span>
                      <span className="font-medium">
                        {selectedVisitor.timeOut ? formatDateTime(selectedVisitor.timeOut) : 'Still inside'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">
                        {getDuration(selectedVisitor.timeIn, selectedVisitor.timeOut)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {!selectedVisitor.timeIn && !isCodeExpired(selectedVisitor.expiresAt) && (
                    <Button 
                      onClick={() => handleTimeIn(selectedVisitor.id)}
                      className="flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Time In
                    </Button>
                  )}
                  {selectedVisitor.timeIn && !selectedVisitor.timeOut && (
                    <Button 
                      onClick={() => handleTimeOut(selectedVisitor.id)}
                      variant="outline"
                      className="flex-1"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Time Out
                    </Button>
                  )}
                  {isCodeExpired(selectedVisitor.expiresAt) && (
                    <div className="flex-1 p-3 bg-danger-50 text-danger-800 rounded-lg text-center">
                      <AlertCircle className="h-5 w-5 mx-auto mb-1" />
                      <p className="text-sm font-medium">Code Expired</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Visitors */}
      <Card>
        <CardHeader>
          <CardTitle>Currently Active Visitors</CardTitle>
          <CardDescription>Visitors currently on the premises</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {visitorCodes.filter(v => v.status === 'active' && v.timeIn).map((visitor) => (
              <div key={visitor.id} className="flex items-center justify-between p-4 bg-success-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-success-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{visitor.visitorName}</p>
                    <p className="text-sm text-gray-600">{visitor.unit} • {visitor.purpose}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Since {visitor.timeIn ? formatDateTime(visitor.timeIn) : 'Unknown'}</p>
                  <p className="text-xs text-success-600">Currently inside</p>
                </div>
              </div>
            ))}
            {visitorCodes.filter(v => v.status === 'active' && v.timeIn).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No active visitors on the premises</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
