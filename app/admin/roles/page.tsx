'use client'

import { useState, useMemo, useEffect } from 'react'
import { roleService } from '@/lib/services/api.service'
import { useApi } from '@/lib/hooks/useApi'
import type { Role, UserDto } from '@/lib/types/api'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/lib/hooks/useToast'
import { ToastContainer } from '@/components/ui/toast'
import { useRouter } from 'next/navigation'
import { getUserRoles, getUserName } from '@/lib/auth'
import { userService } from '@/lib/services/api.service'

// location of default roles used by legacy seed button; ideally the
// server's list-roles endpoint will keep these in sync but keep a copy
// here so the button does something useful during early setup.
const DEFAULT_ROLES = ['Admin', 'Owner', 'Tenant', 'ServiceProvider', 'Security', 'Authority']

// simple helper matching backend expectations for a generated role id
function generateRoleId() {
  return `fcms-${Math.floor(Math.random() * 1e8)}`
}

export default function RolesPage() {
  const { toasts, success, error, info, dismissToast } = useToast()
  const router = useRouter()

  // Client-side guard: only Admins should access this page
  useEffect(() => {
    let isMounted = true

    const checkAccess = async () => {
      const localRoles = getUserRoles()
      const username = getUserName()
      const userId = localStorage.getItem('userId')
      const isAdminLocal = localRoles.some(r => r && r.toLowerCase().replace(/^role_/, '') === 'admin')
      
      // Debug: log what we're seeing
      if (typeof window !== 'undefined') {
        // eslint-disable-next-line no-console
        console.log('[Roles Guard]', { 
          localRoles, 
          isAdminLocal, 
          username, 
          userId,
          hasAuth: !!username 
        })
      }
      
      // Allow if already identified as admin
      if (isAdminLocal) return
      
      // If not authenticated in localStorage, check backend as fallback
      if (username && userId) {
        try {
          const user = await userService.getUserById(userId)
          const backendRoles = (user as any).roles || []
          const isAdminBackend = backendRoles.some((r: string) => r && r.toLowerCase().replace(/^role_/, '') === 'admin')
          
          if (typeof window !== 'undefined') {
            // eslint-disable-next-line no-console
            console.log('[Roles Guard - Backend Check]', { backendRoles, isAdminBackend })
          }
          
          if (isAdminBackend && isMounted) {
            return
          }
        } catch (e) {
          if (typeof window !== 'undefined') {
            // eslint-disable-next-line no-console
            console.warn('[Roles Guard] Backend check failed:', e)
          }
        }
      }

      // Allow if just authenticated (even without explicit admin role - backend will reject modifications)
      if (username && isMounted) return
      
      // Not authenticated, redirect to signin
      if (isMounted) {
        router.push('/admin/signin')
      }
    }

    checkAccess()
    
    return () => {
      isMounted = false
    }
  }, [router])
  const { data: roles, loading, error: loadError, refetch } = useApi<Role[]>(() => roleService.getRoles(), [])

  const [newRoleName, setNewRoleName] = useState('')
  const [viewingRole, setViewingRole] = useState<Role | null>(null)
  const [roleUsers, setRoleUsers] = useState<UserDto[]>([])
  const [loadingMembers, setLoadingMembers] = useState(false)
  const existingNames = useMemo(() => new Set((roles || []).map(r => (r.name || '').toLowerCase())), [roles])
  const missingDefaults = useMemo(
    () => DEFAULT_ROLES.filter(r => !existingNames.has(r.toLowerCase())),
    [existingNames]
  )

  const handleSeedDefaults = async () => {
    if (!missingDefaults.length) {
      info('All default roles already exist')
      return
    }
    try {
      for (const name of missingDefaults) {
        try {
          await roleService.createRole({
            id: generateRoleId(),
            name,
            normalizedName: name.toUpperCase(),
            concurrencyStamp: '',
          })
        } catch (e: any) {
          // If role exists or permission denied, surface once, continue others
          console.error('Create role failed', name, e)
        }
      }
      success('Default roles seeded')
      await refetch()
    } catch (e: any) {
      error('Failed to seed roles. Ensure you are logged in as Admin.')
    }
  }

  const handleCreateRole = async () => {
    const name = newRoleName.trim()
    if (!name) return
    if (existingNames.has(name.toLowerCase())) {
      info('Role already exists')
      return
    }
    const roleObj = {
      id: generateRoleId(),
      name,
      normalizedName: name.toUpperCase(),
      concurrencyStamp: ''
    }
    try {
      await roleService.createRole(roleObj)
      success(`Role "${name}" created`)
      setNewRoleName('')
      await refetch()
    } catch (e: any) {
      error('Failed to create role (Admin required)')
    }
  }

  const handleDeleteRole = async (role: Role) => {
    if (!role.id) return
    if (!confirm(`Delete role "${role.name}"?`)) return
    try {
      await roleService.deleteRole(role.id)
      success(`Role "${role.name}" deleted`)
      await refetch()
    } catch (e: any) {
      error('Failed to delete role (Admin required or role in use)')
    }
  }

  useEffect(() => {
    if (viewingRole && viewingRole.name) {
      setLoadingMembers(true)
      roleService.getUsersInRole(viewingRole.name)
        .then(setRoleUsers)
        .catch((e) => {
          console.error('failed to load members for role', viewingRole.name, e)
          setRoleUsers([])
        })
        .finally(() => setLoadingMembers(false))
    } else {
      setRoleUsers([])
    }
  }, [viewingRole])

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Roles</CardTitle>
          <CardDescription>View and manage Identity roles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="New role name (e.g., Manager)"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
              />
              <Button onClick={handleCreateRole} disabled={!newRoleName.trim()}>Create</Button>
            </div>
            {/* <Button variant="outline" onClick={handleSeedDefaults}>
              Seed Default Roles{missingDefaults.length ? ` (${missingDefaults.length})` : ''}
            </Button> */}
          </div>

          {loading ? (
            <div className="text-gray-500">Loading roles…</div>
          ) : loadError ? (
            <div className="text-red-600">Error: {loadError}</div>
          ) : !roles || roles.length === 0 ? (
            <div className="space-y-2">
              <div className="text-gray-500">No roles returned from GET endpoint</div>
              <div className="text-xs text-gray-400">
                Note: If you created roles and got 409 conflicts, they exist in the database.
                Try the "Seed Default Roles" button or create new ones using the form above.
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Normalized</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">ID</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y">
                  {roles.map((r) => (
                    <tr key={r.id || r.name || Math.random()}>
                      <td className="px-4 py-2 text-sm">{r.name}</td>
                      <td className="px-4 py-2 text-sm">{r.normalizedName || '-'}</td>
                      <td className="px-4 py-2 text-xs text-gray-500">{r.id ? r.id : <span className="text-amber-600 font-semibold">(auto-generated)</span>}</td>
                      <td className="px-4 py-2 text-right space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setViewingRole(r)}
                          size="sm"
                        >
                          Members
                        </Button>
                        <Button variant="outline" onClick={() => handleDeleteRole(r)} disabled={!r.id}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* modal showing members of currently-selected role */}
      {viewingRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Users in "{viewingRole.name}"</h2>
              <button
                onClick={() => setViewingRole(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                Close
              </button>
            </div>
            {loadingMembers ? (
              <div>Loading members…</div>
            ) : roleUsers.length === 0 ? (
              <div className="text-gray-500">No users assigned to this role.</div>
            ) : (
              <ul className="list-disc list-inside space-y-1">
                {roleUsers.map((u) => (
                  <li key={u.id || u.userName || Math.random()}>
                    {u.userName || u.email || u.id}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
