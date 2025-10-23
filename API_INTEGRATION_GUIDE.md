# API Integration Guide - Stage by Stage

## Overview
This guide provides a systematic approach to integrate your backend API (https://surveysoftware.azurewebsites.net) with the FCMS frontend. Follow these stages in order for smooth integration.

---

## 🏗️ Stage 1: Foundation Setup ✅ COMPLETE

**What we've built:**
- ✅ Type definitions (`lib/types/api.ts`)
- ✅ API client with authentication (`lib/api-client.ts`)
- ✅ Service layer for API calls (`lib/services/api.service.ts`)
- ✅ Custom React hooks (`lib/hooks/useApi.ts`)

**Configuration:**
```env
# .env.local
NEXT_PUBLIC_API_URL=
BACKEND_API_URL=https://surveysoftware.azurewebsites.net
```

---

## 📋 Stage 2: User Profile & Settings (START HERE)

**Priority:** HIGH | **Risk:** LOW | **Estimated Time:** 2-3 hours

### Why Start Here?
- Simple GET/PUT operations
- Users work with their own data
- Easy to test and validate
- Non-critical if something breaks

### Implementation Steps:

#### Step 2.1: Profile Page
**File:** `app/tenant/profile/page.tsx` (or any role)

**Current State:** Uses mock data
**Goal:** Fetch and display real user data

**Implementation:**
```tsx
'use client'

import { useState } from 'react'
import { useDashboardStats } from '@/lib/hooks/useApi'
import { authService, userService } from '@/lib/services/api.service'
import { Button } from '@/components/ui/button'

export default function TenantProfile() {
  const { data: user, loading, error, refetch } = useApi(
    () => authService.getCurrentUser(),
    []
  )

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!user) return <div>No user data</div>

  return (
    <div>
      <h1>{user.firstName} {user.lastName}</h1>
      <p>{user.email}</p>
      {/* Rest of your profile UI */}
    </div>
  )
}
```

#### Step 2.2: Update Profile (Mutation)
```tsx
import { useMutation } from '@/lib/hooks/useApi'
import { userService } from '@/lib/services/api.service'

const { mutate, loading: saving } = useMutation()

const handleSave = async (formData: any) => {
  const result = await mutate(
    (data) => userService.updateUser(user.id, data),
    formData
  )
  
  if (result) {
    alert('Profile updated successfully')
    refetch() // Refresh data
  }
}
```

#### Step 2.3: Test Checklist
- [ ] Profile data loads correctly
- [ ] Loading state displays
- [ ] Error handling works
- [ ] Update saves successfully
- [ ] Data refreshes after update

**Files to Update:**
1. `app/tenant/profile/page.tsx`
2. `app/owner/profile/page.tsx`
3. `app/admin/profile/page.tsx`
4. (Repeat for other roles)

---

## 📊 Stage 3: Dashboard Statistics (NEXT)

**Priority:** HIGH | **Risk:** MEDIUM | **Estimated Time:** 3-4 hours

### Why Second?
- High visibility - users see immediate value
- Read-only data - safer than writes
- Tests multiple API endpoints
- Demonstrates progress quickly

### Implementation Steps:

#### Step 3.1: Admin Dashboard
**File:** `app/admin/dashboard/page.tsx`

**Replace mock data with:**
```tsx
import { useDashboardStats } from '@/lib/hooks/useApi'
import { dashboardService } from '@/lib/services/api.service'

export default function AdminDashboard() {
  const { data: stats, loading, error } = useDashboardStats(
    () => dashboardService.getAdminStats()
  )

  if (loading) {
    return <div>Loading dashboard...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      {/* Use real stats */}
      <Card>
        <CardTitle>Total Residents</CardTitle>
        <div>{stats?.totalResidents || 0}</div>
      </Card>
      
      <Card>
        <CardTitle>Monthly Revenue</CardTitle>
        <div>{formatCurrency(stats?.monthlyRevenue || 0)}</div>
      </Card>
      
      {/* ... rest of dashboard */}
    </div>
  )
}
```

#### Step 3.2: Tenant Dashboard
**File:** `app/tenant/dashboard/page.tsx`

```tsx
const { data: stats, loading, error } = useDashboardStats(
  () => dashboardService.getTenantStats(currentUserId)
)
```

#### Step 3.3: Test Checklist
- [ ] Dashboard loads with real data
- [ ] All stat cards display correctly
- [ ] Numbers match backend data
- [ ] Loading states work
- [ ] Error handling graceful

**Files to Update:**
1. `app/admin/dashboard/page.tsx`
2. `app/tenant/dashboard/page.tsx`
3. `app/owner/dashboard/page.tsx`
4. `app/provider/dashboard/page.tsx`
5. `app/security/dashboard/page.tsx`
6. `app/authority/dashboard/page.tsx`

---

## 📝 Stage 4: List Views (Tables)

**Priority:** HIGH | **Risk:** MEDIUM | **Estimated Time:** 4-6 hours

### Why Third?
- Establishes patterns for all list pages
- Introduces pagination
- Tests filtering and sorting
- Foundation for detail views

### Implementation Steps:

#### Step 4.1: Units List Page
**File:** `app/admin/units/page.tsx`

```tsx
import { usePaginatedApi } from '@/lib/hooks/useApi'
import { unitService } from '@/lib/services/api.service'

export default function UnitsPage() {
  const {
    data: unitsResponse,
    loading,
    error,
    setPage,
    setPageSize
  } = usePaginatedApi(
    (params) => unitService.getUnits(params),
    1, // initial page
    10  // page size
  )

  if (loading) return <div>Loading units...</div>
  if (error) return <div>Error: {error}</div>

  const units = unitsResponse?.items || []
  const totalPages = unitsResponse?.totalPages || 0

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Unit Number</th>
            <th>Type</th>
            <th>Status</th>
            <th>Rent</th>
          </tr>
        </thead>
        <tbody>
          {units.map(unit => (
            <tr key={unit.id}>
              <td>{unit.unitNumber}</td>
              <td>{unit.type}</td>
              <td>{unit.status}</td>
              <td>{formatCurrency(unit.rentAmount)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div>
        <button onClick={() => setPage(p => Math.max(1, p - 1))}>
          Previous
        </button>
        <span>Page {unitsResponse?.pageNumber} of {totalPages}</span>
        <button onClick={() => setPage(p => p + 1)}>
          Next
        </button>
      </div>
    </div>
  )
}
```

#### Step 4.2: Add Filtering
```tsx
const [statusFilter, setStatusFilter] = useState<string>('')

const {
  data: unitsResponse,
  loading,
  error
} = useApi(
  () => unitService.getUnits({ 
    page: 1, 
    pageSize: 10, 
    status: statusFilter 
  }),
  [statusFilter]
)
```

#### Step 4.3: Test Checklist
- [ ] Data loads in table
- [ ] Pagination works
- [ ] Filtering works
- [ ] Loading states
- [ ] Empty state handling

**Files to Update (in order):**
1. `app/admin/units/page.tsx` (Start here - simple)
2. `app/admin/users/page.tsx`
3. `app/admin/payments/page.tsx`
4. `app/admin/expenses/page.tsx`
5. `app/admin/visitors/page.tsx`
6. `app/admin/providers/page.tsx`
7. (Continue with other role's list pages)

---

## ✏️ Stage 5: Forms & CRUD Operations

**Priority:** MEDIUM | **Risk:** HIGH | **Estimated Time:** 6-8 hours

### Why Fourth?
- Builds on list views
- Involves data mutations
- Requires validation
- Higher risk of errors

### Implementation Steps:

#### Step 5.1: Create Unit Form
```tsx
import { useMutation } from '@/lib/hooks/useApi'
import { unitService } from '@/lib/services/api.service'

export default function CreateUnitForm() {
  const { mutate, loading, error } = useMutation()
  const [formData, setFormData] = useState({
    unitNumber: '',
    type: 'OneBedroom',
    rentAmount: 0,
    // ... other fields
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = await mutate(
      (data) => unitService.createUnit(data),
      formData
    )

    if (result) {
      alert('Unit created successfully')
      router.push('/admin/units')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.unitNumber}
        onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Unit'}
      </button>

      {error && <div className="error">{error}</div>}
    </form>
  )
}
```

#### Step 5.2: Update Form
```tsx
const { data: unit, loading: loadingUnit } = useEntity(
  (id) => unitService.getUnitById(id),
  unitId
)

const { mutate, loading: saving } = useMutation()

const handleUpdate = async (e: React.FormEvent) => {
  e.preventDefault()
  
  const result = await mutate(
    (data) => unitService.updateUnit(unitId, data),
    formData
  )

  if (result) {
    alert('Unit updated successfully')
  }
}
```

#### Step 5.3: Delete Operation
```tsx
const handleDelete = async (id: string) => {
  if (!confirm('Are you sure?')) return
  
  const result = await mutate(
    () => unitService.deleteUnit(id),
    null
  )

  if (result !== null) {
    alert('Unit deleted')
    refetch() // Refresh list
  }
}
```

**Files to Update:**
1. Create forms for each entity (units, users, payments, etc.)
2. Edit forms with pre-populated data
3. Delete confirmations

---

## 🔧 Stage 6: Complex Features

**Priority:** MEDIUM | **Risk:** HIGH | **Estimated Time:** 8-12 hours

### Features to Implement:
1. **Visitor Management** - QR code generation, check-in/out
2. **Service Requests** - Full workflow with assignments
3. **Payment Processing** - Complex validation
4. **Reports** - Data aggregation and exports

### Implementation Pattern:
```tsx
// Visitor creation with QR code
const { mutate, loading } = useMutation()

const handleCreateVisitor = async (data: any) => {
  const result = await mutate(
    (visitorData) => visitorService.createVisitor(visitorData),
    data
  )

  if (result?.qrCode) {
    // Display QR code
    setQRCodeData(result.qrCode)
  }
}

// Visitor check-in
const handleCheckIn = async (visitorId: string) => {
  const result = await mutate(
    (id) => visitorService.checkInVisitor(id),
    visitorId
  )

  if (result) {
    alert('Visitor checked in')
    refetch()
  }
}
```

---

## 🎯 Best Practices & Tips

### 1. Error Handling
```tsx
if (error) {
  return (
    <div className="error-container">
      <p>Failed to load data</p>
      <p>{error}</p>
      <button onClick={refetch}>Try Again</button>
    </div>
  )
}
```

### 2. Loading States
```tsx
if (loading) {
  return (
    <div className="loading-skeleton">
      <div className="skeleton-card"></div>
      <div className="skeleton-card"></div>
      <div className="skeleton-card"></div>
    </div>
  )
}
```

### 3. Empty States
```tsx
if (!data || data.items.length === 0) {
  return (
    <div className="empty-state">
      <p>No units found</p>
      <button onClick={() => router.push('/admin/units/create')}>
        Create First Unit
      </button>
    </div>
  )
}
```

### 4. Optimistic Updates
```tsx
const handleUpdate = async (data: any) => {
  // Update UI immediately
  setLocalData(data)
  
  // Then sync with server
  const result = await mutate(updateFunction, data)
  
  if (!result) {
    // Revert on error
    setLocalData(originalData)
  }
}
```

### 5. Debounced Search
```tsx
import { useMemo } from 'react'
import { debounce } from 'lodash'

const debouncedSearch = useMemo(
  () => debounce((query: string) => {
    // Call API with search query
    refetch()
  }, 500),
  []
)
```

---

## 🧪 Testing Each Stage

### Checklist for Each Feature:
- [ ] Happy path works
- [ ] Loading states display correctly
- [ ] Error handling works gracefully
- [ ] Empty states handled
- [ ] Form validation works
- [ ] Success messages shown
- [ ] Data refreshes after mutations
- [ ] Mobile responsive
- [ ] Authentication required
- [ ] Role permissions enforced

---

## 🚀 Deployment Checklist

Before going to production:
- [ ] All API endpoints tested
- [ ] Error logging implemented
- [ ] Loading skeletons for better UX
- [ ] Toast notifications for success/error
- [ ] Form validation on client & server
- [ ] Authentication token refresh
- [ ] CORS configured properly
- [ ] Environment variables set
- [ ] Rate limiting considered
- [ ] Analytics tracking added

---

## 📞 Need Help?

### Common Issues:

**1. CORS Errors**
- Solution: Configure backend CORS or use API proxy

**2. Authentication Failures**
- Check token storage
- Verify token expiration
- Ensure Authorization header format

**3. 404 Errors**
- Verify API endpoint paths match backend
- Check base URL configuration

**4. Type Errors**
- Update type definitions in `lib/types/api.ts`
- Match backend response structure

---

## 📈 Progress Tracking

Use this checklist to track your integration:

### Stage 1: Foundation ✅
- [x] Type definitions
- [x] API client
- [x] Service layer
- [x] Custom hooks

### Stage 2: Profile & Settings
- [ ] Tenant profile
- [ ] Owner profile
- [ ] Admin profile
- [ ] Settings pages (all roles)

### Stage 3: Dashboards
- [ ] Admin dashboard
- [ ] Tenant dashboard
- [ ] Owner dashboard
- [ ] Provider dashboard
- [ ] Security dashboard
- [ ] Authority dashboard

### Stage 4: List Views
- [ ] Units list
- [ ] Users list
- [ ] Payments list
- [ ] Expenses list
- [ ] Visitors list
- [ ] Service requests list
- [ ] Providers list

### Stage 5: CRUD Operations
- [ ] Create forms (all entities)
- [ ] Edit forms (all entities)
- [ ] Delete operations
- [ ] Form validation

### Stage 6: Complex Features
- [ ] Visitor management (QR codes)
- [ ] Service request workflow
- [ ] Payment processing
- [ ] Report generation
- [ ] Compliance tracking

---

**Start with Stage 2 and work your way through each stage systematically!**
