# Backend Integration - Stage by Stage Guide

## ✅ What's Been Completed

### 1. Type Definitions Updated (`lib/types/api.ts`)
All TypeScript interfaces now match your exact backend DTOs:
- `UserDto`, `PropertyDto`, `UnitDto`, `TenantDto`, `OwnerDto`, `OwnerUnitDto`
- `PaymentDto`, `ExpenseDto`, `ServiceRequestDto`, `ServiseProviderDto`  
- `ProviderReceiptDto`, `VisitorDto`, `SecurityPersonnelDto`
- `ReportDto`, `ComplianceRecordDto`, `Role`
- `LoginRequest`, `RegisterRequest`, `AddToRoleRequest`

### 2. Authentication Updated (`lib/auth.ts`)
- Now uses `/api/Authentication/login` endpoint
- Now uses `/api/Authentication/register` endpoint  
- Changed to use `username` instead of `email` for login

### 3. Roles & Authorization APIs
- New `GET /api/Authentication/list-roles` returns current role names
- `POST /api/Authentication/add-to-role` & `remove-from-role` accept `{ username, roleName }`
- `GET /api/Authentication/list-users-in-role/:roleName` returns users for a given role
- CRUD for role objects remain under `/api/Roles` (GET/POST/PUT/DELETE)


### 3. API Client (`lib/api-client.ts`)
- Already configured correctly
- Uses Bearer token authentication
- Base URL: `https://surveysoftware.azurewebsites.net`

## ⚠️ Action Required

### Fix `lib/services/api.service.ts`

The file got corrupted during update. **Please manually create it** with this content:

```typescript
/**
 * API Service Layer for FCMS
 */

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
  RegisterRequest
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
  }
}

// Users  
export const userService = {
  async getUsers(): Promise<UserDto[]> {
    return apiFetch<UserDto[]>('/api/Users', { method: 'GET' })
  },

  async getUserById(id: string): Promise<UserDto> {
    return apiFetch<UserDto>(`/api/Users/${id}`, { method: 'GET' })
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

  async updateProperty(id: number, data: Partial<PropertyDto>): Promise<void> {
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

  async updateUnit(id: number, data: Partial<UnitDto>): Promise<void> {
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
  async getPayments(): Promise<PaymentDto[]> {
    return apiFetch<PaymentDto[]>('/api/Payments', { method: 'GET' })
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
```

---

## 🚀 Stage-by-Stage Integration Plan

### **Stage 1: Properties List** (START HERE - 1 hour)

**Goal:** Get your first real data from backend displayed

**File to update:** `app/admin/dashboard/page.tsx`

**Steps:**
1. Import the hook and service:
   ```typescript
   import { useApi } from '@/lib/hooks/useApi'
   import { propertyService } from '@/lib/services/api.service'
   ```

2. Fetch properties:
   ```typescript
   const { data: properties, loading, error } = useApi(
     () => propertyService.getProperties(),
     []
   )
   ```

3. Display:
   ```typescript
   if (loading) return <div>Loading properties...</div>
   if (error) return <div>Error: {error}</div>

   return (
     <div>
       <h1>Properties</h1>
       {properties?.map(property => (
         <div key={property.id}>
           <h3>{property.name}</h3>
           <p>{property.address}</p>
         </div>
       ))}
     </div>
   )
   ```

**Test:** Open admin dashboard, should see real properties from backend

---

### **Stage 2: Units List with CRUD** (2-3 hours)

**File to update:** `app/admin/units/page.tsx`

**Pattern:**
```typescript
import { useApi, useMutation } from '@/lib/hooks/useApi'
import { unitService } from '@/lib/services/api.service'

// List units
const { data: units, loading, error, refetch } = useApi(
  () => unitService.getUnits(),
  []
)

// Create unit
const { mutate: createUnit, loading: creating } = useMutation()

const handleCreate = async (formData) => {
  const result = await createUnit(
    (data) => unitService.createUnit(data),
    formData
  )
  
  if (result) {
    refetch() // Refresh list
  }
}
```

---

### **Stage 3: Payments & Tenants** (2-3 hours)

**Files:**
- `app/admin/payments/page.tsx` - List all payments
- `app/tenant/payments/page.tsx` - Tenant's payments
  
**Pattern:** Same as Units, but filter by tenantId for tenant view

---

### **Stage 4: Service Requests** (2-3 hours)

**Files:**
- `app/admin/providers/page.tsx` - Service providers
- `app/tenant/requests/page.tsx` - Create & view requests

---

## 📝 Key Backend Differences from Mock Data

### 1. **IDs are numbers, not strings**
   - Unit ID: `number` not `string`
   - Property ID: `number` not `string`
   
### 2. **No pagination in basic endpoints**
   - `/api/Units` returns ALL units (no `?page=1&pageSize=10`)
   - You'll need to implement client-side pagination OR ask backend team to add it

### 3. **No direct user profile endpoint visible**
   - You may need `/api/Users/{id}` with the logged-in user's ID
   - Or ask backend team for `/api/Users/me` endpoint

### 4. **Visitor API doesn't exist yet**
   - ERD shows `VISITOR` table but no Swagger endpoint
   - Need to ask backend team to implement `/api/Visitors`

### 5. **Authentication response structure**
   - Check what `/api/Authentication/login` actually returns
   - May need to store user ID separately for later API calls

---

## 🧪 Testing Checklist

Before moving to next stage:

- [ ] Can login successfully
- [ ] Token is stored in localStorage
- [ ] API calls include Bearer token in headers  
- [ ] Can fetch data from at least one endpoint
- [ ] Loading states work
- [ ] Error messages display
- [ ] Can create new record
- [ ] Can update existing record
- [ ] Can delete record

---

## 🐛 Common Issues & Solutions

### Issue: CORS errors
**Solution:** Backend needs to allow your frontend domain

### Issue: 401 Unauthorized
**Solutions:**
1. Check token is saved: `localStorage.getItem('token')`
2. Check token format in request headers (should be `Bearer {token}`)
3. Login again to get fresh token

### Issue: Properties/Units come back empty
**Solutions:**
1. Check database has data
2. Use Swagger UI to test endpoints directly
3. Check network tab in browser DevTools

### Issue: IDs don't match (string vs number)
**Solution:** Update your types - backend uses `number` for IDs

---

## 📞 Next Steps

1. **Delete and manually recreate** `lib/services/api.service.ts` with content above
2. **Start with Stage 1** - Get properties displaying
3. **Test authentication** - Make sure login works
4. **Move to Stage 2** - Units CRUD
5. **Continue stage by stage**

**Need backend code?** Only if Swagger doesn't have enough info. The Swagger spec is comprehensive enough for now.

---

**Once `api.service.ts` is fixed, you're ready to start integrating! Begin with Stage 1.**
