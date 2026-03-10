# FCMS - Flat/Complex Management System

A comprehensive web-based management system for residential complexes and flats built with Next.js, TypeScript, and Tailwind CSS.

## Overview

The Flat/Complex Management System (FCMS) is designed to streamline financial management, enhance security, and provide a centralized platform for communication between owners, tenants, management committees, and service providers in residential complexes.

## Features

### 🏢 Multi-Role Dashboard System
- **Admin/Committee**: Full system access for property management
- **Property Owner**: Manage properties and view financials
- **Tenant**: Pay rent, request services, manage visitors
- **Service Provider**: Manage service requests and upload receipts
- **Security Personnel**: Scan visitor codes and manage access
- **Authority**: View reports and compliance data

### 💰 Financial Management
- Track levies, rent, and contributions
- Automated payment reminders
- Multiple payment methods (EcoCash, Bank Transfer, PayPal, Cash)
- Expense recording with receipt uploads
- Financial reporting and analytics

### 🔐 Access Control
- Digital visitor access codes
- QR code generation and scanning
- Visitor history logs
- Security guard interface

### 🔧 Service Management
- Directory of vetted service providers
- Service request tracking
- Job assignment and completion
- Provider rating system

### 📊 Reports & Analytics
- Income vs expenses tracking
- Outstanding balance reports
- Defaulter tracking
- Compliance monitoring
- Exportable PDF/Excel reports

## Technology Stack

- **Frontend**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date Handling**: date-fns

## Project Structure

```
fcms/
├── app/                          # Next.js App Router
│   ├── admin/                   # Admin dashboard and management
│   ├── owner/                   # Property owner interface
│   ├── tenant/                  # Tenant interface
│   ├── provider/                # Service provider interface
│   ├── security/                # Security personnel interface
│   ├── authority/               # Regulatory authority interface
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page with role selection
├── components/                   # Reusable UI components
│   ├── layout/                  # Layout components (sidebar, header)
│   └── ui/                      # Base UI components
├── lib/                         # Utility functions
└── public/                      # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fcms
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Credentials & Authentication

**There are no hardcoded default credentials.** Users must register to obtain an account:

- **Admin**: Register at `/admin/signup` or use the first account created via `/api/Authentication/register`. The **first user ever registered** is automatically assigned the Admin role.
- **Owner**: Register at `/owner/signup` with role `Owner`. Sign in at `/owner/signin` using your **username** and password (the API uses username for login).
- **Tenant, Service Provider, Security, Authority**: Each has its own signup page; register with the desired role.

**Backend API**: The API expects username and password for login. Ensure `NEXT_PUBLIC_API_URL` points to your running FCMS.API when using real authentication.

## User Roles & Permissions

### Admin/Committee
- Manage users and units
- View all payments and expenses
- Approve expenses and service requests
- Generate visitor codes
- Access comprehensive reports
- Manage service providers

### Property Owner
- View owned units and tenants
- Track rental income
- Manage lease renewals
- View payment history
- Generate visitor codes for tenants

### Tenant
- Make rent and service payments
- Request maintenance services
- Generate visitor access codes
- View payment history
- Track service requests

### Service Provider
- View assigned jobs
- Update job status
- Upload receipts
- Track earnings
- Manage schedule

### Security Personnel
- Scan visitor QR codes
- View visitor logs
- Manage access control
- Report security issues

### Authority
- View compliance reports
- Monitor financial data
- Track violations
- Generate regulatory reports

## Key Features Implementation

### Payment System
- Multiple payment methods support
- Automated payment tracking
- Receipt generation
- Payment history and analytics

### Visitor Management
- QR code generation for visitors
- Real-time visitor tracking
- Security guard scanning interface
- Visitor history and logs

### Service Management
- Service provider directory
- Job assignment and tracking
- Rating and review system
- Receipt and invoice management

### Reporting System
- Financial reports and analytics
- Compliance monitoring
- Defaulter tracking
- Exportable reports

## Responsive Design

The application is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile phones
- Different screen sizes and orientations

## Future Enhancements

- Real-time notifications
- Mobile app development
- Advanced analytics dashboard
- Integration with external payment gateways
- Automated compliance checking
- Document management system

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Note**: This is a frontend prototype. Backend integration and real data persistence would need to be implemented for a production system.

## Backend configuration

To point the frontend at your backend API, set the public environment variable `NEXT_PUBLIC_API_URL` in `.env.local` (this is required so the value is available in the browser). Example shown in `.env.local.example`.

The codebase includes a small helper at `lib/api-client.ts` which reads `process.env.NEXT_PUBLIC_API_URL` and exposes `apiFetch(path, options)` to call the backend. Use it instead of hardcoded absolute URLs so the API base can be changed per-environment (dev/staging/production).

Example usage:

1. Copy `.env.local.example` to `.env.local` and edit the URL.
2. In a component or page:

```ts
import { apiFetch, setAuthToken } from 'lib/api-client'

// set a runtime token after login
setAuthToken('ey...')

const data = await apiFetch('/api/values')
```

Restart the dev server after editing `.env.local` so Next.js picks up the new environment variables.
