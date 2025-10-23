/**
 * API client utilities for FCMS
 */

// Use proxy to avoid CORS issues - empty string means relative URLs (/api/proxy/...)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

interface FetchOptions {
  method?: string
  headers?: Record<string, string>
  json?: any
  body?: any
}

let authToken: string | null = null

/**
 * Set authentication token
 */
export function setAuthToken(token: string): void {
  authToken = token
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token)
  }
}

/**
 * Get authentication token
 */
export function getAuthToken(): string | null {
  if (authToken) return authToken
  
  if (typeof window !== 'undefined') {
    authToken = localStorage.getItem('token')
  }
  
  return authToken
}

/**
 * Clear authentication token
 */
export function clearAuthToken(): void {
  authToken = null
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
  }
}

/**
 * API fetch wrapper with authentication
 */
export default async function apiFetch<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { method = 'POST', headers = {}, json, body } = options

  // If API_BASE_URL is empty, use the proxy route
  let url: string
  if (API_BASE_URL) {
    // Direct backend access (will have CORS issues in development)
    url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`
  } else {
    // Use Next.js proxy to avoid CORS
    // Convert /api/Units -> /api/proxy/Units
    const proxyPath = endpoint.replace(/^\/api\//, '/api/proxy/')
    url = proxyPath
  }

  const token = getAuthToken()
  const requestHeaders: Record<string, string> = {
    ...headers,
  }

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`
  }

  if (json) {
    requestHeaders['Content-Type'] = 'application/json'
  }

  const fetchOptions: RequestInit = {
    method,
    headers: requestHeaders,
  }

  if (json) {
    fetchOptions.body = JSON.stringify(json)
  } else if (body) {
    fetchOptions.body = body
  }

  const response = await fetch(url, fetchOptions)

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `HTTP error! status: ${response.status}`,
    }))
    throw new Error(error.message || `HTTP error! status: ${response.status}`)
  }

  // Handle empty responses (like 204 No Content for DELETE)
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return undefined as T
  }

  // Try to parse as JSON
  const contentType = response.headers.get('content-type')
  if (contentType?.includes('application/json')) {
    return response.json()
  }

  // If no content-type or empty body, return undefined
  const text = await response.text()
  if (!text) {
    return undefined as T
  }

  // Try to parse text as JSON
  try {
    return JSON.parse(text)
  } catch {
    return text as unknown as T
  }
}
