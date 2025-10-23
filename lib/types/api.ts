/**
 * API Types and Interfaces for FCMS
 * Generated from Swagger spec: https://surveysoftware.azurewebsites.net/swagger/index.html
 */

// ============================================
// Common Types
// ============================================

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  statusCode?: number
}

// ============================================
// Authentication
// ============================================

export interface LoginRequest {
  username: string | null
  password: string | null
}

export interface RegisterRequest {
  username: string | null
  email: string | null
  password: string | null
  role?: string | null
}

export interface AddToRoleRequest {
  username: string | null
  roleName: string | null
}

export interface RemoveFromRoleRequest {
  username: string | null
  roleName: string | null
}

export interface UpdateUserRequest {
  id: string
  userName?: string | null
  email?: string | null
  phoneNumber?: string | null
  emailConfirmed?: boolean
  phoneNumberConfirmed?: boolean
  twoFactorEnabled?: boolean
  lockoutEnabled?: boolean
}

// ============================================
// User & Role
// ============================================

export interface UserDto {
  id: string | null
  userName: string | null
  email: string | null
  emailConfirmed: boolean
  phoneNumber: string | null
  phoneNumberConfirmed: boolean
  twoFactorEnabled: boolean
  lockoutEnd: string | null
  lockoutEnabled: boolean
  accessFailedCount: number
}

export interface Role {
  id: string | null
  name: string | null
  normalizedName: string | null
  concurrencyStamp: string | null
}

// ============================================
// Property
// ============================================

export interface PropertyDto {
  id: number
  name: string | null
  address: string | null
  createdAt: string
  updatedAt: string | null
}

// ============================================
// Unit
// ============================================

export interface UnitDto {
  id: number
  propertyId: number
  unitNumber: string | null
  floor: string | null
  sizeSqM: number | null
  isOccupied: boolean
  createdAt: string
  updatedAt: string | null
}

// ============================================
// Owner
// ============================================

export interface OwnerDto {
  id: number
  userId: string | null
  contactNumber: string | null
  createdAt: string
}

export interface OwnerUnitDto {
  id: number
  ownerId: number
  unitId: number
  ownershipStart: string
  ownershipEnd: string | null
}

// ============================================
// Tenant
// ============================================

export interface TenantDto {
  id: number
  userId: string | null
  unitId: number
  leaseStart: string
  leaseEnd: string | null
  contactNumber: string | null
  createdAt: string
}

// ============================================
// Payment
// ============================================

export interface PaymentDto {
  id: number
  tenantId: number | null
  ownerId: number | null
  unitId: number
  amount: number
  paymentDate: string
  method: string | null
  reference: string | null
}

// ============================================
// Expense
// ============================================

export interface ExpenseDto {
  id: number
  propertyId: number
  description: string | null
  amount: number
  expenseDate: string
  category: string | null
}

// ============================================
// Service Request
// ============================================

export interface ServiceRequestDto {
  id: number
  unitId: number
  requestedBy: string | null
  providerId: number | null
  description: string | null
  status: string | null
  requestDate: string
  completionDate: string | null
}

// ============================================
// Service Provider
// ============================================

export interface ServiseProviderDto {
  id: number
  userId: string | null
  companyName: string | null
  serviceType: string | null
  contactNumber: string | null
}

export interface ProviderReceiptDto {
  id: number
  providerId: number
  jobDescription: string | null
  amount: number
  receiptDate: string
}

// ============================================
// Visitor
// ============================================

export interface VisitorDto {
  id: number
  unitId: number | null
  name: string | null
  contactNumber: string | null
  visitReason: string | null
  checkIn: string
  checkOut: string | null
  createdBy: string | null
}

// ============================================
// Security Personnel
// ============================================

export interface SecurityPersonnelDto {
  id: number
  userId: string | null
  contactNumber: string | null
  shiftStart: string | null
  shiftEnd: string | null
}

// ============================================
// Report
// ============================================

export interface ReportDto {
  id: number
  generatedBy: string | null
  role: string | null
  reportType: string | null
  content: string | null
  createdAt: string
}

// ============================================
// Compliance Record
// ============================================

export interface ComplianceRecordDto {
  id: number
  propertyId: number
  authorityUserId: string | null
  complianceType: string | null
  status: string | null
  reportDate: string
  remarks: string | null
}
