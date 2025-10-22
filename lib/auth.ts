/**
 * Authentication utilities for FCMS
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export interface LoginResponse {
  token?: string
  accessToken?: string
  user?: {
    id: string
    email: string
    role: string
  }
}

/**
 * Login user with email and password
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/proxy/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: email, password }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Login failed' }))
    throw new Error(error.message || 'Login failed')
  }

  const data = await response.json()
  
  // Store token in localStorage
  if (typeof window !== 'undefined') {
    const token = data.token || data.accessToken
    if (token) {
      localStorage.setItem('token', token)
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
  }
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
