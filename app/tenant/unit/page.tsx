'use client'

import { useState } from 'react'
import { 
  Building2, 
  Calendar,
  DollarSign,
  Users,
  Phone,
  Mail,
  MapPin,
  Key,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Wrench
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Header from '@/components/layout/header'

// Mock data for tenant's unit
const unitData = {
  unitNumber: 'B-05',
  block: 'B',
  size: '2BR',
  floor: 'Ground Floor',
  rentAmount: 150,
  deposit: 300,
  leaseStart: '2023-01-01',
  leaseEnd: '2024-12-31',
  leaseDuration: '24 months',
  nextRentDue: '2024-02-01',
  balance: 0,
  lastPayment: '2024-01-01',
  paymentMethod: 'EcoCash',
  landlord: {
    name: 'John Doe',
    phone: '+263 77 123 4567',
    email: 'john.doe@email.com',
    address: '123 Landlord Street, Harare'
  },
  amenities: [
    'Parking Space',
    'Balcony',
    'Air Conditioning',
    'Furnished',
    'Security Guard',
    'Garden Access'
  ],
  rules: [
    'No pets allowed',
    'No smoking inside',
    'Quiet hours: 10 PM - 7 AM',
    'No modifications without permission',
    'Visitors must be registered'
  ]
}

const recentPayments = [
  { id: 1, type: 'Rent', amount: 150, date: '2024-01-01', status: 'completed', method: 'EcoCash' },
  { id: 2, type: 'Security', amount: 25, date: '2024-01-01', status: 'completed', method: 'EcoCash' },
  { id: 3, type: 'Bin Collection', amount: 30, date: '2024-01-01', status: 'completed', method: 'EcoCash' },
]

const upcomingPayments = [
  { type: 'Rent', amount: 150, dueDate: '2024-02-01', status: 'pending' },
  { type: 'Security', amount: 25, dueDate: '2024-02-01', status: 'pending' },
  { type: 'Bin Collection', amount: 30, dueDate: '2024-02-01', status: 'pending' },
]

const maintenanceHistory = [
  { id: 1, issue: 'Leaky faucet', status: 'completed', date: '2024-01-10', cost: 0 },
  { id: 2, issue: 'Light bulb replacement', status: 'completed', date: '2024-01-05', cost: 0 },
  { id: 3, issue: 'Door lock repair', status: 'in-progress', date: '2024-01-15', cost: 0 },
]

const getDaysUntilDue = (dueDate: string) => {
  const today = new Date()
  const due = new Date(dueDate)
  const diffTime = due.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function TenantUnit() {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Building2 },
    { id: 'payments', name: 'Payments', icon: DollarSign },
    { id: 'maintenance', name: 'Maintenance', icon: Wrench },
    { id: 'documents', name: 'Documents', icon: FileText },
  ]

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Unit Information */}
      <Card>
        <CardHeader>
          <CardTitle>Unit Information</CardTitle>
          <CardDescription>Details about your rental unit</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{unitData.unitNumber}</h3>
                <p className="text-gray-600">Block {unitData.block} • {unitData.size} • {unitData.floor}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Rent:</span>
                  <span className="font-semibold">${unitData.rentAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Security Deposit:</span>
                  <span className="font-semibold">${unitData.deposit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lease Duration:</span>
                  <span className="font-semibold">{unitData.leaseDuration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lease End:</span>
                  <span className="font-semibold">{formatDate(unitData.leaseEnd)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Amenities</h4>
              <div className="grid grid-cols-2 gap-2">
                {unitData.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-success-500 mr-2" />
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Landlord Information */}
      <Card>
        <CardHeader>
          <CardTitle>Landlord Information</CardTitle>
          <CardDescription>Contact details for your landlord</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Users className="h-5 w-5 mr-3" />
                <span className="font-medium">{unitData.landlord.name}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="h-5 w-5 mr-3" />
                <span>{unitData.landlord.phone}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Mail className="h-5 w-5 mr-3" />
                <span>{unitData.landlord.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-3" />
                <span>{unitData.landlord.address}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Button className="w-full">
                <Phone className="h-4 w-4 mr-2" />
                Call Landlord
              </Button>
              <Button variant="outline" className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* House Rules */}
      <Card>
        <CardHeader>
          <CardTitle>House Rules</CardTitle>
          <CardDescription>Important rules and guidelines for your unit</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {unitData.rules.map((rule, index) => (
              <div key={index} className="flex items-start text-sm text-gray-700">
                <AlertCircle className="h-4 w-4 text-warning-500 mr-2 mt-0.5 flex-shrink-0" />
                {rule}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderPayments = () => (
    <div className="space-y-6">
      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-success-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Balance</p>
                <p className="text-2xl font-bold text-gray-900">${unitData.balance}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-warning-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Next Due</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getDaysUntilDue(unitData.nextRentDue)} days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Last Payment</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatDate(unitData.lastPayment)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Payments</CardTitle>
          <CardDescription>Your next payment obligations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingPayments.map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-warning-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{payment.type}</p>
                  <p className="text-sm text-gray-600">Due: {formatDate(payment.dueDate)}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">${payment.amount}</p>
                  <Button size="sm" className="mt-2">
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
          <CardDescription>Your recent payment records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-success-500" />
                  <div>
                    <p className="font-medium text-gray-900">{payment.type}</p>
                    <p className="text-sm text-gray-600">{payment.method} • {formatDate(payment.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${payment.amount}</p>
                  <p className="text-sm text-success-600">Completed</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderMaintenance = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Maintenance History</CardTitle>
          <CardDescription>Track maintenance requests and repairs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {maintenanceHistory.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Wrench className="h-5 w-5 text-primary-500" />
                  <div>
                    <p className="font-medium text-gray-900">{item.issue}</p>
                    <p className="text-sm text-gray-600">{formatDate(item.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    item.status === 'completed' ? 'bg-success-100 text-success-800' :
                    item.status === 'in-progress' ? 'bg-warning-100 text-warning-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">Cost: ${item.cost}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Request Maintenance</CardTitle>
          <CardDescription>Report issues or request repairs</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full">
            <Wrench className="h-4 w-4 mr-2" />
            Submit Maintenance Request
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderDocuments = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Lease Documents</CardTitle>
          <CardDescription>Important documents related to your tenancy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-primary-500" />
                <div>
                  <p className="font-medium text-gray-900">Lease Agreement</p>
                  <p className="text-sm text-gray-600">Signed on {formatDate(unitData.leaseStart)}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Download
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-primary-500" />
                <div>
                  <p className="font-medium text-gray-900">House Rules</p>
                  <p className="text-sm text-gray-600">Updated January 2024</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Download
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-primary-500" />
                <div>
                  <p className="font-medium text-gray-900">Payment Receipts</p>
                  <p className="text-sm text-gray-600">Last 12 months</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview()
      case 'payments':
        return renderPayments()
      case 'maintenance':
        return renderMaintenance()
      case 'documents':
        return renderDocuments()
      default:
        return renderOverview()
    }
  }

  return (
    <div className="space-y-6">
      <Header 
        title="My Unit" 
        subtitle="Manage your rental unit and tenancy details"
      />
      
      {/* Tabs */}
      <Card>
        <CardContent className="p-0">
          <div className="flex flex-wrap border-b">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  )
}
