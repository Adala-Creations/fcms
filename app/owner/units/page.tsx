'use client'

import { useState } from 'react'
import { 
  Building2, 
  Search, 
  Filter, 
  Eye,
  Users,
  Home,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Calendar,
  Phone,
  Mail
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Header from '@/components/layout/header'

// Mock data for owner's units
const units = [
  {
    id: 1,
    block: 'A',
    unitNumber: 'A-01',
    size: '2BR',
    tenant: {
      name: 'Jane Smith',
      phone: '+263 77 123 4567',
      email: 'jane.smith@email.com',
      leaseStart: '2023-01-01',
      leaseEnd: '2024-12-31',
      rentAmount: 150,
      deposit: 300
    },
    status: 'occupied',
    lastPayment: '2024-01-01',
    nextDue: '2024-02-01',
    balance: 0,
    totalRent: 150,
    maintenance: 'Good',
    lastInspection: '2024-01-10'
  },
  {
    id: 2,
    block: 'A',
    unitNumber: 'A-02',
    size: '3BR',
    tenant: null,
    status: 'vacant',
    lastPayment: null,
    nextDue: null,
    balance: 0,
    totalRent: 200,
    maintenance: 'Excellent',
    lastInspection: '2024-01-05'
  },
  {
    id: 3,
    block: 'B',
    unitNumber: 'B-01',
    size: '1BR',
    tenant: {
      name: 'Mike Davis',
      phone: '+263 77 234 5678',
      email: 'mike.davis@email.com',
      leaseStart: '2023-06-01',
      leaseEnd: '2024-05-31',
      rentAmount: 120,
      deposit: 240
    },
    status: 'occupied',
    lastPayment: '2024-01-15',
    nextDue: '2024-02-15',
    balance: 0,
    totalRent: 120,
    maintenance: 'Fair',
    lastInspection: '2024-01-08'
  }
]

const statusColors = {
  occupied: 'bg-success-100 text-success-800',
  vacant: 'bg-gray-100 text-gray-800',
  maintenance: 'bg-warning-100 text-warning-800'
}

const maintenanceColors = {
  Excellent: 'bg-success-100 text-success-800',
  Good: 'bg-primary-100 text-primary-800',
  Fair: 'bg-warning-100 text-warning-800',
  Poor: 'bg-danger-100 text-danger-800'
}

export default function OwnerUnits() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [detailUnit, setDetailUnit] = useState<typeof units[0] | null>(null)

  const filteredUnits = units.filter(unit => {
    const matchesSearch = unit.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (unit.tenant && unit.tenant.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesFilter = filterStatus === 'all' || unit.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: units.length,
    occupied: units.filter(u => u.status === 'occupied').length,
    vacant: units.filter(u => u.status === 'vacant').length,
    totalRent: units.reduce((sum, u) => sum + u.totalRent, 0),
    collectedRent: units.filter(u => u.status === 'occupied').reduce((sum, u) => sum + u.totalRent, 0)
  }

  return (
    <div className="space-y-6">
      <Header 
        title="My Units" 
        subtitle="Manage your rental properties and tenants"
      />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Units</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-success-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Occupied</p>
                <p className="text-2xl font-bold text-gray-900">{stats.occupied}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-gray-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Vacant</p>
                <p className="text-2xl font-bold text-gray-900">{stats.vacant}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-warning-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monthly Rent</p>
                <p className="text-2xl font-bold text-gray-900">${stats.collectedRent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search units or tenants..."
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
                <option value="occupied">Occupied</option>
                <option value="vacant">Vacant</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Units Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUnits.map((unit) => (
          <Card key={unit.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{unit.unitNumber}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <span className="mr-2">Block {unit.block} • {unit.size}</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[unit.status as keyof typeof statusColors]}`}>
                      {unit.status}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${maintenanceColors[unit.maintenance as keyof typeof maintenanceColors]}`}>
                    {unit.maintenance}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Tenant Information */}
                {unit.tenant ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Current Tenant</h4>
                      <span className="text-sm text-gray-500">Rent: ${unit.totalRent}/month</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        {unit.tenant.name}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {unit.tenant.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {unit.tenant.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        Lease: {new Date(unit.tenant.leaseStart).toLocaleDateString()} - {new Date(unit.tenant.leaseEnd).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Home className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No tenant</p>
                    <p className="text-sm text-gray-400">Unit is vacant</p>
                  </div>
                )}

                {/* Payment Information */}
                {unit.tenant && (
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last Payment:</span>
                      <span className="font-medium">
                        {unit.lastPayment ? new Date(unit.lastPayment).toLocaleDateString() : 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Next Due:</span>
                      <span className="font-medium">
                        {unit.nextDue ? new Date(unit.nextDue).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Balance:</span>
                      <span className={`font-medium ${unit.balance > 0 ? 'text-danger-600' : 'text-success-600'}`}>
                        ${unit.balance}
                      </span>
                    </div>
                  </div>
                )}

                {/* Maintenance Information */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Maintenance Status:</span>
                    <span className={`font-medium ${maintenanceColors[unit.maintenance as keyof typeof maintenanceColors]}`}>
                      {unit.maintenance}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Inspection:</span>
                    <span className="font-medium">
                      {new Date(unit.lastInspection).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => setDetailUnit(unit)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    {unit.tenant && (
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => setDetailUnit(unit)}>
                        <Users className="h-4 w-4 mr-1" />
                        Manage Tenant
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {detailUnit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setDetailUnit(null)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Unit {detailUnit.unitNumber} – Details</h3>
            <div className="space-y-3 text-sm">
              <p><span className="text-gray-600">Block:</span> {detailUnit.block} • Size: {detailUnit.size}</p>
              <p><span className="text-gray-600">Status:</span> {detailUnit.status}</p>
              <p><span className="text-gray-600">Total Rent:</span> ${detailUnit.totalRent}/month</p>
              {detailUnit.tenant ? (
                <>
                  <p><span className="text-gray-600">Tenant:</span> {detailUnit.tenant.name}</p>
                  <p><span className="text-gray-600">Phone:</span> {detailUnit.tenant.phone}</p>
                  <p><span className="text-gray-600">Email:</span> {detailUnit.tenant.email}</p>
                  <p><span className="text-gray-600">Lease:</span> {new Date(detailUnit.tenant.leaseStart).toLocaleDateString()} – {new Date(detailUnit.tenant.leaseEnd).toLocaleDateString()}</p>
                </>
              ) : (
                <p className="text-gray-500">No tenant – unit is vacant</p>
              )}
              <p><span className="text-gray-600">Maintenance:</span> {detailUnit.maintenance}</p>
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setDetailUnit(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
