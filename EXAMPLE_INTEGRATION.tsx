/**
 * EXAMPLE: Integrating Real API Data into Tenant Dashboard
 * 
 * This file demonstrates how to replace mock data with real API calls
 * Follow this pattern for other pages
 */

'use client'

import { useEffect, useState } from 'react'
import { 
  CreditCard, 
  QrCode, 
  Wrench, 
  DollarSign,
  Calendar
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/layout/header'
import { formatCurrency, formatDate } from '@/lib/utils'

// Import API hooks and services
import { useDashboardStats, useApi } from '@/lib/hooks/useApi'
import { dashboardService, authService, paymentService } from '@/lib/services/api.service'

export default function TenantDashboard() {
  // Fetch current user
  const { data: currentUser, loading: loadingUser, error: userError } = useApi(
    () => authService.getCurrentUser(),
    []
  )

  // Fetch dashboard statistics (only when user is loaded)
  const { 
    data: stats, 
    loading: loadingStats, 
    error: statsError 
  } = useApi(
    () => currentUser?.id ? dashboardService.getTenantStats(currentUser.id) : Promise.reject('No user ID'),
    [currentUser?.id]
  )

  // Fetch recent payments
  const {
    data: paymentsResponse,
    loading: loadingPayments,
    error: paymentsError
  } = useApi(
    () => paymentService.getPayments({ 
      tenantId: currentUser?.id,
      page: 1,
      pageSize: 5
    }),
    [currentUser?.id]
  )

  // Loading state
  if (loadingUser || loadingStats) {
    return (
      <div>
        <Header title="My Dashboard" subtitle="Loading..." />
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (userError || statsError) {
    return (
      <div>
        <Header title="My Dashboard" subtitle="Error loading data" />
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded p-4">
            <p className="text-red-800">
              {userError || statsError}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Success state with real data
  const recentPayments = paymentsResponse || []
  const tenantName = currentUser?.userName || currentUser?.email || 'User'

  return (
    <div>
      <Header 
        title="My Dashboard" 
        subtitle={`Welcome back, ${tenantName}`}
      />
      
      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        {/* Quick Stats with Real Data */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                (stats?.balance || 0) === 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(stats?.balance || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                {(stats?.balance || 0) === 0 ? 'All payments up to date' : 'Amount due'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Payment Due</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats?.nextDueDate ? formatDate(stats.nextDueDate) : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">Rent payment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Visitors</CardTitle>
              <QrCode className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats?.activeVisitors || 0}
              </div>
              <p className="text-xs text-muted-foreground">Currently on premises</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Service Requests</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats?.serviceRequests || 0}
              </div>
              <p className="text-xs text-muted-foreground">Open requests</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingPayments ? (
              <div>Loading payments...</div>
            ) : paymentsError ? (
              <div className="text-red-600">Error loading payments</div>
            ) : recentPayments.length === 0 ? (
              <div className="text-gray-500">No payments found</div>
            ) : (
              <div className="space-y-4">
                {recentPayments.map((payment) => (
                  <div 
                    key={payment.id}
                    className="flex items-center justify-between p-4 border rounded"
                  >
                    <div>
                      <p className="font-medium">{payment.method || 'Payment'}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(payment.paymentDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(payment.amount)}</p>
                      <p className="text-sm text-gray-600">
                        {payment.reference || 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/**
 * IMPLEMENTATION NOTES:
 * 
 * 1. Import the necessary hooks and services
 * 2. Use useApi hook for fetching data
 * 3. Handle loading, error, and success states
 * 4. Replace mock data with real API responses
 * 5. Add proper TypeScript types
 * 6. Implement retry logic for errors
 * 7. Add loading skeletons for better UX
 * 
 * NEXT STEPS:
 * 
 * 1. Update the API endpoints in api.service.ts to match your backend
 * 2. Verify the response structure matches your types
 * 3. Test with real backend API
 * 4. Add more detailed error messages
 * 5. Implement data refresh on interval if needed
 * 6. Add optimistic updates for mutations
 */
