import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Shield } from 'lucide-react'
import type { UserDto, RegisterRequest } from '@/lib/types/api'

// role list is now supplied from the parent so that it matches whatever the
// backend reports rather than being hard-coded.
// (we keep this file free of network calls to make it reusable)

interface EditUserModalProps {
  user: UserDto
  onClose: () => void
  onSave: (userId: string, data: Partial<UserDto>) => Promise<void>
}

export function EditUserModal({ user, onClose, onSave }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    userName: user.userName || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
    emailConfirmed: user.emailConfirmed,
    phoneNumberConfirmed: user.phoneNumberConfirmed,
    twoFactorEnabled: user.twoFactorEnabled,
    lockoutEnabled: user.lockoutEnabled,
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave(user.id || '', formData)
      onClose()
    } catch (err: any) {
      console.error('Failed to update user', err)
      const errorMsg = err?.message?.includes('400')
        ? 'Invalid data. Please check all fields are correct.'
        : 'Failed to update user. Please try again.'
      alert(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit User</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="userName">Username</Label>
            <Input
              id="userName"
              value={formData.userName ?? ''}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email ?? ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber ?? ''}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.emailConfirmed}
                onChange={(e) => setFormData({ ...formData, emailConfirmed: e.target.checked })}
              />
              <span className="text-sm">Email Confirmed</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.phoneNumberConfirmed}
                onChange={(e) => setFormData({ ...formData, phoneNumberConfirmed: e.target.checked })}
              />
              <span className="text-sm">Phone Confirmed</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.twoFactorEnabled}
                onChange={(e) => setFormData({ ...formData, twoFactorEnabled: e.target.checked })}
              />
              <span className="text-sm">Two-Factor Enabled</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.lockoutEnabled}
                onChange={(e) => setFormData({ ...formData, lockoutEnabled: e.target.checked })}
              />
              <span className="text-sm">Lockout Enabled</span>
            </label>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface DeleteUserModalProps {
  user: UserDto
  onClose: () => void
  onConfirm: (userId: string) => Promise<void>
}

export function DeleteUserModal({ user, onClose, onConfirm }: DeleteUserModalProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await onConfirm(user.id || '')
      onClose()
    } catch (err) {
      console.error('Failed to delete user', err)
      alert('Failed to delete user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Delete User</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete user <strong>{user.userName}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? 'Deleting...' : 'Delete User'}
          </Button>
        </div>
      </div>
    </div>
  )
}

interface ManageRolesModalProps {
  user: UserDto & { roles?: string[] }
  /** list of all possible role names (including 'all' if you want it) */
  allRoles: string[]
  onClose: () => void
  onAddRole: (username: string, role: string) => Promise<void>
  onRemoveRole: (username: string, role: string) => Promise<void>
}

export function ManageRolesModal({ user, allRoles, onClose, onAddRole, onRemoveRole }: ManageRolesModalProps) {
  const [selectedRole, setSelectedRole] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAddRole = async () => {
    if (!selectedRole || !user.userName) return

    setLoading(true)
    try {
      await onAddRole(user.userName, selectedRole)
      setSelectedRole('')
    } catch (err: any) {
      console.error('Failed to add role', err)
      const errorMsg = err?.message?.includes('403')
        ? 'Permission denied. Only Admin users can assign roles.'
        : 'Failed to add role. Please try again.'
      alert(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveRole = async (role: string) => {
    if (!user.userName) return

    setLoading(true)
    try {
      await onRemoveRole(user.userName, role)
    } catch (err: any) {
      console.error('Failed to remove role', err)
      const errorMsg = err?.message?.includes('403')
        ? 'Permission denied. Only Admin users can remove roles.'
        : 'Failed to remove role. Please try again.'
      alert(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  // filter out whatever roles the user already has
  const availableRoles = allRoles.filter(role => !user.roles?.includes(role))

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Manage Roles - {user.userName}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Current Roles</Label>
            <div className="space-y-2">
              {user.roles && user.roles.length > 0 ? (
                user.roles.map((role) => (
                  <div key={role} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-purple-600" />
                      {role}
                    </span>
                    <button
                      onClick={() => handleRemoveRole(role)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No roles assigned</p>
              )}
            </div>
          </div>

          {availableRoles.length > 0 && (
            <div>
              <Label className="mb-2 block">Add Role</Label>
              <div className="flex gap-2">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select a role</option>
                  {availableRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <Button onClick={handleAddRole} disabled={!selectedRole || loading}>
                  Add
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AddUserModal({ onClose, onAdd, allRoles }: {
  onClose: () => void,
  onAdd: (data: RegisterRequest) => Promise<void>,
  allRoles: string[]
}) {
  const [formData, setFormData] = useState<RegisterRequest>({
    username: '',
    email: '',
    password: '',
    role: 'Tenant'
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onAdd(formData)
      onClose()
    } catch (err: any) {
      console.error('Failed to add user', err)
      alert(err.message || 'Failed to add user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New User</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username ?? ''}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              placeholder="johndoe"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email ?? ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="john@example.com"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password ?? ''}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder="••••••••"
            />
          </div>

          <div>
            <Label htmlFor="role">Initial Role</Label>
            <select
              id="role"
              value={formData.role ?? 'Tenant'}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              {allRoles.filter(r => r !== 'all').map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add User'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

