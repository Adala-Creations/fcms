'use client'

import { useState, useMemo, useEffect } from 'react'
import { roleService } from '@/lib/services/api.service'
import { useApi } from '@/lib/hooks/useApi'
import type { Role } from '@/lib/types/api'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/lib/hooks/useToast'
import { ToastContainer } from '@/components/ui/toast'
import { useRouter } from 'next/navigation'
import { getUserRoles, getUserName } from '@/lib/auth'

const DEFAULT_ROLES = ['Admin', 'Owner', 'Tenant', 'ServiceProvider', 'Security', 'Authority']

export default function RolesPage() {
  const { toasts, success, error, info, dismissToast } = useToast()
  const router = useRouter()

  // Client-side guard: only Admins should access this page
  useEffect(() => {
    const localRoles = getUserRoles()
    const isAdminLocal = localRoles.some(r => r && r.toLowerCase().replace(/^role_/, '') === 'admin')
    if (isAdminLocal) return

    // Fallback: ask backend for current user's roles
    const username = getUserName()
    if (!username) {
      router.push('/admin/signin')
      return
    }
    roleService.getUserRoles(username)
      .then(r => {
        const isAdminRemote = r.some(x => x && x.toLowerCase().replace(/^role_/, '') === 'admin')
        if (!isAdminRemote) {
          router.push('/admin/dashboard')
        }
      })
      .catch(() => {
        router.push('/admin/signin')
      })
  }, [router])
  const { data: roles, loading, error: loadError, refetch } = useApi<Role[]>(() => roleService.getRoles(), [])

  const [newRoleName, setNewRoleName] = useState('')
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
          await roleService.createRole({ id: null, name, normalizedName: null, concurrencyStamp: null })
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
    try {
      await roleService.createRole({ id: null, name, normalizedName: null, concurrencyStamp: null })
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
            <Button variant="outline" onClick={handleSeedDefaults}>
              Seed Default Roles{missingDefaults.length ? ` (${missingDefaults.length})` : ''}
            </Button>
          </div>

          {loading ? (
            <div className="text-gray-500">Loading roles…</div>
          ) : loadError ? (
            <div className="text-red-600">Error: {loadError}</div>
          ) : !roles || roles.length === 0 ? (
            <div className="text-gray-500">No roles found</div>
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
                      <td className="px-4 py-2 text-xs text-gray-500">{r.id || '-'}</td>
                      <td className="px-4 py-2 text-right">
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

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
