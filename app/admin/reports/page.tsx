'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, 
  Download, 
  Calendar,
  DollarSign,
  Users,
  Building2,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  Filter
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Header from '@/components/layout/header'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useApi } from '@/lib/hooks/useApi'
import { paymentService, expenseService, unitService, visitorService } from '@/lib/services/api.service'
import type { PaymentDto, ExpenseDto, UnitDto, VisitorDto } from '@/lib/types/api'

export default function AdminReports() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedReport, setSelectedReport] = useState('financial')
  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([])
  const [paymentStatusData, setPaymentStatusData] = useState<any[]>([])
  const [expenseCategories, setExpenseCategories] = useState<any[]>([])
  const [visitorStats, setVisitorStats] = useState<any[]>([])
  
  const { data: payments, loading: paymentsLoading, error: paymentsError } = useApi<PaymentDto[]>(
    () => paymentService.getPayments()
  )
  const { data: expenses, loading: expensesLoading, error: expensesError } = useApi<ExpenseDto[]>(
    () => expenseService.getExpenses()
  )
  const { data: units, loading: unitsLoading, error: unitsError } = useApi<UnitDto[]>(
    () => unitService.getUnits()
  )
  const { data: visitors, loading: visitorsLoading, error: visitorsError } = useApi<VisitorDto[]>(
    () => visitorService.getVisitors()
  )

  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  
  // Calculate stats from real data
  const stats = {
    totalRevenue: payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
    totalExpenses: expenses?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0,
    netIncome: (payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0) - (expenses?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0),
    totalUnits: units?.length || 0,
    occupiedUnits: units?.filter(u => u.isOccupied).length || 0,
    occupancyRate: units?.length ? Math.round((units.filter(u => u.isOccupied).length / units.length) * 100) : 0,
    averageRent: payments?.length ? Math.round((payments.reduce((sum, p) => sum + (p.amount || 0), 0) / payments.length)) : 0,
    collectionRate: payments?.length || 0
  }

  // Process data for charts
  useEffect(() => {
    if (payments && expenses) {
      // Monthly revenue and expenses grouped by month
      const monthlyData: Record<string, { revenue: number; expenses: number }> = {}
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      
      payments.forEach(payment => {
        if (payment.paymentDate) {
          const month = monthNames[new Date(payment.paymentDate).getMonth()]
          if (!monthlyData[month]) monthlyData[month] = { revenue: 0, expenses: 0 }
          monthlyData[month].revenue += payment.amount || 0
        }
      })
      
      expenses.forEach(expense => {
        if (expense.expenseDate) {
          const month = monthNames[new Date(expense.expenseDate).getMonth()]
          if (!monthlyData[month]) monthlyData[month] = { revenue: 0, expenses: 0 }
          monthlyData[month].expenses += expense.amount || 0
        }
      })
      
      setMonthlyRevenue(
        Object.entries(monthlyData).map(([month, data]) => ({
          month,
          revenue: data.revenue,
          expenses: data.expenses
        }))
      )

      // Payment method distribution
      const methodCounts: Record<string, number> = {}
      payments.forEach(p => {
        const method = p.method || 'Unknown'
        methodCounts[method] = (methodCounts[method] || 0) + 1
      })
      
      setPaymentStatusData(
        Object.entries(methodCounts).map(([name, value]) => ({
          name,
          value,
          color: name === 'EcoCash' ? '#10B981' : name === 'Bank Transfer' ? '#F59E0B' : '#3B82F6'
        }))
      )

      // Expense categories
      const categoryTotals: Record<string, number> = {}
      expenses.forEach(e => {
        const category = e.category || 'Other'
        categoryTotals[category] = (categoryTotals[category] || 0) + (e.amount || 0)
      })
      
      const total = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0)
      setExpenseCategories(
        Object.entries(categoryTotals).map(([category, amount]) => ({
          category,
          amount,
          percentage: total > 0 ? Math.round((amount / total) * 100) : 0
        }))
      )
    }

    // Visitor stats by day of week
    if (visitors) {
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const dayCounts: Record<string, number> = {}
      
      visitors.forEach(v => {
        if (v.checkIn) {
          const day = dayNames[new Date(v.checkIn).getDay()]
          dayCounts[day] = (dayCounts[day] || 0) + 1
        }
      })
      
      setVisitorStats(
        dayNames.map(day => ({
          day,
          visitors: dayCounts[day] || 0
        }))
      )
    }
  }, [payments, expenses, visitors])

  const loading = paymentsLoading || expensesLoading || unitsLoading || visitorsLoading
  const error = paymentsError || expensesError || unitsError || visitorsError

  const handleDownload = (reportType: string) => {
    const headerMap: Record<string, string> = {
      financial: 'Financial Report',
      occupancy: 'Occupancy Report',
      visitors: 'Visitor Report',
      compliance: 'Compliance Report',
    }

    const lines: string[] = []
    lines.push(`FCMS - ${headerMap[reportType] || reportType}`)
    lines.push(`Period: ${selectedPeriod}`)
    lines.push(`Generated: ${new Date().toLocaleString()}`)
    lines.push('')

    if (reportType === 'financial') {
      lines.push(`Total Revenue: ${stats.totalRevenue}`)
      lines.push(`Total Expenses: ${stats.totalExpenses}`)
      lines.push(`Net Income: ${stats.netIncome}`)
      lines.push('')
      lines.push('Monthly revenue/expenses:')
      monthlyRevenue.forEach((m: any) => lines.push(`${m.month}: revenue=${m.revenue}, expenses=${m.expenses}`))
      lines.push('')
      lines.push('Payment methods:')
      paymentStatusData.forEach((p: any) => lines.push(`${p.name}: ${p.value}`))
    } else if (reportType === 'occupancy') {
      lines.push(`Total Units: ${stats.totalUnits}`)
      lines.push(`Occupied Units: ${stats.occupiedUnits}`)
      lines.push(`Occupancy Rate: ${stats.occupancyRate}%`)
    } else if (reportType === 'visitors') {
      lines.push('Visitors by day:')
      visitorStats.forEach((d: any) => lines.push(`${d.day}: ${d.visitors}`))
    } else if (reportType === 'compliance') {
      lines.push('Expense categories:')
      expenseCategories.forEach((c: any) => lines.push(`${c.category}: ${c.amount} (${c.percentage}%)`))
    }

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${reportType}-${selectedPeriod}-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Header 
          title="Reports & Analytics" 
          subtitle="Comprehensive reports and analytics for property management"
        />
        <Card>
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="text-gray-600">Loading reports data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Header 
          title="Reports & Analytics" 
          subtitle="Comprehensive reports and analytics for property management"
        />
        <Card>
          <CardContent className="p-12">
            <div className="text-center space-y-4">
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-red-800 mb-2">Failed to load reports data</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Header 
        title="Reports & Analytics" 
        subtitle="Comprehensive reports and analytics for property management"
      />
      
      {/* Period Selection */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center space-x-4">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Report Period</h3>
                <p className="text-sm text-gray-600">Select the time period for your reports</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {['week', 'month', 'quarter', 'year'].map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? 'default' : 'outline'}
                  onClick={() => setSelectedPeriod(period)}
                  className="capitalize"
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-success-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-success-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingDown className="h-8 w-8 text-danger-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalExpenses.toLocaleString()}</p>
                <p className="text-xs text-danger-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5% from last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.occupancyRate}%</p>
                <p className="text-xs text-gray-600">
                  {stats.occupiedUnits}/{stats.totalUnits} units occupied
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-warning-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Collection Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.collectionRate}%</p>
                <p className="text-xs text-success-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +3% from last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expenses Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
            <CardDescription>Monthly comparison for {currentMonth}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, '']} />
                <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
                <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Method Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method Distribution</CardTitle>
            <CardDescription>Breakdown by payment method</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
            <CardDescription>Breakdown of expenses by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenseCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                    <span className="text-sm font-medium text-gray-900">{category.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${category.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{category.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>Latest payment transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments && payments
                .slice(0, 4)
                .map((payment, index) => {
                  const daysAgo = payment.paymentDate 
                    ? Math.floor((new Date().getTime() - new Date(payment.paymentDate).getTime()) / (1000 * 60 * 60 * 24))
                    : 0
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Payment #{payment.id}</p>
                        <p className="text-xs text-gray-500">Unit: {payment.unitId} | Method: {payment.method || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-blue-600">${payment.amount || 0}</p>
                        <p className="text-xs text-gray-500">{daysAgo > 0 ? `${daysAgo} days ago` : 'Today'}</p>
                      </div>
                    </div>
                  )
                })}
              {(!payments || payments.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">No payments found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visitor Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Visitor Analytics</CardTitle>
          <CardDescription>Weekly visitor patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={visitorStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="visitors" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Report Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
          <CardDescription>Download detailed reports in various formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              onClick={() => handleDownload('financial')}
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <DollarSign className="h-6 w-6" />
              <span>Financial Report</span>
            </Button>
            <Button 
              onClick={() => handleDownload('occupancy')}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <Building2 className="h-6 w-6" />
              <span>Occupancy Report</span>
            </Button>
            <Button 
              onClick={() => handleDownload('visitors')}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <Users className="h-6 w-6" />
              <span>Visitor Report</span>
            </Button>
            <Button 
              onClick={() => handleDownload('compliance')}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <FileText className="h-6 w-6" />
              <span>Compliance Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
