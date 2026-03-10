'use client'

import { useState } from 'react'
import { CreditCard, Calendar, CheckCircle, AlertCircle, DollarSign } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Header from '@/components/layout/header'
import { formatCurrency, formatDate } from '@/lib/utils'

// Mock data - rental income received by owner
const paymentHistoryData = [
  { id: 1, unit: 'A-12', tenant: 'Jane Smith', type: 'Rent', amount: 150, paidDate: '2024-01-01', status: 'completed' },
  { id: 2, unit: 'B-05', tenant: 'Bob Wilson', type: 'Rent', amount: 200, paidDate: '2024-01-01', status: 'completed' },
  { id: 3, unit: 'C-08', tenant: 'Alice Brown', type: 'Rent', amount: 100, paidDate: '2024-01-01', status: 'completed' },
  { id: 4, unit: 'A-12', tenant: 'Jane Smith', type: 'Rent', amount: 150, paidDate: '2023-12-01', status: 'completed' },
]

const outstandingData = [
  { id: 1, unit: 'A-12', tenant: 'Jane Smith', amount: 0, dueDate: '2024-02-01', status: 'current' },
  { id: 2, unit: 'B-05', tenant: 'Bob Wilson', amount: 0, dueDate: '2024-02-01', status: 'current' },
  { id: 3, unit: 'C-08', tenant: 'Alice Brown', amount: 0, dueDate: '2024-02-01', status: 'current' },
]

export default function OwnerPaymentsPage() {
  const totalCollected = paymentHistoryData.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)
  const totalOutstanding = outstandingData.filter(o => o.amount > 0).reduce((sum, o) => sum + o.amount, 0)

  const handleExportHistory = () => {
    const csv = ['Unit,Tenant,Type,Amount,Date,Status', ...paymentHistoryData.map(p => 
      `${p.unit},${p.tenant},${p.type},${p.amount},${p.paidDate},${p.status}`
    )].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `owner-payment-history-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <Header title="Payment History" subtitle="Track rental income and payments for your units" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month Collected</CardTitle>
              <CheckCircle className="h-4 w-4 text-success-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success-600">{formatCurrency(totalCollected)}</div>
              <p className="text-xs text-muted-foreground">Rent from all units</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
              <AlertCircle className="h-4 w-4 text-warning-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning-600">{formatCurrency(totalOutstanding)}</div>
              <p className="text-xs text-muted-foreground">Overdue amounts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Rent Due</CardTitle>
              <Calendar className="h-4 w-4 text-primary-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-600">Feb 1</div>
              <p className="text-xs text-muted-foreground">Monthly rent cycle</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Rental income received from tenants</CardDescription>
            <Button variant="outline" size="sm" onClick={handleExportHistory} className="ml-auto">
              <DollarSign className="h-4 w-4 mr-1" />
              Export CSV
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentHistoryData.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-success-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-success-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Unit {payment.unit} – {payment.tenant}</h3>
                      <p className="text-xs text-gray-500">Paid {formatDate(payment.paidDate)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-success-600">{formatCurrency(payment.amount)}</p>
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Outstanding by Unit</CardTitle>
            <CardDescription>Units with pending or overdue rent</CardDescription>
          </CardHeader>
          <CardContent>
            {outstandingData.filter(o => o.amount > 0).length === 0 ? (
              <p className="text-gray-500 text-center py-6">All units are current. No outstanding rent.</p>
            ) : (
              <div className="space-y-4">
                {outstandingData.filter(o => o.amount > 0).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="text-sm font-medium">Unit {item.unit} – {item.tenant}</h3>
                      <p className="text-xs text-gray-500">Due {formatDate(item.dueDate)}</p>
                    </div>
                    <p className="text-sm font-semibold text-warning-600">{formatCurrency(item.amount)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
