'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye, Shield } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Header from '@/components/layout/header'
import { formatDate, getInitials, getStatusColor } from '@/lib/utils'
import { useApi } from '@/lib/hooks/useApi'
import { userService, roleService, authService } from '@/lib/services/api.service'
import type { UserDto } from '@/lib/types/api'
import { EditUserModal, DeleteUserModal, ManageRolesModal } from '@/components/admin/UserCRUDModals'
import { useToast } from '@/lib/hooks/useToast'
import { ToastContainer } from '@/components/ui/toast'

const roleOptions = ['all', 'Admin', 'Owner', 'Tenant', 'ServiceProvider', 'Security', 'Authority']

interface UserWithRoles extends UserDto {
  roles?: string[]
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [usersWithRoles, setUsersWithRoles] = useState<UserWithRoles[]>([])
  const [loadingRoles, setLoadingRoles] = useState(false)
  const [editingUser, setEditingUser] = useState<UserWithRoles | null>(null)
  const [deletingUser, setDeletingUser] = useState<UserWithRoles | null>(null)
  const [managingRolesUser, setManagingRolesUser] = useState<UserWithRoles | null>(null)
  const { toasts, showToast, dismissToast } = useToast()

  // Fetch users from backend
  const { data: users, loading, error, refetch } = useApi(
    () => userService.getUsers(),
    []
  )

  // Fetch roles for each user
  useEffect(() => {
    async function fetchUserRoles() {
      if (!users || users.length === 0) return
      
      setLoadingRoles(true)
      try {
        const usersWithRolesData = await Promise.all(
          users.map(async (user) => {
            try {
              if (user.userName) {
                const roles = await roleService.getUserRoles(user.userName)
                return { ...user, roles }
              }
            } catch (err: any) {
              // 404 means user has no roles assigned yet - this is normal
              if (err?.message?.includes('404')) {
                return { ...user, roles: [] }
              }
              // Log other errors
              console.error(`Failed to fetch roles for ${user.userName}`, err)
            }
            return { ...user, roles: [] }
          })
        )
        setUsersWithRoles(usersWithRolesData)
      } catch (err) {
        console.error('Failed to fetch user roles', err)
        setUsersWithRoles(users.map(u => ({ ...u, roles: [] })))
      } finally {
        setLoadingRoles(false)
      }
    }

    fetchUserRoles()
  }, [users])

  // CRUD handlers
  const handleEditUser = async (userId: string, data: Partial<UserDto>) => {
    try {
      await userService.updateUser(userId, data)
      showToast('User updated successfully', 'success')
      refetch()
    } catch (err) {
      showToast('Failed to update user', 'error')
      throw err
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      await userService.deleteUser(userId)
      showToast('User deleted successfully', 'success')
      refetch()
    } catch (err) {
      showToast('Failed to delete user', 'error')
      throw err
    }
  }

  const handleAddRole = async (username: string, roleName: string) => {
    try {
      await authService.addUserToRole({ username, roleName })
      showToast(`Role ${roleName} added successfully`, 'success')
      refetch()
    } catch (err) {
      showToast('Failed to add role', 'error')
      throw err
    }
  }

  const handleRemoveRole = async (username: string, roleName: string) => {
    try {
      await authService.removeUserFromRole({ username, roleName })
      showToast(`Role ${roleName} removed successfully`, 'success')
      refetch()
    } catch (err) {
      showToast('Failed to remove role', 'error')
      throw err
    }
  }

  const filteredUsers = usersWithRoles.filter(user => {
    const matchesSearch = 
      user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber?.includes(searchTerm)
    
    const matchesRole = roleFilter === 'all' || 
      (user.roles && user.roles.some(r => r === roleFilter))
    
    return matchesSearch && matchesRole
  })

  return (
    <div>
      <Header 
        title="User Management" 
        subtitle="Manage residents, owners, and service providers"
      />
      
      <div className="p-6 space-y-6">
        {/* Filters and Actions */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Manage and monitor all system users</CardDescription>
              </div>
              <Button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  {roleOptions.map(role => (
                    <option key={role} value={role}>
                      {role === 'all' ? 'All Roles' : role}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading users...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">
                Error loading users: {error}
                <Button onClick={refetch} variant="outline" className="ml-4">
                  Retry
                </Button>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No users found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Roles
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        2FA
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-primary-700">
                                  {getInitials(user.userName || 'U')}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.userName || 'N/A'}</div>
                              <div className="text-xs text-gray-500">ID: {user.id || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {loadingRoles ? (
                              <span className="text-xs text-gray-400">Loading...</span>
                            ) : user.roles && user.roles.length > 0 ? (
                              user.roles.map((role, idx) => (
                                <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                  <Shield className="h-3 w-3 mr-1" />
                                  {role}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-gray-400">No roles</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.lockoutEnabled && user.lockoutEnd 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.lockoutEnabled && user.lockoutEnd ? 'Locked Out' : 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email || 'N/A'}</div>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            user.emailConfirmed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {user.emailConfirmed ? '✓' : '?'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.phoneNumber || 'N/A'}</div>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            user.phoneNumberConfirmed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {user.phoneNumberConfirmed ? '✓' : '?'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.twoFactorEnabled ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.twoFactorEnabled ? 'On' : 'Off'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setManagingRolesUser(user)}
                              title="Manage Roles"
                            >
                              <Shield className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setEditingUser(user)}
                              title="Edit User"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-danger-600 hover:text-danger-700"
                              onClick={() => setDeletingUser(user)}
                              title="Delete User"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add User Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">Add New User</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter full name" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter email address" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="Enter phone number" />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <select id="role" className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="owner">Owner</option>
                    <option value="tenant">Tenant</option>
                    <option value="service-provider">Service Provider</option>
                    <option value="security">Security</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="unit">Unit (if applicable)</Label>
                  <Input id="unit" placeholder="e.g., A-12" />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowAddModal(false)}>
                  Add User
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* CRUD Modals */}
        {editingUser && (
          <EditUserModal
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onSave={handleEditUser}
          />
        )}

        {deletingUser && (
          <DeleteUserModal
            user={deletingUser}
            onClose={() => setDeletingUser(null)}
            onConfirm={handleDeleteUser}
          />
        )}

        {managingRolesUser && (
          <ManageRolesModal
            user={managingRolesUser}
            onClose={() => setManagingRolesUser(null)}
            onAddRole={handleAddRole}
            onRemoveRole={handleRemoveRole}
          />
        )}

        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </div>
    </div>
  )
}
