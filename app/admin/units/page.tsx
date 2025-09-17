'use client'

import { useState } from 'react'
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  Home,
  AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Header from '@/components/layout/header'

// Mock data for units
const units = [
  {
    id: 1,
    block: 'A',
    unitNumber: 'A-01',
    size: '2BR',
    owner: 'John Doe',
    tenant: 'Jane Smith',
    status: 'occupied',
    rentAmount: 150,
    lastPayment: '2024-01-01',
    nextDue: '2024-02-01'
  },
  {
    id: 2,
    block: 'A',
    unitNumber: 'A-02',
    size: '3BR',
    owner: 'Alice Johnson',
    tenant: null,
    status: 'vacant',
    rentAmount: 200,
    lastPayment: null,
    nextDue: null
  },
  {
    id: 3,
    block: 'B',
    unitNumber: 'B-01',
    size: '1BR',
    owner: 'Bob Wilson',
    tenant: 'Mike Davis',
    status: 'occupied',
    rentAmount: 120,
    lastPayment: '2024-01-15',
    nextDue: '2024-02-15'
  },
  {
    id: 4,
    block: 'B',
    unitNumber: 'B-02',
    size: '2BR',
    owner: 'Carol Brown',
    tenant: 'Sarah Lee',
    status: 'occupied',
    rentAmount: 180,
    lastPayment: '2024-01-10',
    nextDue: '2024-02-10'
  },
  {
    id: 5,
    block: 'C',
    unitNumber: 'C-01',
    size: '3BR',
    owner: 'David Miller',
    tenant: null,
    status: 'maintenance',
    rentAmount: 220,
    lastPayment: null,
    nextDue: null
  }
]

const statusColors = {
  occupied: 'bg-success-100 text-success-800',
  vacant: 'bg-gray-100 text-gray-800',
  maintenance: 'bg-warning-100 text-warning-800'
}

export default function AdminUnits() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredUnits = units.filter(unit => {
    const matchesSearch = unit.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         unit.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (unit.tenant && unit.tenant.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesFilter = filterStatus === 'all' || unit.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: units.length,
    occupied: units.filter(u => u.status === 'occupied').length,
    vacant: units.filter(u => u.status === 'vacant').length,
    maintenance: units.filter(u => u.status === 'maintenance').length
  }

  return (
    <div className="space-y-6">
      <Header 
        title="Units Management" 
        subtitle="Manage all units, owners, and tenants"
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
              <Users className="h-8 w-8 text-warning-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Maintenance</p>
                <p className="text-2xl font-bold text-gray-900">{stats.maintenance}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search units, owners, or tenants..."
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
            
            <Button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Unit
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Units Table */}
      <Card>
        <CardHeader>
          <CardTitle>Units ({filteredUnits.length})</CardTitle>
          <CardDescription>
            Manage all units in the complex
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Unit</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Size</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Owner</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Tenant</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Rent</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Last Payment</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUnits.map((unit) => (
                  <tr key={unit.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{unit.unitNumber}</div>
                      <div className="text-sm text-gray-500">Block {unit.block}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-900">{unit.size}</td>
                    <td className="py-3 px-4 text-gray-900">{unit.owner}</td>
                    <td className="py-3 px-4 text-gray-900">
                      {unit.tenant || <span className="text-gray-400">No tenant</span>}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[unit.status as keyof typeof statusColors]}`}>
                        {unit.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-900">${unit.rentAmount}</td>
                    <td className="py-3 px-4 text-gray-900">
                      {unit.lastPayment ? new Date(unit.lastPayment).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
