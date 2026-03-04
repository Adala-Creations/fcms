/**
 * API Proxy to bypass CORS issues
 * 
 * All requests to /api/proxy/* will be forwarded to the backend
 * Example: /api/proxy/Units -> https://surveysoftware.azurewebsites.net/api/Units
 */

import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_API_URL || 'https://fcms.pindah.co.zw'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'GET')
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'POST')
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'PUT')
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'DELETE')
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'PATCH')
}

async function proxyRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string
) {
  try {
    // Build the backend URL
    const path = pathSegments.join('/')
    const backendUrl = `${BACKEND_URL}/api/${path}`
    
    // Get search params from the original request
    const searchParams = request.nextUrl.searchParams.toString()
    const fullUrl = searchParams ? `${backendUrl}?${searchParams}` : backendUrl

    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization')
    // Server debug: log incoming proxy request and auth header (if any)
    try {
      // eslint-disable-next-line no-console
      console.log('Proxy incoming ->', { method, fullUrl, auth: authHeader ? `${authHeader.split(' ')[0]} ****` : null })
    } catch (e) {
      // ignore
    }
    
    // Build headers for backend request
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (authHeader) {
      headers['Authorization'] = authHeader
    }

    // Get request body for POST/PUT/PATCH
    let body: string | undefined = undefined
    if (method !== 'GET' && method !== 'DELETE') {
      try {
        const requestBody = await request.text()
        if (requestBody) {
          body = requestBody
        }
      } catch (e) {
        // No body or invalid body
      }
    }

    // Make the request to backend
    const response = await fetch(fullUrl, {
      method,
      headers,
      body,
    })

    // Server debug: log backend response status
    try {
      // eslint-disable-next-line no-console
      console.log('Proxy backend response ->', { url: fullUrl, status: response.status, contentType: response.headers.get('content-type') })
    } catch (e) {
      // ignore
    }

    // Handle empty responses (like 204 No Content for DELETE)
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return new NextResponse(null, {
        status: response.status,
      })
    }

    // Get response data
    const contentType = response.headers.get('content-type')
    const data = await response.text()
    
    // Return response with same status code
    return new NextResponse(data || null, {
      status: response.status,
      headers: {
        'Content-Type': contentType || 'application/json',
      },
    })
  } catch (error: any) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Proxy request failed', message: error.message },
      { status: 500 }
    )
  }
}
