'use client'

import { useState } from 'react'
import { 
  FileText, 
  Download, 
  Calendar,
  DollarSign,
  Building2,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  Filter,
  Users,
  Wrench
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Header from '@/components/layout/header'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

// Mock data for charts
const monthlyRent = [
  { month: 'Jan', collected: 270, expected: 270, units: 2 },
  { month: 'Feb', collected: 270, expected: 270, units: 2 },
  { month: 'Mar', collected: 270, expected: 270, units: 2 },
  { month: 'Apr', collected: 270, expected: 270, units: 2 },
  { month: 'May', collected: 270, expected: 270, units: 2 },
  { month: 'Jun', collected: 270, expected: 270, units: 2 },
]

const unitPerformance = [
  { unit: 'A-01', rent: 150, occupancy: 100, maintenance: 85 },
  { unit: 'A-02', rent: 200, occupancy: 0, maintenance: 90 },
  { unit: 'B-01', rent: 120, occupancy: 100, maintenance: 75 },
]

const expenseBreakdown = [
  { category: 'Maintenance', amount: 450, percentage: 40 },
  { category: 'Utilities', amount: 200, percentage: 18 },
  { category: 'Insurance', amount: 150, percentage: 13 },
  { category: 'Taxes', amount: 200, percentage: 18 },
  { category: 'Other', amount: 120, percentage: 11 },
]

const tenantSatisfaction = [
  { month: 'Jan', rating: 4.2 },
  { month: 'Feb', rating: 4.5 },
  { month: 'Mar', rating: 4.3 },
  { month: 'Apr', rating: 4.6 },
  { month: 'May', rating: 4.4 },
  { month: 'Jun', rating: 4.7 },
]

const serviceRequests = [
  { category: 'Plumbing', count: 5, avgCost: 60 },
  { category: 'Electrical', count: 3, avgCost: 80 },
  { category: 'Maintenance', count: 8, avgCost: 45 },
  { category: 'Cleaning', count: 2, avgCost: 30 },
]

export default function OwnerReports() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedReport, setSelectedReport] = useState('financial')

  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  
  const stats = {
    totalUnits: 3,
    occupiedUnits: 2,
    vacantUnits: 1,
    occupancyRate: 67,
    totalRent: 270,
    collectedRent: 270,
    collectionRate: 100,
    totalExpenses: 1120,
    netIncome: 500,
    avgTenantRating: 4.5,
    totalServiceRequests: 18,
    avgResponseTime: 2.5
  }

  const handleDownload = (reportType: string) => {
    // In a real app, this would generate and download the report
    console.log(`Downloading ${reportType} report...`)
  }

  return (
    <div className="space-y-6">
      <Header 
        title="Owner Reports" 
        subtitle="Comprehensive reports for your rental properties"
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
                <p className="text-sm font-medium text-gray-600">Monthly Rent</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRent}</p>
                <p className="text-xs text-success-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stats.collectionRate}% collected
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
              <TrendingDown className="h-8 w-8 text-danger-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monthly Expenses</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalExpenses}</p>
                <p className="text-xs text-danger-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8% from last month
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
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgTenantRating}</p>
                <p className="text-xs text-success-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +0.2 from last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rent Collection Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Rent Collection</CardTitle>
            <CardDescription>Monthly rent collection vs expected for {currentMonth}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRent}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, '']} />
                <Bar dataKey="collected" fill="#10B981" name="Collected" />
                <Bar dataKey="expected" fill="#E5E7EB" name="Expected" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Unit Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Unit Performance</CardTitle>
            <CardDescription>Performance metrics by unit</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={unitPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="unit" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="rent" fill="#3B82F6" name="Rent ($)" />
                <Bar dataKey="occupancy" fill="#10B981" name="Occupancy (%)" />
                <Bar dataKey="maintenance" fill="#F59E0B" name="Maintenance Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Monthly expenses by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenseBreakdown.map((expense, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                    <span className="text-sm font-medium text-gray-900">{expense.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${expense.amount}</p>
                    <p className="text-xs text-gray-500">{expense.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Service Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Service Requests</CardTitle>
            <CardDescription>Maintenance requests by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serviceRequests.map((request, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{request.category}</p>
                    <p className="text-xs text-gray-500">{request.count} requests</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${request.avgCost}</p>
                    <p className="text-xs text-gray-500">avg cost</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tenant Satisfaction Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Tenant Satisfaction Trend</CardTitle>
          <CardDescription>Average tenant rating over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={tenantSatisfaction}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[3, 5]} />
              <Tooltip formatter={(value) => [`${value}/5`, 'Rating']} />
              <Line type="monotone" dataKey="rating" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
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
              onClick={() => handleDownload('rental-income')}
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <DollarSign className="h-6 w-6" />
              <span>Rental Income</span>
            </Button>
            <Button 
              onClick={() => handleDownload('expenses')}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <TrendingDown className="h-6 w-6" />
              <span>Expenses Report</span>
            </Button>
            <Button 
              onClick={() => handleDownload('maintenance')}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <Wrench className="h-6 w-6" />
              <span>Maintenance</span>
            </Button>
            <Button 
              onClick={() => handleDownload('tenant-analysis')}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <Users className="h-6 w-6" />
              <span>Tenant Analysis</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
