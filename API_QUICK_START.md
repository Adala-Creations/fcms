# 🚀 Quick Start: API Integration

## What We've Built

You now have a complete foundation for integrating your backend API:

### ✅ Core Infrastructure
- **Type Definitions** (`lib/types/api.ts`) - TypeScript interfaces for all API data
- **API Client** (`lib/api-client.ts`) - Authenticated fetch wrapper
- **Service Layer** (`lib/services/api.service.ts`) - Organized API calls
- **Custom Hooks** (`lib/hooks/useApi.ts`) - React hooks for data fetching

### 📚 Documentation
- **Integration Guide** (`API_INTEGRATION_GUIDE.md`) - Complete stage-by-stage plan
- **Example Code** (`EXAMPLE_INTEGRATION.tsx`) - Working dashboard example

---

## 🎯 Next Steps (Start Here!)

### Step 1: Verify Backend Connection

First, ensure your backend API is accessible:

```bash
# Test in PowerShell
curl https://surveysoftware.azurewebsites.net/api/health
```

### Step 2: Update API Endpoints

Open `lib/services/api.service.ts` and verify the endpoint paths match your Swagger documentation. You may need to adjust paths like:

```typescript
// Example: If your backend has /api/v1/users instead of /api/users
async getUsers(): Promise<User[]> {
  return apiFetch<User[]>('/api/v1/users', { method: 'GET' })
}
```

### Step 3: Start with Profile Page

Follow the guide in `API_INTEGRATION_GUIDE.md` - Stage 2:

1. Open `app/tenant/profile/page.tsx`
2. Replace mock data with API calls
3. Use the pattern from `EXAMPLE_INTEGRATION.tsx`
4. Test thoroughly

**Code Pattern:**
```tsx
import { useApi } from '@/lib/hooks/useApi'
import { authService } from '@/lib/services/api.service'

const { data: user, loading, error } = useApi(
  () => authService.getCurrentUser(),
  []
)

if (loading) return <div>Loading...</div>
if (error) return <div>Error: {error}</div>

// Use user data in your UI
```

### Step 4: Test and Iterate

- Open browser developer tools (F12)
- Watch the Network tab for API calls
- Check Console for errors
- Verify data displays correctly

---

## 📋 Recommended Integration Order

Follow this order for best results:

1. **Profile Pages** (2-3 hours) - Low risk, easy to test
   - `app/tenant/profile/page.tsx`
   - `app/owner/profile/page.tsx`
   - Other role profiles

2. **Dashboard Statistics** (3-4 hours) - High visibility
   - `app/admin/dashboard/page.tsx`
   - `app/tenant/dashboard/page.tsx`
   - Other role dashboards

3. **List Views** (4-6 hours) - Foundation for CRUD
   - `app/admin/units/page.tsx`
   - `app/admin/users/page.tsx`
   - `app/admin/payments/page.tsx`

4. **Forms & CRUD** (6-8 hours) - Full functionality
   - Create forms
   - Edit forms
   - Delete operations

5. **Complex Features** (8-12 hours) - Advanced workflows
   - Visitor management
   - Service requests
   - Reports

---

## 🛠️ Common Patterns

### Fetching Data
```tsx
const { data, loading, error, refetch } = useApi(
  () => userService.getUsers(),
  []
)
```

### Paginated Lists
```tsx
const { data, loading, setPage } = usePaginatedApi(
  (params) => unitService.getUnits(params),
  1,  // initial page
  10  // page size
)
```

### Creating/Updating Data
```tsx
const { mutate, loading } = useMutation()

const handleSubmit = async (formData) => {
  const result = await mutate(
    (data) => unitService.createUnit(data),
    formData
  )
  
  if (result) {
    alert('Success!')
    router.push('/admin/units')
  }
}
```

### Error Handling
```tsx
if (error) {
  return (
    <div className="bg-red-50 p-4 rounded">
      <p className="text-red-800">{error}</p>
      <button onClick={refetch}>Retry</button>
    </div>
  )
}
```

---

## 🐛 Troubleshooting

### Problem: CORS Errors

**Solution:** Your backend needs to allow requests from your frontend domain, or use the API proxy pattern already set up in `/api/proxy/`.

### Problem: 401 Unauthorized

**Solution:** Check that:
1. User is logged in
2. Token is stored correctly
3. Authorization header is sent
4. Token hasn't expired

### Problem: Type Errors

**Solution:** Update `lib/types/api.ts` to match your backend's actual response structure.

### Problem: API endpoints 404

**Solution:** Verify endpoint paths in `lib/services/api.service.ts` match your Swagger docs exactly.

---

## 📞 Getting Help

1. **Read** `API_INTEGRATION_GUIDE.md` for detailed instructions
2. **Study** `EXAMPLE_INTEGRATION.tsx` for working code
3. **Check** browser console and Network tab for errors
4. **Verify** backend API is accessible and returning expected data

---

## ✅ Pre-Launch Checklist

Before deploying to production:

- [ ] All API endpoints tested
- [ ] Error handling implemented
- [ ] Loading states for all data fetches
- [ ] Empty states handled
- [ ] Form validation works
- [ ] Authentication enforced
- [ ] Role permissions working
- [ ] Mobile responsive
- [ ] Performance optimized

---

**Ready to start? Open `API_INTEGRATION_GUIDE.md` and begin with Stage 2!**
