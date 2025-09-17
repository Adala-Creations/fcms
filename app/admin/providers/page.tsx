'use client'

import { useState } from 'react'
import { 
  Wrench, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Star,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Header from '@/components/layout/header'

// Mock data for service providers
const providers = [
  {
    id: 1,
    name: 'John Plumbing Services',
    category: 'Plumbing',
    phone: '+263 77 123 4567',
    email: 'john@plumbing.co.zw',
    address: '123 Main St, Harare',
    rating: 4.8,
    jobsCompleted: 45,
    status: 'active',
    specialties: ['Leak repairs', 'Pipe installation', 'Drain cleaning'],
    joinDate: '2023-01-15',
    lastJob: '2024-01-10'
  },
  {
    id: 2,
    name: 'Electric Solutions Ltd',
    category: 'Electrical',
    phone: '+263 77 234 5678',
    email: 'info@electricsolutions.co.zw',
    address: '456 Electric Ave, Harare',
    rating: 4.6,
    jobsCompleted: 32,
    status: 'active',
    specialties: ['Wiring', 'Panel repairs', 'Light installation'],
    joinDate: '2023-03-20',
    lastJob: '2024-01-12'
  },
  {
    id: 3,
    name: 'Clean Supplies Ltd',
    category: 'Cleaning',
    phone: '+263 77 345 6789',
    email: 'contact@cleansupplies.co.zw',
    address: '789 Clean St, Harare',
    rating: 4.2,
    jobsCompleted: 28,
    status: 'inactive',
    specialties: ['Office cleaning', 'Window cleaning', 'Floor maintenance'],
    joinDate: '2023-02-10',
    lastJob: '2023-12-15'
  },
  {
    id: 4,
    name: 'Garden Care Pro',
    category: 'Landscaping',
    phone: '+263 77 456 7890',
    email: 'info@gardencare.co.zw',
    address: '321 Garden Rd, Harare',
    rating: 4.9,
    jobsCompleted: 67,
    status: 'active',
    specialties: ['Lawn care', 'Tree trimming', 'Garden design'],
    joinDate: '2022-11-05',
    lastJob: '2024-01-14'
  },
  {
    id: 5,
    name: 'Security Guard Services',
    category: 'Security',
    phone: '+263 77 567 8901',
    email: 'security@guardservices.co.zw',
    address: '654 Security Blvd, Harare',
    rating: 4.7,
    jobsCompleted: 89,
    status: 'active',
    specialties: ['Patrol services', 'Access control', 'Emergency response'],
    joinDate: '2022-08-12',
    lastJob: '2024-01-15'
  }
]

const statusColors = {
  active: 'bg-success-100 text-success-800',
  inactive: 'bg-gray-100 text-gray-800',
  suspended: 'bg-danger-100 text-danger-800'
}

const categoryColors = {
  Plumbing: 'bg-blue-100 text-blue-800',
  Electrical: 'bg-yellow-100 text-yellow-800',
  Cleaning: 'bg-green-100 text-green-800',
  Landscaping: 'bg-emerald-100 text-emerald-800',
  Security: 'bg-red-100 text-red-800',
  Maintenance: 'bg-purple-100 text-purple-800'
}

export default function AdminProviders() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.phone.includes(searchTerm) ||
                         provider.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || provider.status === filterStatus
    const matchesCategory = filterCategory === 'all' || provider.category === filterCategory
    return matchesSearch && matchesStatus && matchesCategory
  })

  const stats = {
    total: providers.length,
    active: providers.filter(p => p.status === 'active').length,
    inactive: providers.filter(p => p.status === 'inactive').length,
    totalJobs: providers.reduce((sum, p) => sum + p.jobsCompleted, 0),
    avgRating: (providers.reduce((sum, p) => sum + p.rating, 0) / providers.length).toFixed(1)
  }

  const categories = ['Plumbing', 'Electrical', 'Cleaning', 'Landscaping', 'Security', 'Maintenance']

  return (
    <div className="space-y-6">
      <Header 
        title="Service Providers" 
        subtitle="Manage service providers and their performance"
      />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Wrench className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Providers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-success-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-gray-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-warning-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgRating}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search providers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <Button onClick={() => setShowAddModal(true)} className="w-full lg:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Provider
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProviders.map((provider) => (
          <Card key={provider.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{provider.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mr-2 ${categoryColors[provider.category as keyof typeof categoryColors]}`}>
                      {provider.category}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[provider.status as keyof typeof statusColors]}`}>
                      {provider.status}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-warning-500 fill-current" />
                  <span className="text-sm font-medium">{provider.rating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {provider.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {provider.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {provider.address}
                </div>
                
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium text-gray-900 mb-2">Specialties:</p>
                  <div className="flex flex-wrap gap-1">
                    {provider.specialties.map((specialty, index) => (
                      <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <p>{provider.jobsCompleted} jobs completed</p>
                    <p>Last job: {new Date(provider.lastJob).toLocaleDateString()}</p>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
