import { type ClassValue, clsx } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-ZW', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-ZW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('en-ZW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function generateQRCode(visitorId: string): string {
  // In a real app, this would generate an actual QR code
  return `QR-${visitorId}-${Date.now()}`
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'paid':
    case 'completed':
    case 'active':
      return 'text-success-600 bg-success-100'
    case 'pending':
    case 'processing':
      return 'text-warning-600 bg-warning-100'
    case 'overdue':
    case 'failed':
    case 'inactive':
      return 'text-danger-600 bg-danger-100'
    default:
      return 'text-secondary-600 bg-secondary-100'
  }
}
