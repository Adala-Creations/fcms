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
import { useApi } from '@/lib/hooks/useApi'
import { useToast } from '@/lib/hooks/useToast'
import { expenseService } from '@/lib/services/api.service'
import type { ExpenseDto } from '@/lib/types/api'

const categories = ['Maintenance', 'Utilities', 'Security', 'Cleaning', 'Landscaping', 'Repairs', 'Insurance', 'Other']

export default function AdminExpenses() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<ExpenseDto | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    propertyId: '',
    description: '',
    amount: '',
    expenseDate: '',
    category: ''
  })

  const { data: expenses, loading, error, refetch } = useApi<ExpenseDto[]>(
    () => expenseService.getExpenses()
  )
  const toast = useToast()

  const filteredExpenses = (expenses || []).filter(expense => {
    const matchesSearch = expense.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || expense.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const totalExpenses = (expenses || []).reduce((sum, expense) => sum + (expense.amount || 0), 0)
  const thisMonthExpenses = (expenses || []).filter(e => {
    const expenseDate = new Date(e.expenseDate)
    const now = new Date()
    return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear()
  })
  const thisMonthTotal = thisMonthExpenses.reduce((sum, e) => sum + (e.amount || 0), 0)

  const handleAdd = () => {
    setFormData({
      propertyId: '',
      description: '',
      amount: '',
      expenseDate: new Date().toISOString().split('T')[0],
      category: ''
    })
    setShowAddModal(true)
  }

  const handleEdit = (expense: ExpenseDto) => {
    setSelectedExpense(expense)
    setFormData({
      propertyId: expense.propertyId.toString(),
      description: expense.description || '',
      amount: expense.amount.toString(),
      expenseDate: expense.expenseDate.split('T')[0],
      category: expense.category || ''
    })
    setShowEditModal(true)
  }

  const handleDelete = (expense: ExpenseDto) => {
    setSelectedExpense(expense)
    setShowDeleteModal(true)
  }

  const handleView = (expense: ExpenseDto) => {
    setSelectedExpense(expense)
    setShowViewModal(true)
  }

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await expenseService.createExpense({
        propertyId: parseInt(formData.propertyId),
        description: formData.description,
        amount: parseFloat(formData.amount),
        expenseDate: new Date(formData.expenseDate).toISOString(),
        category: formData.category
      })
      toast.showToast('Expense added successfully', 'success')
      setShowAddModal(false)
      refetch()
    } catch (error: any) {
      toast.showToast(error.message || 'Failed to add expense', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedExpense) return
    setIsSubmitting(true)
    try {
      await expenseService.updateExpense(selectedExpense.id, {
        propertyId: parseInt(formData.propertyId),
        description: formData.description,
        amount: parseFloat(formData.amount),
        expenseDate: new Date(formData.expenseDate).toISOString(),
        category: formData.category
      })
      toast.showToast('Expense updated successfully', 'success')
      setShowEditModal(false)
      refetch()
    } catch (error: any) {
      toast.showToast(error.message || 'Failed to update expense', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedExpense) return
    setIsSubmitting(true)
    try {
      await expenseService.deleteExpense(selectedExpense.id)
      toast.showToast('Expense deleted successfully', 'success')
      setShowDeleteModal(false)
      refetch()
    } catch (error: any) {
      toast.showToast(error.message || 'Failed to delete expense', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Header title="Expenses" subtitle="Manage property expenses" />
        <Card>
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="text-gray-600">Loading expenses...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Header title="Expenses" subtitle="Manage property expenses" />
        <Card>
          <CardContent className="p-12">
            <div className="text-center space-y-4">
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-red-800 mb-2">Failed to load expenses</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <Button variant="outline" onClick={refetch}>
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
      <Header title="Expenses" subtitle="Manage property expenses" />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900">${totalExpenses.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{expenses?.length || 0} transactions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-warning-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">${thisMonthTotal.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{thisMonthExpenses.length} expenses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Receipt className="h-8 w-8 text-success-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Expense</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${expenses?.length ? (totalExpenses / expenses.length).toFixed(0) : 0}
                </p>
                <p className="text-xs text-gray-500">Per transaction</p>
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
            
            <Button onClick={handleAdd} className="w-full lg:w-auto">
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
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Property ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      No expenses found
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((expense) => (
                    <tr key={expense.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">
                        {new Date(expense.expenseDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                          {expense.category || 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-900">{expense.description || 'N/A'}</td>
                      <td className="py-3 px-4 text-gray-900 font-medium">${expense.amount}</td>
                      <td className="py-3 px-4 text-gray-600">{expense.propertyId}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleView(expense)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(expense)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(expense)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add New Expense</h3>
            <form onSubmit={handleSubmitAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property ID *</label>
                <Input
                  type="number"
                  value={formData.propertyId}
                  onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                  required
                  placeholder="Enter property ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  placeholder="Enter description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expense Date *</label>
                <Input
                  type="date"
                  value={formData.expenseDate}
                  onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Add Expense'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Expense Modal */}
      {showEditModal && selectedExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Edit Expense</h3>
            <form onSubmit={handleSubmitEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property ID *</label>
                <Input
                  type="number"
                  value={formData.propertyId}
                  onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                  required
                  placeholder="Enter property ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  placeholder="Enter description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expense Date *</label>
                <Input
                  type="date"
                  value={formData.expenseDate}
                  onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button type="button" variant="outline" onClick={() => setShowEditModal(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Update Expense'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Delete Expense</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this expense of ${selectedExpense.amount}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete} disabled={isSubmitting}>
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View Expense Modal */}
      {showViewModal && selectedExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Expense Details</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Expense ID</label>
                <p className="text-gray-900">#{selectedExpense.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Property ID</label>
                <p className="text-gray-900">{selectedExpense.propertyId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-gray-900">{selectedExpense.description || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Amount</label>
                <p className="text-gray-900 text-lg font-semibold">${selectedExpense.amount}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Expense Date</label>
                <p className="text-gray-900">{new Date(selectedExpense.expenseDate).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Category</label>
                <p className="text-gray-900">{selectedExpense.category || 'N/A'}</p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button onClick={() => setShowViewModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
