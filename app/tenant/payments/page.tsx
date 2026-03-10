'use client'

import { useState } from 'react'
import { CreditCard, Calendar, CheckCircle, Clock, AlertCircle, QrCode, FileText } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Header from '@/components/layout/header'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useToast } from '@/lib/hooks/useToast'

// Mock data
const paymentHistoryData = [
  {
    id: 1,
    type: 'Rent',
    amount: 150,
    dueDate: '2024-01-01',
    paidDate: '2024-01-01',
    method: 'EcoCash',
    status: 'completed',
    reference: 'EC001234567'
  },
  {
    id: 2,
    type: 'Security',
    amount: 25,
    dueDate: '2024-01-01',
    paidDate: '2024-01-01',
    method: 'EcoCash',
    status: 'completed',
    reference: 'EC001234568'
  },
  {
    id: 3,
    type: 'Bin Collection',
    amount: 30,
    dueDate: '2024-01-01',
    paidDate: '2024-01-01',
    method: 'Bank Transfer',
    status: 'completed',
    reference: 'BT987654321'
  },
  {
    id: 4,
    type: 'Borehole',
    amount: 20,
    dueDate: '2024-01-01',
    paidDate: '2024-01-01',
    method: 'EcoCash',
    status: 'completed',
    reference: 'EC001234569'
  }
]

const upcomingPaymentsData = [
  {
    id: 1,
    type: 'Rent',
    amount: 150,
    dueDate: '2024-02-01',
    status: 'pending',
    description: 'Monthly rent payment'
  },
  {
    id: 2,
    type: 'Security',
    amount: 25,
    dueDate: '2024-02-01',
    status: 'pending',
    description: 'Security services contribution'
  },
  {
    id: 3,
    type: 'Bin Collection',
    amount: 30,
    dueDate: '2024-02-01',
    status: 'pending',
    description: 'Waste collection services'
  },
  {
    id: 4,
    type: 'Borehole',
    amount: 20,
    dueDate: '2024-02-01',
    status: 'pending',
    description: 'Water supply maintenance'
  }
]

const paymentMethods = [
  { id: 'ecocash', name: 'EcoCash', icon: '📱', description: 'Mobile money payment' },
  { id: 'bank', name: 'Bank Transfer', icon: '🏦', description: 'Direct bank transfer' },
  { id: 'paypal', name: 'PayPal', icon: '💳', description: 'Online payment' },
  { id: 'cash', name: 'Cash', icon: '💵', description: 'Physical cash payment' }
]

export default function TenantPaymentsPage() {
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [selectedMethod, setSelectedMethod] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const { info, success } = useToast()

  const totalDue = upcomingPaymentsData.reduce((sum, payment) => sum + payment.amount, 0)
  const totalPaid = paymentHistoryData.reduce((sum, payment) => sum + payment.amount, 0)

  const handlePayNow = (payment: any) => {
    setSelectedPayment(payment)
    setShowPaymentModal(true)
  }

  const handlePayAll = () => {
    setSelectedPayment({ type: 'All Payments', amount: totalDue })
    setShowPaymentModal(true)
  }

  const handleConfirmPayment = () => {
    setShowPaymentModal(false)
    success(`Payment for ${selectedPayment?.type} submitted successfully!`)
  }

  const handleAction = (title: string) => {
    info(`Action Triggered: ${title}. Feature simulated.`)
  }

  return (
    <div>
      <Header
        title="Payment Center"
        subtitle="Manage your rent and service payments"
      />

      <div className="p-6 space-y-6">
        {/* Payment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Due</CardTitle>
              <AlertCircle className="h-4 w-4 text-warning-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning-600">{formatCurrency(totalDue)}</div>
              <p className="text-xs text-muted-foreground">Next payment due Feb 1</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
              <CheckCircle className="h-4 w-4 text-success-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success-600">{formatCurrency(totalPaid)}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payment Status</CardTitle>
              <Clock className="h-4 w-4 text-primary-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-600">Current</div>
              <p className="text-xs text-muted-foreground">All payments up to date</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Make payments quickly and easily</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handlePayAll} className="flex-1 h-12">
                <CreditCard className="h-5 w-5 mr-2" />
                Pay All Due ({formatCurrency(totalDue)})
              </Button>
              <Button onClick={() => handleAction('Auto-Pay Setup')} variant="outline" className="flex-1 h-12">
                <Calendar className="h-5 w-5 mr-2" />
                Set Up Auto-Pay
              </Button>
              <Button onClick={() => handleAction('QR Generation')} variant="outline" className="flex-1 h-12">
                <QrCode className="h-5 w-5 mr-2" />
                Generate Payment QR
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Payments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Payments</CardTitle>
            <CardDescription>Your next payment obligations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingPaymentsData.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{payment.type}</h3>
                        <p className="text-xs text-gray-500">{payment.description}</p>
                        <p className="text-xs text-gray-400">Due {formatDate(payment.dueDate)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(payment.amount)}</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
                        Pending
                      </span>
                    </div>
                    <Button onClick={() => handlePayNow(payment)} size="sm">
                      Pay Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Your completed payment transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentHistoryData.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-success-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-success-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{payment.type}</h3>
                      <p className="text-xs text-gray-500">Paid {formatDate(payment.paidDate)}</p>
                      <p className="text-xs text-gray-400">Ref: {payment.reference}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-success-600">{formatCurrency(payment.amount)}</p>
                    <p className="text-xs text-gray-500">{payment.method}</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">
                Pay {selectedPayment?.type} - {formatCurrency(selectedPayment?.amount)}
              </h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    value={formatCurrency(selectedPayment?.amount)}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div>
                  <Label>Payment Method</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`p-3 border rounded-lg text-left hover:bg-gray-50 ${selectedMethod === method.id ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
                          }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{method.icon}</span>
                          <div>
                            <p className="text-sm font-medium">{method.name}</p>
                            <p className="text-xs text-gray-500">{method.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedMethod && (
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="text-sm font-medium text-primary-900 mb-2">Payment Instructions</h4>
                    <p className="text-xs text-primary-700">
                      {selectedMethod === 'ecocash' && 'Send payment to +263 77 123 4567 with reference: FCMS-001'}
                      {selectedMethod === 'bank' && 'Transfer to Account: 1234567890, Reference: FCMS-001'}
                      {selectedMethod === 'paypal' && 'Pay to: payments@fcms.com, Reference: FCMS-001'}
                      {selectedMethod === 'cash' && 'Visit the management office to make cash payment'}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmPayment}
                  disabled={!selectedMethod}
                >
                  Confirm Payment
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
