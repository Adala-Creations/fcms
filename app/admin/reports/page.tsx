'use client'

import { useState } from 'react'
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

// Mock data for charts
const monthlyRevenue = [
  { month: 'Jan', revenue: 12000, expenses: 8000 },
  { month: 'Feb', revenue: 15000, expenses: 9000 },
  { month: 'Mar', revenue: 18000, expenses: 10000 },
  { month: 'Apr', revenue: 16000, expenses: 8500 },
  { month: 'May', revenue: 20000, expenses: 12000 },
  { month: 'Jun', revenue: 22000, expenses: 11000 },
]

const paymentStatusData = [
  { name: 'Paid', value: 85, color: '#10B981' },
  { name: 'Pending', value: 10, color: '#F59E0B' },
  { name: 'Overdue', value: 5, color: '#EF4444' },
]

const expenseCategories = [
  { category: 'Maintenance', amount: 4500, percentage: 35 },
  { category: 'Utilities', amount: 3200, percentage: 25 },
  { category: 'Security', amount: 2800, percentage: 22 },
  { category: 'Cleaning', amount: 1800, percentage: 14 },
  { category: 'Other', amount: 500, percentage: 4 },
]

const topDefaulters = [
  { name: 'Alice Brown', unit: 'A-15', amount: 450, daysOverdue: 15 },
  { name: 'Charlie Davis', unit: 'B-12', amount: 300, daysOverdue: 8 },
  { name: 'Diana Prince', unit: 'C-03', amount: 200, daysOverdue: 5 },
  { name: 'Eve Wilson', unit: 'A-08', amount: 150, daysOverdue: 3 },
]

const visitorStats = [
  { day: 'Mon', visitors: 12 },
  { day: 'Tue', visitors: 8 },
  { day: 'Wed', visitors: 15 },
  { day: 'Thu', visitors: 10 },
  { day: 'Fri', visitors: 18 },
  { day: 'Sat', visitors: 25 },
  { day: 'Sun', visitors: 20 },
]

export default function AdminReports() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedReport, setSelectedReport] = useState('financial')

  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  
  const stats = {
    totalRevenue: 22000,
    totalExpenses: 11000,
    netIncome: 11000,
    occupancyRate: 85,
    totalUnits: 48,
    occupiedUnits: 41,
    averageRent: 180,
    collectionRate: 92
  }

  const handleDownload = (reportType: string) => {
    // In a real app, this would generate and download the report
    console.log(`Downloading ${reportType} report...`)
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

        {/* Payment Status Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Status Distribution</CardTitle>
            <CardDescription>Current payment status overview</CardDescription>
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

        {/* Top Defaulters */}
        <Card>
          <CardHeader>
            <CardTitle>Top Defaulters</CardTitle>
            <CardDescription>Residents with outstanding payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDefaulters.map((defaulter, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{defaulter.name}</p>
                    <p className="text-xs text-gray-500">Unit {defaulter.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-600">${defaulter.amount}</p>
                    <p className="text-xs text-gray-500">{defaulter.daysOverdue} days overdue</p>
                  </div>
                </div>
              ))}
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
