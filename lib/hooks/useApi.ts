import { useState, useEffect, useCallback } from 'react'
import type {
  UserDto,
  UnitDto,
  PaymentDto,
  ExpenseDto,
  VisitorDto,
  ServiceRequestDto,
  ServiseProviderDto
} from '@/lib/types/api'

// Generic paginated response type
interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Dashboard stats type (to be implemented based on backend)
interface DashboardStats {
  totalProperties?: number
  totalUnits?: number
  totalTenants?: number
  totalPayments?: number
  [key: string]: any
}

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

interface UsePaginatedApiState<T> extends UseApiState<PaginatedResponse<T>> {
  setPage: (page: number) => void
  setPageSize: (size: number) => void
}

/**
 * Generic hook for API calls with loading and error states
 */
export function useApi<T>(
  apiCall: () => Promise<T>,
  deps: any[] = []
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiCall()
      setData(result)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      console.error('API Error:', err)
    } finally {
      setLoading(false)
    }
  }, deps)

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

/**
 * Hook for paginated API calls
 */
export function usePaginatedApi<T>(
  apiCall: (params: { page: number; pageSize: number }) => Promise<PaginatedResponse<T>>,
  initialPage = 1,
  initialPageSize = 10
): UsePaginatedApiState<T> {
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const { data, loading, error, refetch } = useApi(
    () => apiCall({ page, pageSize }),
    [page, pageSize]
  )

  return {
    data,
    loading,
    error,
    refetch,
    setPage,
    setPageSize
  }
}

/**
 * Hook for dashboard statistics
 */
export function useDashboardStats(
  apiCall: () => Promise<DashboardStats>
): UseApiState<DashboardStats> {
  return useApi(apiCall)
}

/**
 * Hook for single entity by ID
 */
export function useEntity<T>(
  apiCall: (id: string) => Promise<T>,
  id: string | null
): UseApiState<T> {
  return useApi(
    async () => {
      if (!id) throw new Error('ID is required')
      return apiCall(id)
    },
    [id]
  )
}

/**
 * Hook for mutations (create, update, delete)
 */
export function useMutation<TData, TVariables = any>() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<TData | null>(null)

  const mutate = async (
    apiCall: (variables: TVariables) => Promise<TData>,
    variables: TVariables
  ): Promise<TData | null> => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiCall(variables)
      setData(result)
      return result
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      console.error('Mutation Error:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setData(null)
    setError(null)
    setLoading(false)
  }

  return { mutate, loading, error, data, reset }
}
