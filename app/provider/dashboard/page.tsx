'use client'

import { 
  Wrench, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Star,
  Calendar,
  Upload,
  AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Header from '@/components/layout/header'
import { formatCurrency, formatDate } from '@/lib/utils'

// Mock data for service provider
const providerData = {
  name: 'Mike Johnson',
  category: 'Plumbing',
  rating: 4.8,
  jobsCompleted: 45,
  totalEarnings: 2250,
  pendingJobs: 3,
  completedThisMonth: 8
}

const recentJobs = [
  {
    id: 1,
    resident: 'John Doe',
    unit: 'A-12',
    type: 'Plumbing',
    description: 'Fix leaky faucet in kitchen',
    status: 'completed',
    amount: 50,
    date: '2024-01-15',
    rating: 5
  },
  {
    id: 2,
    resident: 'Jane Smith',
    unit: 'B-05',
    type: 'Plumbing',
    description: 'Unclog bathroom drain',
    status: 'in-progress',
    amount: 75,
    date: '2024-01-14',
    rating: null
  },
  {
    id: 3,
    resident: 'Bob Wilson',
    unit: 'C-08',
    type: 'Plumbing',
    description: 'Install new shower head',
    status: 'pending',
    amount: 60,
    date: '2024-01-13',
    rating: null
  }
]

const upcomingJobs = [
  {
    id: 4,
    resident: 'Alice Brown',
    unit: 'A-15',
    type: 'Plumbing',
    description: 'Repair water heater',
    scheduledDate: '2024-01-16',
    estimatedDuration: '2 hours',
    amount: 120
  },
  {
    id: 5,
    resident: 'Charlie Davis',
    unit: 'B-12',
    type: 'Plumbing',
    description: 'Fix burst pipe',
    scheduledDate: '2024-01-17',
    estimatedDuration: '3 hours',
    amount: 150
  }
]

const monthlyEarnings = [
  { month: 'Jan', amount: 850 },
  { month: 'Feb', amount: 920 },
  { month: 'Mar', amount: 780 },
  { month: 'Apr', amount: 1050 },
  { month: 'May', amount: 980 },
  { month: 'Jun', amount: 1100 }
]

export default function ProviderDashboard() {
  return (
    <div>
      <Header 
        title="Service Provider Dashboard" 
        subtitle={`Welcome back, ${providerData.name}`}
      />
      
      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success-600">{formatCurrency(providerData.totalEarnings)}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jobs Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-600">{providerData.jobsCompleted}</div>
              <p className="text-xs text-muted-foreground">Total completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Jobs</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning-600">{providerData.pendingJobs}</div>
              <p className="text-xs text-muted-foreground">Awaiting completion</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning-600">{providerData.rating}</div>
              <p className="text-xs text-muted-foreground">Out of 5.0</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="h-20 flex flex-col items-center justify-center space-y-2">
            <Wrench className="h-6 w-6" />
            <span>View My Jobs</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
            <Upload className="h-6 w-6" />
            <span>Upload Receipt</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
            <Calendar className="h-6 w-6" />
            <span>Update Schedule</span>
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Jobs */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Jobs</CardTitle>
              <CardDescription>Your latest service requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Wrench className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{job.description}</h3>
                          <p className="text-xs text-gray-500">{job.resident} - Unit {job.unit}</p>
                          <p className="text-xs text-gray-400">{formatDate(job.date)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(job.amount)}</p>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          job.status === 'completed' ? 'bg-success-100 text-success-800' :
                          job.status === 'in-progress' ? 'bg-warning-100 text-warning-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                        {job.rating && (
                          <div className="flex items-center text-xs text-warning-600">
                            <Star className="h-3 w-3 mr-1" />
                            {job.rating}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Jobs */}
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Jobs</CardTitle>
              <CardDescription>Your upcoming appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{job.description}</h3>
                          <p className="text-xs text-gray-500">{job.resident} - Unit {job.unit}</p>
                          <p className="text-xs text-gray-400">Scheduled: {formatDate(job.scheduledDate)}</p>
                          <p className="text-xs text-gray-400">Duration: {job.estimatedDuration}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary-600">{formatCurrency(job.amount)}</p>
                      <Button size="sm" variant="outline">
                        Start Job
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Earnings Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Earnings</CardTitle>
              <CardDescription>Your earnings over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyEarnings.map((month, index) => (
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
                            style={{ width: `${(month.amount / 1200) * 100}%` }}
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

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>This Month</CardTitle>
              <CardDescription>Your current month performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-success-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success-600" />
                    <div>
                      <p className="text-sm font-medium text-success-800">Jobs Completed</p>
                      <p className="text-xs text-success-600">This month</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-success-600">{providerData.completedThisMonth}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-warning-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-warning-600" />
                    <div>
                      <p className="text-sm font-medium text-warning-800">Pending Jobs</p>
                      <p className="text-xs text-warning-600">Awaiting completion</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-warning-600">{providerData.pendingJobs}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Star className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="text-sm font-medium text-primary-800">Average Rating</p>
                      <p className="text-xs text-primary-600">Customer satisfaction</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-primary-600">{providerData.rating}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
