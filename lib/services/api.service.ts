import apiFetch from '@/lib/api-client'
import type {
  UserDto,
  PropertyDto,
  UnitDto,
  TenantDto,
  PaymentDto,
  ExpenseDto,
  ServiceRequestDto,
  LoginRequest,
  RegisterRequest,
  Role
} from '@/lib/types/api'

// Authentication
export const authService = {
  async login(credentials: LoginRequest) {
    return apiFetch('/api/Authentication/login', {
      method: 'POST',
      json: credentials
    })
  },

  async register(data: RegisterRequest) {
    return apiFetch('/api/Authentication/register', {
      method: 'POST',
      json: data
    })
  },

  async addUserToRole(data: { username: string; roleName: string }) {
    return apiFetch('/api/Authentication/add-to-role', {
      method: 'POST',
      json: data
    })
  },

  async removeUserFromRole(data: { username: string; roleName: string }) {
    return apiFetch('/api/Authentication/remove-from-role', {
      method: 'POST',
      json: data
    })
  },

  async getCurrentUser(): Promise<UserDto> {
    // This will need the actual user ID from the token or session
    // For now, this is a placeholder - you'll need to decode the JWT or get user ID
    const userId = localStorage.getItem('userId') || ''
    return userService.getUserById(userId)
  }
}

// Roles
export const roleService = {
  async getRoles(): Promise<Role[]> {
    return apiFetch<Role[]>('/api/Roles', { method: 'GET' })
  },

  async createRole(role: Role): Promise<Role> {
    return apiFetch<Role>('/api/Roles', { method: 'POST', json: role })
  },

  async getRoleById(id: string): Promise<Role> {
    return apiFetch<Role>(`/api/Roles/${id}`, { method: 'GET' })
  },

  async updateRole(id: string, role: Role): Promise<void> {
    return apiFetch<void>(`/api/Roles/${id}`, { method: 'PUT', json: role })
  },

  async deleteRole(id: string): Promise<void> {
    return apiFetch<void>(`/api/Roles/${id}`, { method: 'DELETE' })
  },

  async getUserRoles(username: string): Promise<string[]> {
    return apiFetch<string[]>(`/api/Authentication/user-roles/${username}`, { method: 'GET' })
  }
}

// Users  
export const userService = {
  async getUsers(): Promise<UserDto[]> {
    return apiFetch<UserDto[]>('/api/Users', { method: 'GET' })
  },

  async getUserById(id: string): Promise<UserDto> {
    return apiFetch<UserDto>(`/api/Users/${id}`, { method: 'GET' })
  },

  async updateUser(id: string, data: Partial<UserDto>) {
    // Only send fields that can be updated
    const updateData = {
      id,
      userName: data.userName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      emailConfirmed: data.emailConfirmed,
      phoneNumberConfirmed: data.phoneNumberConfirmed,
      twoFactorEnabled: data.twoFactorEnabled,
      lockoutEnabled: data.lockoutEnabled
    }
    // Debug: log payload to help diagnose 400 from backend
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.debug('[api] updateUser payload', updateData)
    }
    return apiFetch<UserDto>(`/api/Users/${id}`, {
      method: 'PUT',
      json: updateData
    })
  },

  async deleteUser(id: string) {
    return apiFetch(`/api/Users/${id}`, { method: 'DELETE' })
  }
}

// Properties
export const propertyService = {
  async getProperties(): Promise<PropertyDto[]> {
    return apiFetch<PropertyDto[]>('/api/Properties', { method: 'GET' })
  },

  async getPropertyById(id: number): Promise<PropertyDto> {
    return apiFetch<PropertyDto>(`/api/Properties/${id}`, { method: 'GET' })
  },

  async createProperty(data: Partial<PropertyDto>): Promise<PropertyDto> {
    return apiFetch<PropertyDto>('/api/Properties', {
      method: 'POST',
      json: data
    })
  },

  async updateProperty(id: number, data: PropertyDto): Promise<void> {
    return apiFetch<void>(`/api/Properties/${id}`, {
      method: 'PUT',
      json: data
    })
  },

  async deleteProperty(id: number): Promise<void> {
    return apiFetch<void>(`/api/Properties/${id}`, { method: 'DELETE' })
  }
}

