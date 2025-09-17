'use client'

import { useState } from 'react'
import { 
  FileText, 
  Download, 
  Calendar,
  DollarSign,
  Building2,
  Users,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  Filter,
  Shield,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Header from '@/components/layout/header'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

// Mock data for authority reports
const complianceData = [
  { month: 'Jan', violations: 2, resolved: 1, pending: 1 },
  { month: 'Feb', violations: 1, resolved: 1, pending: 0 },
  { month: 'Mar', violations: 3, resolved: 2, pending: 1 },
  { month: 'Apr', violations: 1, resolved: 1, pending: 0 },
  { month: 'May', violations: 2, resolved: 1, pending: 1 },
  { month: 'Jun', violations: 0, resolved: 0, pending: 0 },
]

const propertyCompliance = [
  { property: 'Sunset Gardens', compliance: 95, violations: 1, status: 'Good' },
  { property: 'Riverside Complex', compliance: 88, violations: 3, status: 'Fair' },
  { property: 'Mountain View', compliance: 92, violations: 2, status: 'Good' },
  { property: 'Valley Heights', compliance: 78, violations: 5, status: 'Poor' },
]

const violationTypes = [
  { type: 'Safety Violations', count: 8, percentage: 35 },
  { type: 'Building Code', count: 6, percentage: 26 },
  { type: 'Fire Safety', count: 4, percentage: 17 },
  { type: 'Environmental', count: 3, percentage: 13 },
  { type: 'Other', count: 2, percentage: 9 },
]

const financialCompliance = [
  { month: 'Jan', revenue: 12000, expenses: 8000, compliance: 100 },
  { month: 'Feb', revenue: 15000, expenses: 9000, compliance: 100 },
  { month: 'Mar', revenue: 18000, expenses: 10000, compliance: 95 },
  { month: 'Apr', revenue: 16000, expenses: 8500, compliance: 100 },
  { month: 'May', revenue: 20000, expenses: 12000, compliance: 90 },
  { month: 'Jun', revenue: 22000, expenses: 11000, compliance: 100 },
]

const recentViolations = [
  {
    id: 1,
    property: 'Sunset Gardens',
    unit: 'A-01',
    type: 'Safety Violation',
    description: 'Blocked emergency exit',
    severity: 'High',
    reportedDate: '2024-01-15',
    status: 'Resolved',
    fine: 500
  },
  {
    id: 2,
    property: 'Riverside Complex',
    unit: 'B-05',
    type: 'Building Code',
    description: 'Unauthorized structural modification',
    severity: 'Medium',
    reportedDate: '2024-01-14',
    status: 'Pending',
    fine: 300
  },
  {
    id: 3,
    property: 'Valley Heights',
    unit: 'C-08',
    type: 'Fire Safety',
    description: 'Missing fire extinguisher',
    severity: 'High',
    reportedDate: '2024-01-13',
    status: 'Under Review',
    fine: 200
  }
]

export default function AuthorityReports() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedReport, setSelectedReport] = useState('compliance')

  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  
  const stats = {
    totalProperties: 4,
    compliantProperties: 2,
    nonCompliantProperties: 2,
    totalViolations: 11,
    resolvedViolations: 6,
    pendingViolations: 5,
    totalFines: 1000,
    avgCompliance: 88.5
  }

  const handleDownload = (reportType: string) => {
    // In a real app, this would generate and download the report
    console.log(`Downloading ${reportType} report...`)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-danger-100 text-danger-800'
      case 'Medium': return 'bg-warning-100 text-warning-800'
      case 'Low': return 'bg-success-100 text-success-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'bg-success-100 text-success-800'
      case 'Pending': return 'bg-warning-100 text-warning-800'
      case 'Under Review': return 'bg-primary-100 text-primary-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <Header 
        title="Authority Reports" 
        subtitle="Compliance monitoring and regulatory reports"
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
              <Building2 className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
                <p className="text-xs text-gray-500">
                  {stats.compliantProperties} compliant
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-success-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Compliance</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgCompliance}%</p>
                <p className="text-xs text-success-600 flex items-center">
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
              <AlertTriangle className="h-8 w-8 text-warning-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Violations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViolations}</p>
                <p className="text-xs text-gray-500">
                  {stats.pendingViolations} pending
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-danger-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Fines</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalFines}</p>
                <p className="text-xs text-danger-600 flex items-center">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -10% from last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance Trend</CardTitle>
            <CardDescription>Monthly compliance violations and resolutions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={complianceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="violations" fill="#EF4444" name="Violations" />
                <Bar dataKey="resolved" fill="#10B981" name="Resolved" />
                <Bar dataKey="pending" fill="#F59E0B" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Violation Types Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Violation Types</CardTitle>
            <CardDescription>Distribution of violation types</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={violationTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {violationTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Property Compliance */}
      <Card>
        <CardHeader>
          <CardTitle>Property Compliance Overview</CardTitle>
          <CardDescription>Compliance status by property</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {propertyCompliance.map((property, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{property.property}</h4>
                    <p className="text-sm text-gray-600">{property.violations} violations</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          property.compliance >= 90 ? 'bg-success-500' :
                          property.compliance >= 80 ? 'bg-warning-500' : 'bg-danger-500'
                        }`}
                        style={{ width: `${property.compliance}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{property.compliance}%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{property.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Violations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Violations</CardTitle>
          <CardDescription>Latest compliance violations and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentViolations.map((violation) => (
              <div key={violation.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-danger-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-danger-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{violation.property} - {violation.unit}</h4>
                    <p className="text-sm text-gray-600">{violation.description}</p>
                    <p className="text-xs text-gray-500">Reported: {violation.reportedDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(violation.severity)}`}>
                      {violation.severity}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(violation.status)}`}>
                      {violation.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">Fine: ${violation.fine}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Compliance */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Compliance</CardTitle>
          <CardDescription>Revenue and expense compliance tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={financialCompliance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip formatter={(value, name) => [
                name === 'compliance' ? `${value}%` : `$${value}`,
                name === 'compliance' ? 'Compliance' : name === 'revenue' ? 'Revenue' : 'Expenses'
              ]} />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} name="Revenue" />
              <Line yAxisId="left" type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} name="Expenses" />
              <Line yAxisId="right" type="monotone" dataKey="compliance" stroke="#3B82F6" strokeWidth={2} name="Compliance" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Report Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
          <CardDescription>Download detailed compliance and regulatory reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              onClick={() => handleDownload('compliance')}
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <Shield className="h-6 w-6" />
              <span>Compliance Report</span>
            </Button>
            <Button 
              onClick={() => handleDownload('violations')}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <AlertTriangle className="h-6 w-6" />
              <span>Violations Report</span>
            </Button>
            <Button 
              onClick={() => handleDownload('financial')}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <DollarSign className="h-6 w-6" />
              <span>Financial Report</span>
            </Button>
            <Button 
              onClick={() => handleDownload('summary')}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <FileText className="h-6 w-6" />
              <span>Summary Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
