'use client'

import { 
  Users, 
  Building2, 
  CreditCard, 
  Receipt, 
  Shield, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/layout/header'
import { formatCurrency } from '@/lib/utils'

// Mock data - in real app this would come from API
const stats = {
  totalResidents: 156,
  totalUnits: 48,
  monthlyRevenue: 12500,
  monthlyExpenses: 8200,
  pendingPayments: 12,
  overduePayments: 8,
  activeVisitors: 3,
  serviceRequests: 5
}

const recentActivities = [
  { id: 1, type: 'payment', user: 'John Doe', unit: 'A-12', amount: 150, status: 'completed', time: '2 hours ago' },
  { id: 2, type: 'visitor', user: 'Jane Smith', unit: 'B-05', visitor: 'Mike Johnson', status: 'active', time: '1 hour ago' },
  { id: 3, type: 'service', user: 'Bob Wilson', unit: 'C-08', service: 'Plumbing', status: 'pending', time: '3 hours ago' },
  { id: 4, type: 'payment', user: 'Alice Brown', unit: 'A-15', amount: 200, status: 'overdue', time: '1 day ago' },
]

const topDefaulters = [
  { name: 'Alice Brown', unit: 'A-15', amount: 450, daysOverdue: 15 },
  { name: 'Charlie Davis', unit: 'B-12', amount: 300, daysOverdue: 8 },
  { name: 'Diana Prince', unit: 'C-03', amount: 200, daysOverdue: 5 },
]

export default function AdminDashboard() {
  return (
    <div>
      <Header 
        title="Admin Dashboard" 
        subtitle="Overview of your property management system"
      />
      
      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Residents</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalResidents}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Units</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUnits}</div>
              <p className="text-xs text-muted-foreground">
                100% occupancy
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.monthlyRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.monthlyExpenses)}</div>
              <p className="text-xs text-muted-foreground">
                -5% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-warning-500 mr-2" />
                Alerts & Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-danger-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-danger-800">Overdue Payments</p>
                  <p className="text-xs text-danger-600">{stats.overduePayments} residents</p>
                </div>
                <span className="text-2xl font-bold text-danger-600">{stats.overduePayments}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-warning-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-warning-800">Pending Payments</p>
                  <p className="text-xs text-warning-600">{stats.pendingPayments} residents</p>
                </div>
                <span className="text-2xl font-bold text-warning-600">{stats.pendingPayments}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-primary-800">Service Requests</p>
                  <p className="text-xs text-primary-600">{stats.serviceRequests} pending</p>
                </div>
                <span className="text-2xl font-bold text-primary-600">{stats.serviceRequests}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 text-success-500 mr-2" />
                Active Visitors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-success-600 mb-2">{stats.activeVisitors}</div>
                <p className="text-sm text-gray-600">Currently on premises</p>
                <button className="mt-4 text-sm text-primary-600 hover:text-primary-700">
                  View Visitor Logs →
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 text-primary-500 mr-2" />
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Net Profit</span>
                  <span className="font-semibold text-success-600">
                    {formatCurrency(stats.monthlyRevenue - stats.monthlyExpenses)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Profit Margin</span>
                  <span className="font-semibold text-success-600">
                    {Math.round(((stats.monthlyRevenue - stats.monthlyExpenses) / stats.monthlyRevenue) * 100)}%
                  </span>
                </div>
                <div className="pt-2 border-t">
                  <button className="w-full text-sm text-primary-600 hover:text-primary-700">
                    View Detailed Reports →
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities and Top Defaulters */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest system activities and transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {activity.type === 'payment' && (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.status === 'completed' ? 'bg-success-100' : 
                          activity.status === 'overdue' ? 'bg-danger-100' : 'bg-warning-100'
                        }`}>
                          <CreditCard className={`h-4 w-4 ${
                            activity.status === 'completed' ? 'text-success-600' : 
                            activity.status === 'overdue' ? 'text-danger-600' : 'text-warning-600'
                          }`} />
                        </div>
                      )}
                      {activity.type === 'visitor' && (
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <Shield className="h-4 w-4 text-primary-600" />
                        </div>
                      )}
                      {activity.type === 'service' && (
                        <div className="w-8 h-8 rounded-full bg-warning-100 flex items-center justify-center">
                          <Clock className="h-4 w-4 text-warning-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.type === 'payment' && `${activity.user} paid ${formatCurrency(activity.amount || 0)}`}
                        {activity.type === 'visitor' && `${activity.user} registered visitor: ${activity.visitor}`}
                        {activity.type === 'service' && `${activity.user} requested ${activity.service}`}
                      </p>
                      <p className="text-sm text-gray-500 truncate">Unit {activity.unit} • {activity.time}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        activity.status === 'completed' ? 'bg-success-100 text-success-800' :
                        activity.status === 'overdue' ? 'bg-danger-100 text-danger-800' :
                        'bg-warning-100 text-warning-800'
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Defaulters</CardTitle>
              <CardDescription>Residents with outstanding payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topDefaulters.map((defaulter, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-danger-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{defaulter.name}</p>
                      <p className="text-xs text-gray-500 truncate">Unit {defaulter.unit} • {defaulter.daysOverdue} days overdue</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="text-sm font-semibold text-danger-600">{formatCurrency(defaulter.amount)}</p>
                      <button className="text-xs text-primary-600 hover:text-primary-700">
                        Send Reminder
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
