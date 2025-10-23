/**
 * Authentication utilities for FCMS
 */

import type { LoginRequest, RegisterRequest } from './types/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

export interface LoginResponse {
  token?: string
  accessToken?: string
  jwtToken?: string
  jwt?: string
  access_token?: string
  user?: {
    id: string
    email: string
    userName: string
  }
  userId?: string
  user_id?: string
  roles?: string[]
  role?: string
  [key: string]: any  // Allow other properties from backend
}

/**
 * Decode JWT token to extract claims (including roles)
 */
function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Failed to decode JWT:', error)
    return null
  }
}

/**
 * Extract roles from JWT token
 * Handles both single role claim and array of roles
 */
function extractRolesFromToken(token: string): string[] {
  const decoded = decodeJWT(token)
  if (!decoded) return []

  // Check common role claim names in JWT
  const roleClaim = 
    decoded.role || 
    decoded.roles || 
    decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
    decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role']

  console.log('JWT decoded payload:', decoded)
  console.log('Role claim found:', roleClaim)

  if (!roleClaim) return []

  // Handle both string and array
  return Array.isArray(roleClaim) ? roleClaim : [roleClaim]
}

/**
 * Build API URL (use proxy if API_BASE_URL is empty)
 */
function buildUrl(endpoint: string): string {
  if (API_BASE_URL) {
    return `${API_BASE_URL}${endpoint}`
  }
  // Use proxy
  return endpoint.replace(/^\/api\//, '/api/proxy/')
}

/**
 * Login user with username and password
 */
export async function login(username: string, password: string): Promise<LoginResponse> {
  const credentials: LoginRequest = { username, password }
  
  const response = await fetch(buildUrl('/api/Authentication/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Login failed' }))
    throw new Error(error.message || 'Login failed')
  }

  const data = await response.json()
  
    // Debug: Log the actual response to see what the backend returns
    console.log('Login response:', data)
  
  // Store token in localStorage
  if (typeof window !== 'undefined') {
      // Try different possible token property names
      const token = data.token || data.accessToken || data.jwtToken || data.jwt || data.access_token
    if (token) {
      localStorage.setItem('token', token)
      
      // Extract and store roles from token
      const roles = extractRolesFromToken(token)
      if (roles.length > 0) {
        localStorage.setItem('userRole', roles[0]) // Store primary role
        localStorage.setItem('userRoles', JSON.stringify(roles)) // Store all roles
      }
      
      // Store user ID if available
        if (data.user?.id || data.userId || data.user_id) {
          localStorage.setItem('userId', data.user?.id || data.userId || data.user_id)
      }
      
      // Store username if available
      if (data.user?.userName || data.username) {
        localStorage.setItem('userName', data.user?.userName || data.username)
      }
    }
  }

  return data
}

/**
 * Register new user with optional role
 */
export async function register(username: string, email: string, password: string, role?: string): Promise<LoginResponse> {
  const credentials: RegisterRequest = { username, email, password, role }
  
  const response = await fetch(buildUrl('/api/Authentication/register'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Registration failed' }))
    throw new Error(error.message || 'Registration failed')
  }

  const data = await response.json()
  
    // Debug: Log the actual response to see what the backend returns
    console.log('Register response:', data)
  
  // Store token in localStorage
  if (typeof window !== 'undefined') {
      // Try different possible token property names
      const token = data.token || data.accessToken || data.jwtToken || data.jwt || data.access_token
    if (token) {
      localStorage.setItem('token', token)
      
      // Extract and store roles from token
      const roles = extractRolesFromToken(token)
      if (roles.length > 0) {
        localStorage.setItem('userRole', roles[0]) // Store primary role
        localStorage.setItem('userRoles', JSON.stringify(roles)) // Store all roles
      }
      
      // Store user ID if available
        if (data.user?.id || data.userId || data.user_id) {
          localStorage.setItem('userId', data.user?.id || data.userId || data.user_id)
      }
      
      // Store username if available
      if (data.user?.userName || data.username) {
        localStorage.setItem('userName', data.user?.userName || data.username)
      }
    }
  }

  return data
}

/**
 * Logout user
 */
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userRoles')
  }
}

/**
 * Get current user's primary role
 */
export function getUserRole(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userRole')
  }
  return null
}

/**
 * Get all user roles
 */
export function getUserRoles(): string[] {
  if (typeof window !== 'undefined') {
    const roles = localStorage.getItem('userRoles')
    return roles ? JSON.parse(roles) : []
  }
  return []
}

/**
 * Check if user has a specific role
 */
export function hasRole(role: string): boolean {
  const roles = getUserRoles()
  return roles.includes(role)
}

/**
 * Get current username
 */
export function getUserName(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userName')
  }
  return null
}

/**
 * Get current auth token
 */
export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getToken()
}
