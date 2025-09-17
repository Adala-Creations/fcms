'use client'

import { 
  FileText, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Download
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Header from '@/components/layout/header'
import { formatCurrency, formatDate } from '@/lib/utils'

// Mock data for authority
const complianceStats = {
  totalComplexes: 12,
  compliantComplexes: 10,
  nonCompliantComplexes: 2,
  totalUnits: 480,
  totalResidents: 1200
}

const complianceIssues = [
  {
    id: 1,
    complex: 'Sunset Gardens',
    issue: 'Fire safety violations',
    severity: 'high',
    reportedDate: '2024-01-10',
    status: 'under-investigation',
    units: 24
  },
  {
    id: 2,
    complex: 'Riverside Apartments',
    issue: 'Building permit expired',
    severity: 'medium',
    reportedDate: '2024-01-12',
    status: 'pending',
    units: 36
  },
  {
    id: 3,
    complex: 'Mountain View Complex',
    issue: 'Water quality concerns',
    severity: 'high',
    reportedDate: '2024-01-14',
    status: 'resolved',
    units: 48
  }
]

const financialReports = [
  {
    id: 1,
    complex: 'Sunset Gardens',
    monthlyRevenue: 12000,
    monthlyExpenses: 8000,
    netProfit: 4000,
    complianceScore: 85,
    lastAudit: '2024-01-01'
  },
  {
    id: 2,
    complex: 'Riverside Apartments',
    monthlyRevenue: 18000,
    monthlyExpenses: 12000,
    netProfit: 6000,
    complianceScore: 92,
    lastAudit: '2024-01-05'
  },
  {
    id: 3,
    complex: 'Mountain View Complex',
    monthlyRevenue: 24000,
    monthlyExpenses: 16000,
    netProfit: 8000,
    complianceScore: 78,
    lastAudit: '2024-01-08'
  }
]

const recentActivities = [
  {
    id: 1,
    type: 'audit',
    complex: 'Sunset Gardens',
    description: 'Annual compliance audit completed',
    date: '2024-01-15',
    status: 'completed'
  },
  {
    id: 2,
    type: 'violation',
    complex: 'Riverside Apartments',
    description: 'Fire safety violation reported',
    date: '2024-01-14',
    status: 'under-investigation'
  },
  {
    id: 3,
    type: 'inspection',
    complex: 'Mountain View Complex',
    description: 'Water quality inspection scheduled',
    date: '2024-01-13',
    status: 'scheduled'
  }
]

export default function AuthorityDashboard() {
  return (
    <div>
      <Header 
        title="Authority Dashboard" 
        subtitle="Regulatory oversight and compliance monitoring"
      />
      
      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        {/* Compliance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Complexes</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-600">{complianceStats.totalComplexes}</div>
              <p className="text-xs text-muted-foreground">Under oversight</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliant</CardTitle>
              <CheckCircle className="h-4 w-4 text-success-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success-600">{complianceStats.compliantComplexes}</div>
              <p className="text-xs text-muted-foreground">Meeting standards</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Non-Compliant</CardTitle>
              <AlertTriangle className="h-4 w-4 text-danger-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-danger-600">{complianceStats.nonCompliantComplexes}</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Units</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-600">{complianceStats.totalUnits}</div>
              <p className="text-xs text-muted-foreground">Residential units</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button className="h-20 flex flex-col items-center justify-center space-y-2">
            <FileText className="h-6 w-6" />
            <span>Generate Report</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
            <Shield className="h-6 w-6" />
            <span>Compliance Check</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
            <Download className="h-6 w-6" />
            <span>Export Data</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
            <AlertTriangle className="h-6 w-6" />
            <span>Issue Notice</span>
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compliance Issues */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Issues</CardTitle>
              <CardDescription>Current violations and concerns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceIssues.map((issue) => (
                  <div key={issue.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          issue.severity === 'high' ? 'bg-danger-100' :
                          issue.severity === 'medium' ? 'bg-warning-100' : 'bg-success-100'
                        }`}>
                          <AlertTriangle className={`h-5 w-5 ${
                            issue.severity === 'high' ? 'text-danger-600' :
                            issue.severity === 'medium' ? 'text-warning-600' : 'text-success-600'
                          }`} />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{issue.complex}</h3>
                          <p className="text-xs text-gray-500">{issue.issue}</p>
                          <p className="text-xs text-gray-400">Reported {formatDate(issue.reportedDate)}</p>
                          <p className="text-xs text-gray-400">{issue.units} units affected</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        issue.status === 'resolved' ? 'bg-success-100 text-success-800' :
                        issue.status === 'under-investigation' ? 'bg-warning-100 text-warning-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {issue.status.replace('-', ' ').charAt(0).toUpperCase() + issue.status.replace('-', ' ').slice(1)}
                      </span>
                      <p className="text-xs text-gray-500 mt-1 capitalize">{issue.severity} priority</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Financial Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Overview</CardTitle>
              <CardDescription>Revenue and compliance scores by complex</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {financialReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{report.complex}</h3>
                          <p className="text-xs text-gray-500">Revenue: {formatCurrency(report.monthlyRevenue)}</p>
                          <p className="text-xs text-gray-500">Expenses: {formatCurrency(report.monthlyExpenses)}</p>
                          <p className="text-xs text-gray-400">Last audit: {formatDate(report.lastAudit)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-success-600">{formatCurrency(report.netProfit)}</p>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          report.complianceScore >= 90 ? 'bg-success-100 text-success-800' :
                          report.complianceScore >= 80 ? 'bg-warning-100 text-warning-800' :
                          'bg-danger-100 text-danger-800'
                        }`}>
                          {report.complianceScore}%
                        </span>
                      </div>
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
              <CardDescription>Latest regulatory activities and inspections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {activity.type === 'audit' && (
                        <div className="w-8 h-8 rounded-full bg-success-100 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-success-600" />
                        </div>
                      )}
                      {activity.type === 'violation' && (
                        <div className="w-8 h-8 rounded-full bg-danger-100 flex items-center justify-center">
                          <AlertTriangle className="h-4 w-4 text-danger-600" />
                        </div>
                      )}
                      {activity.type === 'inspection' && (
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <Shield className="h-4 w-4 text-primary-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.complex}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500">{formatDate(activity.date)}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        activity.status === 'completed' ? 'bg-success-100 text-success-800' :
                        activity.status === 'under-investigation' ? 'bg-warning-100 text-warning-800' :
                        'bg-primary-100 text-primary-800'
                      }`}>
                        {activity.status.replace('-', ' ').charAt(0).toUpperCase() + activity.status.replace('-', ' ').slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Compliance Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Summary</CardTitle>
              <CardDescription>Overall regulatory compliance status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-success-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success-600" />
                    <div>
                      <p className="text-sm font-medium text-success-800">Compliant Complexes</p>
                      <p className="text-xs text-success-600">Meeting all requirements</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-success-600">{complianceStats.compliantComplexes}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-danger-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-danger-600" />
                    <div>
                      <p className="text-sm font-medium text-danger-800">Non-Compliant Complexes</p>
                      <p className="text-xs text-danger-600">Requires immediate attention</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-danger-600">{complianceStats.nonCompliantComplexes}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="text-sm font-medium text-primary-800">Total Units Monitored</p>
                      <p className="text-xs text-primary-600">Residential properties</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-primary-600">{complianceStats.totalUnits}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
