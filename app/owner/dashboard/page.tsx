'use client'

import { 
  Building2, 
  Users, 
  DollarSign, 
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Header from '@/components/layout/header'
import { formatCurrency, formatDate } from '@/lib/utils'

// Mock data for owner
const ownerData = {
  name: 'John Doe',
  totalUnits: 3,
  occupiedUnits: 3,
  monthlyRent: 450,
  totalRevenue: 5400,
  outstandingRent: 0,
  nextRentDue: '2024-02-01'
}

const units = [
  {
    id: 1,
    unit: 'A-12',
    tenant: 'Jane Smith',
    rent: 150,
    status: 'occupied',
    leaseEnd: '2024-12-31',
    lastPayment: '2024-01-01'
  },
  {
    id: 2,
    unit: 'B-05',
    tenant: 'Bob Wilson',
    rent: 200,
    status: 'occupied',
    leaseEnd: '2024-11-30',
    lastPayment: '2024-01-01'
  },
  {
    id: 3,
    unit: 'C-08',
    tenant: 'Alice Brown',
    rent: 100,
    status: 'occupied',
    leaseEnd: '2024-10-15',
    lastPayment: '2024-01-01'
  }
]

const recentPayments = [
  {
    id: 1,
    unit: 'A-12',
    tenant: 'Jane Smith',
    amount: 150,
    type: 'rent',
    date: '2024-01-01',
    status: 'completed'
  },
  {
    id: 2,
    unit: 'B-05',
    tenant: 'Bob Wilson',
    amount: 200,
    type: 'rent',
    date: '2024-01-01',
    status: 'completed'
  },
  {
    id: 3,
    unit: 'C-08',
    tenant: 'Alice Brown',
    amount: 100,
    type: 'rent',
    date: '2024-01-01',
    status: 'completed'
  }
]

const monthlyRevenue = [
  { month: 'Jan', amount: 450 },
  { month: 'Feb', amount: 450 },
  { month: 'Mar', amount: 450 },
  { month: 'Apr', amount: 450 },
  { month: 'May', amount: 450 },
  { month: 'Jun', amount: 450 }
]

const upcomingLeaseRenewals = [
  {
    unit: 'C-08',
    tenant: 'Alice Brown',
    currentRent: 100,
    leaseEnd: '2024-10-15',
    daysRemaining: 30
  }
]

export default function OwnerDashboard() {
  return (
    <div>
      <Header 
        title="Property Owner Dashboard" 
        subtitle={`Welcome back, ${ownerData.name}`}
      />
      
      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Units</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-600">{ownerData.totalUnits}</div>
              <p className="text-xs text-muted-foreground">Properties owned</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupied Units</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success-600">{ownerData.occupiedUnits}</div>
              <p className="text-xs text-muted-foreground">100% occupancy</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success-600">{formatCurrency(ownerData.monthlyRent)}</div>
              <p className="text-xs text-muted-foreground">Current month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-600">{formatCurrency(ownerData.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button className="h-20 flex flex-col items-center justify-center space-y-2">
            <Building2 className="h-6 w-6" />
            <span>Manage Units</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
            <Users className="h-6 w-6" />
            <span>View Tenants</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
            <DollarSign className="h-6 w-6" />
            <span>Payment History</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
            <Calendar className="h-6 w-6" />
            <span>Lease Management</span>
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Units */}
          <Card>
            <CardHeader>
              <CardTitle>My Units</CardTitle>
              <CardDescription>Overview of your rental properties</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {units.map((unit) => (
                  <div key={unit.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">Unit {unit.unit}</h3>
                          <p className="text-xs text-gray-500 truncate">Tenant: {unit.tenant}</p>
                          <p className="text-xs text-gray-400 truncate">Lease ends: {formatDate(unit.leaseEnd)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(unit.rent)}/month</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        unit.status === 'occupied' ? 'bg-success-100 text-success-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Rent Payments</CardTitle>
              <CardDescription>Latest rental income received</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 bg-success-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-success-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">Unit {payment.unit}</h3>
                          <p className="text-xs text-gray-500 truncate">{payment.tenant}</p>
                          <p className="text-xs text-gray-400 truncate">Paid {formatDate(payment.date)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-success-600">{formatCurrency(payment.amount)}</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                        Completed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <CardDescription>Your rental income over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyRevenue.map((month, index) => (
                  <div key={month.month} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-medium text-primary-600">{month.month}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{month.month} 2024</p>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full" 
                            style={{ width: '100%' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(month.amount)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lease Renewals */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Lease Renewals</CardTitle>
              <CardDescription>Leases that need attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingLeaseRenewals.map((lease, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-warning-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-warning-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">Unit {lease.unit}</h3>
                          <p className="text-xs text-gray-500 truncate">Tenant: {lease.tenant}</p>
                          <p className="text-xs text-gray-400 truncate">Current rent: {formatCurrency(lease.currentRent)}</p>
                          <p className="text-xs text-gray-400 truncate">Lease ends: {formatDate(lease.leaseEnd)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-warning-600">{lease.daysRemaining} days</p>
                      <Button size="sm" variant="outline">
                        Renew Lease
                      </Button>
                    </div>
                  </div>
                ))}
                {upcomingLeaseRenewals.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p>No upcoming renewals</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
