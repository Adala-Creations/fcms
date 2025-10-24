'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Building2, 
  CreditCard, 
  Receipt, 
  Shield, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building,
  Construction
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/layout/header'
import { formatCurrency } from '@/lib/utils'
import { useApi } from '@/lib/hooks/useApi'
import { dashboardService, expenseService, visitorService, serviceRequestService } from '@/lib/services/api.service'
import type { ExpenseDto, ServiceRequestDto } from '@/lib/types/api'

// Under Construction Component
const UnderConstruction = ({ title }: { title?: string }) => (
  <div className="flex flex-col items-center justify-center py-8 text-center">
    <Construction className="h-12 w-12 text-gray-400 mb-3" />
    <p className="text-sm font-medium text-gray-600">{title || 'Under Construction'}</p>
    <p className="text-xs text-gray-500 mt-1">Data not yet available</p>
  </div>
)

export default function AdminDashboard() {
  const { data: stats, loading: statsLoading, error: statsError } = useApi(
    () => dashboardService.getStats()
  )
  const { data: expenses, loading: expensesLoading } = useApi(
    () => expenseService.getExpenses().catch(() => [])
  )
  const { data: visitors, loading: visitorsLoading } = useApi(
    () => visitorService.getVisitors().catch(() => [])
  )
  const { data: serviceRequests, loading: serviceRequestsLoading } = useApi(
    () => serviceRequestService.getServiceRequests().catch(() => [])
  )

  // Calculate derived stats
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  const monthlyExpenses = expenses?.filter((expense: ExpenseDto) => {
    const expenseDate = new Date(expense.expenseDate)
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
  }).reduce((sum: number, expense: ExpenseDto) => sum + expense.amount, 0) || 0

  const activeVisitors = visitors?.filter((visitor: any) => !visitor.checkOut).length || 0
  const pendingServiceRequests = serviceRequests?.filter((req: ServiceRequestDto) => 
    req.status?.toLowerCase() === 'pending'
  ).length || 0
  return (
    <div>
      <Header 
        title="Admin Dashboard" 
        subtitle="Overview of your property management system"
      />
      
      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        {/* Error State */}
        {statsError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            Error loading dashboard data. Please try again later.
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.totalProperties || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Active properties
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Units</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.totalUnits || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Across all properties
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.totalTenants || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Registered tenants
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {expensesLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{formatCurrency(monthlyExpenses)}</div>
                  <p className="text-xs text-muted-foreground">
                    This month
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Alerts and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-warning-500 mr-2" />
                Payment Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : stats?.totalPayments === 0 ? (
                <UnderConstruction title="Payment Status" />
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-danger-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-danger-800">Overdue Payments</p>
                      <p className="text-xs text-danger-600">{stats?.overduePayments || 0} residents</p>
                    </div>
                    <span className="text-2xl font-bold text-danger-600">{stats?.overduePayments || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-warning-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-warning-800">Pending Payments</p>
                      <p className="text-xs text-warning-600">{stats?.pendingPayments || 0} residents</p>
                    </div>
                    <span className="text-2xl font-bold text-warning-600">{stats?.pendingPayments || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-success-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-success-800">Total Payments</p>
                      <p className="text-xs text-success-600">All time</p>
                    </div>
                    <span className="text-2xl font-bold text-success-600">{stats?.totalPayments || 0}</span>
                  </div>
                </div>
              )}
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
              {visitorsLoading ? (
                <div className="animate-pulse py-8">
                  <div className="h-12 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-3xl font-bold text-success-600 mb-2">{activeVisitors}</div>
                  <p className="text-sm text-gray-600">Currently on premises</p>
                  <button 
                    onClick={() => window.location.href = '/admin/visitors'}
                    className="mt-4 text-sm text-primary-600 hover:text-primary-700"
                  >
                    View Visitor Logs →
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 text-primary-500 mr-2" />
                Service Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {serviceRequestsLoading ? (
                <div className="animate-pulse py-8">
                  <div className="h-12 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-3xl font-bold text-warning-600 mb-2">{pendingServiceRequests}</div>
                  <p className="text-sm text-gray-600">Pending requests</p>
                  <div className="mt-4 text-sm">
                    <p className="text-gray-500">Total: {serviceRequests?.length || 0}</p>
                  </div>
                </div>
              )}
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
              <UnderConstruction title="Recent Activities" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Defaulters</CardTitle>
              <CardDescription>Residents with outstanding payments</CardDescription>
            </CardHeader>
            <CardContent>
              <UnderConstruction title="Top Defaulters" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
