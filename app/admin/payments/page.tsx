'use client'

import { useState } from 'react'
import { Search, Filter, Download, Eye, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Header from '@/components/layout/header'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils'

// Mock data
const payments = [
  {
    id: 1,
    resident: 'John Doe',
    unit: 'A-12',
    type: 'rent',
    amount: 150,
    method: 'EcoCash',
    status: 'completed',
    date: '2024-01-15T10:30:00Z',
    reference: 'EC001234567'
  },
  {
    id: 2,
    resident: 'Jane Smith',
    unit: 'B-05',
    type: 'levy',
    amount: 75,
    method: 'Bank Transfer',
    status: 'pending',
    date: '2024-01-14T15:45:00Z',
    reference: 'BT987654321'
  },
  {
    id: 3,
    resident: 'Bob Wilson',
    unit: 'C-08',
    type: 'security',
    amount: 25,
    method: 'EcoCash',
    status: 'failed',
    date: '2024-01-13T09:15:00Z',
    reference: 'EC001234568'
  },
  {
    id: 4,
    resident: 'Alice Brown',
    unit: 'A-15',
    type: 'rent',
    amount: 200,
    method: 'PayPal',
    status: 'completed',
    date: '2024-01-12T14:20:00Z',
    reference: 'PP123456789'
  },
  {
    id: 5,
    resident: 'Charlie Davis',
    unit: 'B-12',
    type: 'bin collection',
    amount: 30,
    method: 'EcoCash',
    status: 'overdue',
    date: '2024-01-10T11:00:00Z',
    reference: 'EC001234569'
  }
]

const paymentTypes = ['all', 'rent', 'levy', 'security', 'bin collection', 'borehole']
const statusOptions = ['all', 'completed', 'pending', 'failed', 'overdue']
const methods = ['all', 'EcoCash', 'Bank Transfer', 'PayPal', 'Cash']

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [methodFilter, setMethodFilter] = useState('all')

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.resident.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.reference.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || payment.type === typeFilter
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter
    
    return matchesSearch && matchesType && matchesStatus && matchesMethod
  })

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)

  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0)

  const overdueAmount = payments
    .filter(p => p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0)

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
              <p className="text-xs text-muted-foreground">Completed payments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <Clock className="h-4 w-4 text-warning-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning-600">{formatCurrency(pendingAmount)}</div>
              <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue Amount</CardTitle>
              <XCircle className="h-4 w-4 text-danger-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-danger-600">{formatCurrency(overdueAmount)}</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
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
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search payments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {paymentTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
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
                      Resident
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
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
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{payment.resident}</div>
                          <div className="text-sm text-gray-500">Unit {payment.unit}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.method}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(payment.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {payment.status === 'pending' && (
                            <Button variant="ghost" size="sm" className="text-success-600 hover:text-success-700">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          {payment.status === 'failed' && (
                            <Button variant="ghost" size="sm" className="text-danger-600 hover:text-danger-700">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
