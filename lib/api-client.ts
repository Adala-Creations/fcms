/**
 * API client utilities for FCMS
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

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

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`

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

  return response.json()
}
