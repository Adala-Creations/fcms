'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  CreditCard,
  QrCode,
  Wrench,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  Plus
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Header from '@/components/layout/header'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useToast } from '@/lib/hooks/useToast'

// Mock data for tenant
const tenantData = {
  name: 'Jane Smith',
  unit: 'B-05',
  rentAmount: 150,
  nextDueDate: '2024-02-01',
  balance: 0,
  lastPayment: '2024-01-01',
  leaseEnd: '2024-12-31'
}

const recentPayments = [
  { id: 1, type: 'Rent', amount: 150, date: '2024-01-01', status: 'completed' },
  { id: 2, type: 'Security', amount: 25, date: '2024-01-01', status: 'completed' },
  { id: 3, type: 'Bin Collection', amount: 30, date: '2024-01-01', status: 'completed' },
]

const upcomingPayments = [
  { type: 'Rent', amount: 150, dueDate: '2024-02-01', status: 'pending' },
  { type: 'Security', amount: 25, dueDate: '2024-02-01', status: 'pending' },
  { type: 'Bin Collection', amount: 30, dueDate: '2024-02-01', status: 'pending' },
]

const recentActivities = [
  { id: 1, type: 'visitor', description: 'Generated visitor code for Mike Johnson', time: '2 hours ago' },
  { id: 2, type: 'service', description: 'Plumbing issue reported - assigned to John Plumbing', time: '1 day ago' },
  { id: 3, type: 'payment', description: 'Rent payment of $150 completed', time: '2 days ago' },
]

const serviceRequests = [
  { id: 1, type: 'Plumbing', description: 'Leaky faucet in kitchen', status: 'in-progress', date: '2024-01-14' },
  { id: 2, type: 'Electrical', description: 'Light not working in bedroom', status: 'pending', date: '2024-01-15' },
]

export default function TenantDashboard() {
  const router = useRouter()
  const { info } = useToast()

  const handleAction = (title: string) => {
    info(`Action Triggered: ${title}. This would normally open a form or process.`)
  }

  return (
    <div>
      <Header
        title="My Dashboard"
        subtitle={`Welcome back, ${tenantData.name}`}
      />

      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success-600">{formatCurrency(tenantData.balance)}</div>
              <p className="text-xs text-muted-foreground">All payments up to date</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Payment Due</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning-600">{formatDate(tenantData.nextDueDate)}</div>
              <p className="text-xs text-muted-foreground">Rent payment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Visitors</CardTitle>
              <QrCode className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-600">1</div>
              <p className="text-xs text-muted-foreground">Currently on premises</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Service Requests</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning-600">2</div>
              <p className="text-xs text-muted-foreground">Pending resolution</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            className="h-20 flex flex-col items-center justify-center space-y-2"
            onClick={() => router.push('/tenant/payments')}
          >
            <CreditCard className="h-6 w-6" />
            <span>Make Payment</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center space-y-2"
            onClick={() => router.push('/tenant/visitors')}
          >
            <QrCode className="h-6 w-6" />
            <span>Generate Visitor Code</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center space-y-2"
            onClick={() => router.push('/tenant/requests')}
          >
            <Wrench className="h-6 w-6" />
            <span>Request Service</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center space-y-2"
            onClick={() => router.push('/tenant/requests')}
          >
            <AlertCircle className="h-6 w-6" />
            <span>Report Issue</span>
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Payments */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Payments</CardTitle>
              <CardDescription>Your next payment obligations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingPayments.map((payment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-warning-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{payment.type}</p>
                      <p className="text-xs text-gray-500">Due {formatDate(payment.dueDate)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-warning-600">{formatCurrency(payment.amount)}</p>
                      <Button
                        size="sm"
                        className="mt-1"
                        onClick={() => router.push('/tenant/payments')}
                      >
                        Pay Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Your latest system activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {activity.type === 'payment' && (
                        <div className="w-8 h-8 rounded-full bg-success-100 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-success-600" />
                        </div>
                      )}
                      {activity.type === 'visitor' && (
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <QrCode className="h-4 w-4 text-primary-600" />
                        </div>
                      )}
                      {activity.type === 'service' && (
                        <div className="w-8 h-8 rounded-full bg-warning-100 flex items-center justify-center">
                          <Wrench className="h-4 w-4 text-warning-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Service Requests */}
          <Card>
            <CardHeader>
              <CardTitle>My Service Requests</CardTitle>
              <CardDescription>Track your maintenance requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serviceRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{request.type}</p>
                      <p className="text-xs text-gray-500">{request.description}</p>
                      <p className="text-xs text-gray-400">Submitted {formatDate(request.date)}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${request.status === 'completed' ? 'bg-success-100 text-success-800' :
                          request.status === 'in-progress' ? 'bg-warning-100 text-warning-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/tenant/requests')}
                >
                  <Wrench className="h-4 w-4 mr-2" />
                  Submit New Request
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>Your payment history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-success-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{payment.type}</p>
                      <p className="text-xs text-gray-500">Paid {formatDate(payment.date)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-success-600">{formatCurrency(payment.amount)}</p>
                      <div className="flex items-center text-xs text-success-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/tenant/payments')}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  View All Payments
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
