'use client'

import { useState } from 'react'
import { 
  Receipt, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Header from '@/components/layout/header'

// Mock data for expenses
const expenses = [
  {
    id: 1,
    category: 'Maintenance',
    description: 'Plumbing repair - Block A',
    amount: 150,
    provider: 'John Plumbing Services',
    receiptUrl: '/receipts/plumbing-001.pdf',
    status: 'approved',
    approvedBy: 'Admin User',
    date: '2024-01-15',
    unit: 'A-01'
  },
  {
    id: 2,
    category: 'Security',
    description: 'Security guard uniforms',
    amount: 300,
    provider: 'Uniform Supply Co.',
    receiptUrl: '/receipts/security-001.pdf',
    status: 'pending',
    approvedBy: null,
    date: '2024-01-14',
    unit: 'General'
  },
  {
    id: 3,
    category: 'Utilities',
    description: 'Electricity bill - Common areas',
    amount: 450,
    provider: 'ZESA Holdings',
    receiptUrl: '/receipts/utilities-001.pdf',
    status: 'approved',
    approvedBy: 'Admin User',
    date: '2024-01-10',
    unit: 'General'
  },
  {
    id: 4,
    category: 'Cleaning',
    description: 'Monthly cleaning supplies',
    amount: 75,
    provider: 'Clean Supplies Ltd',
    receiptUrl: '/receipts/cleaning-001.pdf',
    status: 'rejected',
    approvedBy: 'Admin User',
    date: '2024-01-12',
    unit: 'General'
  },
  {
    id: 5,
    category: 'Maintenance',
    description: 'Elevator maintenance',
    amount: 200,
    provider: 'Elevator Solutions',
    receiptUrl: '/receipts/elevator-001.pdf',
    status: 'pending',
    approvedBy: null,
    date: '2024-01-13',
    unit: 'General'
  }
]

const statusColors = {
  approved: 'bg-success-100 text-success-800',
  pending: 'bg-warning-100 text-warning-800',
  rejected: 'bg-danger-100 text-danger-800'
}

const statusIcons = {
  approved: CheckCircle,
  pending: Clock,
  rejected: AlertCircle
}

export default function AdminExpenses() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || expense.status === filterStatus
    const matchesCategory = filterCategory === 'all' || expense.category === filterCategory
    return matchesSearch && matchesStatus && matchesCategory
  })

  const stats = {
    total: expenses.length,
    approved: expenses.filter(e => e.status === 'approved').length,
    pending: expenses.filter(e => e.status === 'pending').length,
    rejected: expenses.filter(e => e.status === 'rejected').length,
    totalAmount: expenses.reduce((sum, e) => sum + e.amount, 0),
    approvedAmount: expenses.filter(e => e.status === 'approved').reduce((sum, e) => sum + e.amount, 0)
  }

  const categories = ['Maintenance', 'Security', 'Utilities', 'Cleaning', 'Repairs', 'Other']

  return (
    <div className="space-y-6">
      <Header 
        title="Expenses Management" 
        subtitle="Track and approve all property expenses"
      />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Receipt className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
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
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-warning-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalAmount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-success-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved Amount</p>
                <p className="text-2xl font-bold text-gray-900">${stats.approvedAmount}</p>
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
                  placeholder="Search expenses..."
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
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
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
              Add Expense
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Expenses ({filteredExpenses.length})</CardTitle>
          <CardDescription>
            Manage and approve property expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Description</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Provider</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => {
                  const StatusIcon = statusIcons[expense.status as keyof typeof statusIcons]
                  return (
                    <tr key={expense.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-gray-900">{expense.category}</td>
                      <td className="py-3 px-4 text-gray-900">{expense.description}</td>
                      <td className="py-3 px-4 text-gray-900">{expense.provider}</td>
                      <td className="py-3 px-4 text-gray-900 font-medium">${expense.amount}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${statusColors[expense.status as keyof typeof statusColors]}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {expense.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {expense.status === 'pending' && (
                            <>
                              <Button variant="outline" size="sm" className="text-success-600 hover:text-success-700">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="text-danger-600 hover:text-danger-700">
                                <AlertCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
