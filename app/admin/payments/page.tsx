'use client'

import { useState } from 'react'
import { Search, Filter, Download, Eye, CheckCircle, XCircle, Clock, Edit, Trash2, Plus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Header from '@/components/layout/header'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils'
import { useApi } from '@/lib/hooks/useApi'
import { useToast } from '@/lib/hooks/useToast'
import { paymentService } from '@/lib/services/api.service'
import type { PaymentDto } from '@/lib/types/api'

const methods = ['all', 'EcoCash', 'Bank Transfer', 'PayPal', 'Cash', 'Credit Card', 'Debit Card']

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [methodFilter, setMethodFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<PaymentDto | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    tenantId: '',
    ownerId: '',
    unitId: '',
    amount: '',
    paymentDate: '',
    method: '',
    reference: ''
  })

  const { data: payments, loading, error, refetch } = useApi<PaymentDto[]>(
    () => paymentService.getPayments()
  )
  const toast = useToast()

  const filteredPayments = (payments || []).filter(payment => {
    const matchesSearch = payment.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toString().includes(searchTerm) ||
                         payment.unitId.toString().includes(searchTerm)
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter
    
    return matchesSearch && matchesMethod
  })

  const totalRevenue = (payments || []).reduce((sum, p) => sum + (p.amount || 0), 0)
  const recentPayments = (payments || []).filter(p => {
    const paymentDate = new Date(p.paymentDate)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return paymentDate >= thirtyDaysAgo
  })
  const recentAmount = recentPayments.reduce((sum, p) => sum + (p.amount || 0), 0)

  const handleAdd = () => {
    setFormData({
      tenantId: '',
      ownerId: '',
      unitId: '',
      amount: '',
      paymentDate: new Date().toISOString().split('T')[0],
      method: '',
      reference: ''
    })
    setShowAddModal(true)
  }

  const handleEdit = (payment: PaymentDto) => {
    setSelectedPayment(payment)
    setFormData({
      tenantId: payment.tenantId?.toString() || '',
      ownerId: payment.ownerId?.toString() || '',
      unitId: payment.unitId.toString(),
      amount: payment.amount.toString(),
      paymentDate: payment.paymentDate.split('T')[0],
      method: payment.method || '',
      reference: payment.reference || ''
    })
    setShowEditModal(true)
  }

  const handleDelete = (payment: PaymentDto) => {
    setSelectedPayment(payment)
    setShowDeleteModal(true)
  }

  const handleView = (payment: PaymentDto) => {
    setSelectedPayment(payment)
    setShowViewModal(true)
  }

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await paymentService.createPayment({
        tenantId: formData.tenantId ? parseInt(formData.tenantId) : null,
        ownerId: formData.ownerId ? parseInt(formData.ownerId) : null,
        unitId: parseInt(formData.unitId),
        amount: parseFloat(formData.amount),
        paymentDate: new Date(formData.paymentDate).toISOString(),
        method: formData.method,
        reference: formData.reference
      })
      toast.showToast('Payment added successfully', 'success')
      setShowAddModal(false)
      refetch()
    } catch (error: any) {
      toast.showToast(error.message || 'Failed to add payment', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPayment) return
    setIsSubmitting(true)
    try {
      await paymentService.updatePayment(selectedPayment.id, {
        tenantId: formData.tenantId ? parseInt(formData.tenantId) : null,
        ownerId: formData.ownerId ? parseInt(formData.ownerId) : null,
        unitId: parseInt(formData.unitId),
        amount: parseFloat(formData.amount),
        paymentDate: new Date(formData.paymentDate).toISOString(),
        method: formData.method,
        reference: formData.reference
      })
      toast.showToast('Payment updated successfully', 'success')
      setShowEditModal(false)
      refetch()
    } catch (error: any) {
      toast.showToast(error.message || 'Failed to update payment', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedPayment) return
    setIsSubmitting(true)
    try {
      await paymentService.deletePayment(selectedPayment.id)
      toast.showToast('Payment deleted successfully', 'success')
      setShowDeleteModal(false)
      refetch()
    } catch (error: any) {
      toast.showToast(error.message || 'Failed to delete payment', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div>
        <Header 
          title="Payment Management" 
          subtitle="Track and manage all payment transactions"
        />
        <div className="p-6">
          <Card>
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                <p className="text-gray-600">Loading payments...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <Header 
          title="Payment Management" 
          subtitle="Track and manage all payment transactions"
        />
        <div className="p-6">
          <Card>
            <CardContent className="p-12">
              <div className="text-center space-y-4">
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8">
                  <h3 className="text-2xl font-bold text-red-800 mb-2">Failed to load payments</h3>
                  <p className="text-red-700 mb-4">{error}</p>
                  <Button variant="outline" onClick={refetch}>
                    Retry
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header 
        title="Payment Management" 
        subtitle="Track and manage all payment transactions"
      />
      
      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <CheckCircle className="h-4 w-4 text-success-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success-600">{formatCurrency(totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">{payments?.length || 0} total payments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Payments (30d)</CardTitle>
              <Clock className="h-4 w-4 text-primary-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-600">{formatCurrency(recentAmount)}</div>
              <p className="text-xs text-muted-foreground">{recentPayments.length} payments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Payment</CardTitle>
              <XCircle className="h-4 w-4 text-warning-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning-600">
                {formatCurrency(payments?.length ? totalRevenue / payments.length : 0)}
              </div>
              <p className="text-xs text-muted-foreground">Per transaction</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <CardTitle>Payment Transactions</CardTitle>
                <CardDescription>View and manage all payment records</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleAdd}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by ID, unit, or reference..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {methods.map(method => (
                  <option key={method} value={method}>
                    {method === 'all' ? 'All Methods' : method}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reference
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        No payments found
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">#{payment.id}</div>
                          {payment.tenantId && (
                            <div className="text-xs text-gray-500">Tenant: {payment.tenantId}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            Unit {payment.unitId}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.method || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.reference || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(payment.paymentDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleView(payment)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(payment)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(payment)}>
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
      </div>

      {/* Add Payment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add New Payment</h3>
            <form onSubmit={handleSubmitAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit ID *</label>
                <Input
                  type="number"
                  value={formData.unitId}
                  onChange={(e) => setFormData({ ...formData, unitId: e.target.value })}
                  required
                  placeholder="Enter unit ID"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Date *</label>
                <Input
                  type="date"
                  value={formData.paymentDate}
                  onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <select
                  value={formData.method}
                  onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select method</option>
                  {methods.filter(m => m !== 'all').map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reference Number</label>
                <Input
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  placeholder="Enter reference number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tenant ID</label>
                <Input
                  type="number"
                  value={formData.tenantId}
                  onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                  placeholder="Enter tenant ID (optional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Owner ID</label>
                <Input
                  type="number"
                  value={formData.ownerId}
                  onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
                  placeholder="Enter owner ID (optional)"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Add Payment'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Payment Modal */}
      {showEditModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Edit Payment</h3>
            <form onSubmit={handleSubmitEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit ID *</label>
                <Input
                  type="number"
                  value={formData.unitId}
                  onChange={(e) => setFormData({ ...formData, unitId: e.target.value })}
                  required
                  placeholder="Enter unit ID"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Date *</label>
                <Input
                  type="date"
                  value={formData.paymentDate}
                  onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <select
                  value={formData.method}
                  onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select method</option>
                  {methods.filter(m => m !== 'all').map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reference Number</label>
                <Input
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  placeholder="Enter reference number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tenant ID</label>
                <Input
                  type="number"
                  value={formData.tenantId}
                  onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                  placeholder="Enter tenant ID (optional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Owner ID</label>
                <Input
                  type="number"
                  value={formData.ownerId}
                  onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
                  placeholder="Enter owner ID (optional)"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button type="button" variant="outline" onClick={() => setShowEditModal(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Update Payment'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Delete Payment</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete payment #{selectedPayment.id} of {formatCurrency(selectedPayment.amount)}? This action cannot be undone.
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

      {/* View Payment Modal */}
      {showViewModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Payment ID</label>
                <p className="text-gray-900">#{selectedPayment.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Unit ID</label>
                <p className="text-gray-900">{selectedPayment.unitId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Amount</label>
                <p className="text-gray-900 text-lg font-semibold">{formatCurrency(selectedPayment.amount)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Payment Date</label>
                <p className="text-gray-900">{formatDate(selectedPayment.paymentDate)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Method</label>
                <p className="text-gray-900">{selectedPayment.method || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Reference</label>
                <p className="text-gray-900">{selectedPayment.reference || 'N/A'}</p>
              </div>
              {selectedPayment.tenantId && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Tenant ID</label>
                  <p className="text-gray-900">{selectedPayment.tenantId}</p>
                </div>
              )}
              {selectedPayment.ownerId && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Owner ID</label>
                  <p className="text-gray-900">{selectedPayment.ownerId}</p>
                </div>
              )}
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
