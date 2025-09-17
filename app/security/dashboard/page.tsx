'use client'

import { 
  Shield, 
  QrCode, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Users,
  Calendar,
  Search
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Header from '@/components/layout/header'
import { formatDateTime, getStatusColor } from '@/lib/utils'

// Mock data for security
const todayStats = {
  visitorsIn: 12,
  visitorsOut: 9,
  activeVisitors: 3,
  totalScans: 21
}

const recentScans = [
  {
    id: 1,
    visitorName: 'Mike Johnson',
    residentName: 'John Doe',
    unit: 'A-12',
    code: 'QR-001-2024',
    action: 'entry',
    time: '2024-01-15T10:30:00Z',
    status: 'valid'
  },
  {
    id: 2,
    visitorName: 'Sarah Wilson',
    residentName: 'Jane Smith',
    unit: 'B-05',
    code: 'QR-002-2024',
    action: 'exit',
    time: '2024-01-15T09:15:00Z',
    status: 'valid'
  },
  {
    id: 3,
    visitorName: 'David Brown',
    residentName: 'Bob Wilson',
    unit: 'C-08',
    code: 'QR-003-2024',
    action: 'entry',
    time: '2024-01-15T08:45:00Z',
    status: 'expired'
  },
  {
    id: 4,
    visitorName: 'Lisa Davis',
    residentName: 'Alice Brown',
    unit: 'A-15',
    code: 'QR-004-2024',
    action: 'entry',
    time: '2024-01-15T07:20:00Z',
    status: 'valid'
  }
]

const activeVisitors = [
  {
    id: 1,
    visitorName: 'Mike Johnson',
    residentName: 'John Doe',
    unit: 'A-12',
    timeIn: '2024-01-15T10:30:00Z',
    purpose: 'Social visit',
    phone: '+263 77 123 4567'
  },
  {
    id: 2,
    visitorName: 'Lisa Davis',
    residentName: 'Alice Brown',
    unit: 'A-15',
    timeIn: '2024-01-15T07:20:00Z',
    purpose: 'Family visit',
    phone: '+263 77 456 7890'
  }
]

export default function SecurityDashboard() {
  return (
    <div>
      <Header 
        title="Security Dashboard" 
        subtitle="Visitor access control and monitoring"
      />
      
      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        {/* Today's Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visitors In</CardTitle>
              <Users className="h-4 w-4 text-primary-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-600">{todayStats.visitorsIn}</div>
              <p className="text-xs text-muted-foreground">Today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visitors Out</CardTitle>
              <CheckCircle className="h-4 w-4 text-success-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success-600">{todayStats.visitorsOut}</div>
              <p className="text-xs text-muted-foreground">Today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Visitors</CardTitle>
              <Clock className="h-4 w-4 text-warning-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning-600">{todayStats.activeVisitors}</div>
              <p className="text-xs text-muted-foreground">On premises</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
              <QrCode className="h-4 w-4 text-secondary-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary-600">{todayStats.totalScans}</div>
              <p className="text-xs text-muted-foreground">Today</p>
            </CardContent>
          </Card>
        </div>

        {/* QR Scanner */}
        <Card>
          <CardHeader>
            <CardTitle>QR Code Scanner</CardTitle>
            <CardDescription>Scan visitor QR codes for entry/exit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="w-64 h-64 mx-auto bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Position QR code in camera view</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="flex-1 sm:flex-none">
                  <QrCode className="h-4 w-4 mr-2" />
                  Start Scanner
                </Button>
                <Button variant="outline" className="flex-1 sm:flex-none">
                  <Search className="h-4 w-4 mr-2" />
                  Manual Entry
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Visitors */}
          <Card>
            <CardHeader>
              <CardTitle>Active Visitors</CardTitle>
              <CardDescription>Currently on premises</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeVisitors.map((visitor) => (
                  <div key={visitor.id} className="flex items-center justify-between p-4 bg-warning-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
                          <Users className="h-5 w-5 text-warning-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{visitor.visitorName}</h3>
                          <p className="text-xs text-gray-500">{visitor.residentName} - Unit {visitor.unit}</p>
                          <p className="text-xs text-gray-400">In since {formatDateTime(visitor.timeIn)}</p>
                          <p className="text-xs text-gray-400">Purpose: {visitor.purpose}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Button size="sm" variant="outline" className="text-danger-600 hover:text-danger-700">
                        Check Out
                      </Button>
                    </div>
                  </div>
                ))}
                {activeVisitors.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p>No active visitors</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Scans */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Scans</CardTitle>
              <CardDescription>Latest QR code scans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentScans.map((scan) => (
                  <div key={scan.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          scan.action === 'entry' ? 'bg-primary-100' : 'bg-success-100'
                        }`}>
                          {scan.action === 'entry' ? (
                            <Users className="h-4 w-4 text-primary-600" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-success-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{scan.visitorName}</h3>
                          <p className="text-xs text-gray-500">{scan.residentName} - Unit {scan.unit}</p>
                          <p className="text-xs text-gray-400">{formatDateTime(scan.time)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        scan.status === 'valid' ? 'bg-success-100 text-success-800' : 'bg-danger-100 text-danger-800'
                      }`}>
                        {scan.status.charAt(0).toUpperCase() + scan.status.slice(1)}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {scan.action.charAt(0).toUpperCase() + scan.action.slice(1)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common security operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center space-y-2">
                <QrCode className="h-6 w-6" />
                <span>Scan QR Code</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Search className="h-6 w-6" />
                <span>Search Visitor</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Calendar className="h-6 w-6" />
                <span>View Logs</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <AlertTriangle className="h-6 w-6" />
                <span>Report Issue</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
