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
  Role,
  VisitorDto,
  ServiseProviderDto
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
  },

  async createPayment(data: Partial<PaymentDto>): Promise<PaymentDto> {
    const { id, ...createData } = data as PaymentDto
    return apiFetch<PaymentDto>('/api/Payments', {
      method: 'POST',
      json: createData
    })
  },

  async updatePayment(id: number, data: Partial<PaymentDto>): Promise<void> {
    const { id: _, ...updateData } = data as PaymentDto
    return apiFetch<void>(`/api/Payments/${id}`, {
      method: 'PUT',
      json: updateData
    })
  },

  async deletePayment(id: number): Promise<void> {
    return apiFetch<void>(`/api/Payments/${id}`, { method: 'DELETE' })
  }
}

// Expenses
export const expenseService = {
  async getExpenses(): Promise<ExpenseDto[]> {
    return apiFetch<ExpenseDto[]>('/api/Expenses', { method: 'GET' })
  },

  async getExpenseById(id: number): Promise<ExpenseDto> {
    return apiFetch<ExpenseDto>(`/api/Expenses/${id}`, { method: 'GET' })
  },

  async createExpense(data: Partial<ExpenseDto>): Promise<ExpenseDto> {
    const { id, ...createData } = data as ExpenseDto
    return apiFetch<ExpenseDto>('/api/Expenses', {
      method: 'POST',
      json: createData
    })
  },

  async updateExpense(id: number, data: Partial<ExpenseDto>): Promise<void> {
    const { id: _, ...updateData } = data as ExpenseDto
    return apiFetch<void>(`/api/Expenses/${id}`, {
      method: 'PUT',
      json: updateData
    })
  },

  async deleteExpense(id: number): Promise<void> {
    return apiFetch<void>(`/api/Expenses/${id}`, { method: 'DELETE' })
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

// Visitors
export const visitorService = {
  async getVisitors(): Promise<VisitorDto[]> {
    return apiFetch<VisitorDto[]>('/api/Visitors', { method: 'GET' })
  },

  async getVisitorById(id: number): Promise<VisitorDto> {
    return apiFetch<VisitorDto>(`/api/Visitors/${id}`, { method: 'GET' })
  },

  async createVisitor(data: Partial<VisitorDto>): Promise<VisitorDto> {
    return apiFetch<VisitorDto>('/api/Visitors', {
      method: 'POST',
      json: data
    })
  },

  async updateVisitor(id: number, data: Partial<VisitorDto>): Promise<void> {
    return apiFetch<void>(`/api/Visitors/${id}`, {
      method: 'PUT',
      json: data
    })
  },

  async deleteVisitor(id: number): Promise<void> {
    return apiFetch<void>(`/api/Visitors/${id}`, { method: 'DELETE' })
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

// Service Providers
export const serviceProviderService = {
  async getProviders(): Promise<ServiseProviderDto[]> {
    return apiFetch<ServiseProviderDto[]>('/api/ServiseProviders', { method: 'GET' })
  },

  async getProviderById(id: number): Promise<ServiseProviderDto> {
    return apiFetch<ServiseProviderDto>(`/api/ServiseProviders/${id}`, { method: 'GET' })
  },

  async createProvider(data: Partial<ServiseProviderDto>): Promise<ServiseProviderDto> {
    // Remove id field for creation as backend generates it
    const { id, ...createData } = data as ServiseProviderDto
    return apiFetch<ServiseProviderDto>('/api/ServiseProviders', {
      method: 'POST',
      json: createData
    })
  },

  async updateProvider(id: number, data: Partial<ServiseProviderDto>): Promise<void> {
    // Remove id field from update data
    const { id: _, ...updateData } = data as ServiseProviderDto
    return apiFetch<void>(`/api/ServiseProviders/${id}`, {
      method: 'PUT',
      json: updateData
    })
  },

  async deleteProvider(id: number): Promise<void> {
    return apiFetch<void>(`/api/ServiseProviders/${id}`, { method: 'DELETE' })
  }
}