// Units
export const unitService = {
  async getUnits(): Promise<UnitDto[]> {
    return apiFetch<UnitDto[]>('/api/Units', { method: 'GET' })
  },

  async getUnitById(id: number): Promise<UnitDto> {
    return apiFetch<UnitDto>(`/api/Units/${id}`, { method: 'GET' })
  },

  async createUnit(data: Partial<UnitDto>): Promise<UnitDto> {
    return apiFetch<UnitDto>('/api/Units', {
      method: 'POST',
      json: data
    })
  },

  async updateUnit(id: number, data: UnitDto): Promise<void> {
    return apiFetch<void>(`/api/Units/${id}`, {
      method: 'PUT',
      json: data
    })
  },

  async deleteUnit(id: number): Promise<void> {
    return apiFetch<void>(`/api/Units/${id}`, { method: 'DELETE' })
  }
}

// Tenants
export const tenantService = {
  async getTenants(): Promise<TenantDto[]> {
    return apiFetch<TenantDto[]>('/api/Tenants', { method: 'GET' })
  },

  async getTenantById(id: number): Promise<TenantDto> {
    return apiFetch<TenantDto>(`/api/Tenants/${id}`, { method: 'GET' })
  }
}

// Payments
export const paymentService = {
  async getPayments(params?: { tenantId?: string | null; page?: number; pageSize?: number }): Promise<PaymentDto[]> {
    // For now, just fetch all payments and filter client-side
    // TODO: Update when backend supports query parameters
    const payments = await apiFetch<PaymentDto[]>('/api/Payments', { method: 'GET' })
    
    if (params?.tenantId) {
      return payments.filter(p => p.tenantId === parseInt(params.tenantId!))
    }
    
    return payments
  },

  async getPaymentById(id: number): Promise<PaymentDto> {
    return apiFetch<PaymentDto>(`/api/Payments/${id}`, { method: 'GET' })
  }
}

// Expenses
export const expenseService = {
  async getExpenses(): Promise<ExpenseDto[]> {
    return apiFetch<ExpenseDto[]>('/api/Expenses', { method: 'GET' })
  },

  async getExpenseById(id: number): Promise<ExpenseDto> {
    return apiFetch<ExpenseDto>(`/api/Expenses/${id}`, { method: 'GET' })
  }
}

// Service Requests
export const serviceRequestService = {
  async getServiceRequests(): Promise<ServiceRequestDto[]> {
    return apiFetch<ServiceRequestDto[]>('/api/ServiceRequests', { method: 'GET' })
  },

  async getServiceRequestById(id: number): Promise<ServiceRequestDto> {
    return apiFetch<ServiceRequestDto>(`/api/ServiceRequests/${id}`, { method: 'GET' })
  }
}

// Dashboard Stats (temporary - customize based on actual backend endpoint)
export const dashboardService = {
  async getStats(): Promise<{
    totalProperties: number
    totalUnits: number
    totalTenants: number
    totalPayments: number
    monthlyRevenue: number
    monthlyExpenses: number
    pendingPayments: number
    overduePayments: number
  }> {
    // This will need to be replaced with actual backend endpoint
    // For now, aggregate data from existing endpoints
    const [properties, units, tenants, payments] = await Promise.all([
      propertyService.getProperties(),
      unitService.getUnits(),
      tenantService.getTenants(),
      paymentService.getPayments()
    ])

    return {
      totalProperties: properties.length,
      totalUnits: units.length,
      totalTenants: tenants.length,
      totalPayments: payments.length,
      monthlyRevenue: 0, // Calculate from payments
      monthlyExpenses: 0, // Calculate from expenses
      pendingPayments: 0, // Filter payments by status
      overduePayments: 0  // Filter payments by status
    }
  },

  async getTenantStats(tenantId: string): Promise<any> {
    // Fetch tenant-specific statistics
    const [payments, serviceRequests] = await Promise.all([
      paymentService.getPayments({ tenantId }),
      serviceRequestService.getServiceRequests()
    ])

    return {
      totalPayments: payments.length,
      totalServiceRequests: serviceRequests.length,
      // Add more stats as needed
    }
  }
}
