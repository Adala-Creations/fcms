# FCMS (Flat/Complex Management System) - Project Documentation

## 📋 Project Overview
A comprehensive Next.js-based property management system with role-based access for different stakeholders in property management.

## 🏗️ Architecture & Tech Stack
- **Framework**: Next.js 14.2.32 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Language**: TypeScript
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: React useState hooks

## 👥 User Roles & Access Levels

### 1. Admin/Committee
- **Dashboard**: `/admin/dashboard` - Overview of all properties and activities
- **Users**: `/admin/users` - User management
- **Units**: `/admin/units` - Unit management
- **Payments**: `/admin/payments` - Payment tracking
- **Expenses**: `/admin/expenses` - Expense management
- **Visitors**: `/admin/visitors` - Visitor management
- **Service Providers**: `/admin/providers` - Provider management
- **Reports**: `/admin/reports` - Analytics and reports
- **Settings**: `/admin/settings` - System settings
- **Profile**: `/admin/profile` - Admin profile management

### 2. Property Owner
- **Dashboard**: `/owner/dashboard` - Property overview
- **My Units**: `/owner/units` - Owned units management
- **Payments**: `/owner/payments` - Payment tracking
- **Visitors**: `/owner/visitors` - Visitor management
- **Service Requests**: `/owner/requests` - Service request tracking
- **Reports**: `/owner/reports` - Property reports
- **Profile**: `/owner/profile` - Owner profile
- **Settings**: `/owner/settings` - Account settings

### 3. Tenant
- **Dashboard**: `/tenant/dashboard` - Personal dashboard
- **My Unit**: `/tenant/unit` - Unit details
- **Payments**: `/tenant/payments` - Payment management
- **Visitors**: `/tenant/visitors` - Visitor management
- **Service Requests**: `/tenant/requests` - Service requests
- **Profile**: `/tenant/profile` - Tenant profile
- **Settings**: `/tenant/settings` - Account settings

### 4. Service Provider
- **Dashboard**: `/provider/dashboard` - Job overview
- **My Jobs**: `/provider/jobs` - Job management
- **Receipts**: `/provider/receipts` - Receipt management
- **Profile**: `/provider/profile` - Provider profile
- **Settings**: `/provider/settings` - Account settings

### 5. Security Personnel
- **Dashboard**: `/security/dashboard` - Security overview
- **Visitor Scanner**: `/security/scanner` - QR code scanner
- **Visitor Logs**: `/security/logs` - Visitor activity logs
- **Profile**: `/security/profile` - Security profile
- **Settings**: `/security/settings` - Account settings

### 6. Authority/Regulatory
- **Dashboard**: `/authority/dashboard` - Compliance overview
- **Reports**: `/authority/reports` - Regulatory reports
- **Compliance**: `/authority/compliance` - Compliance tracking
- **Profile**: `/authority/profile` - Authority profile
- **Settings**: `/authority/settings` - Account settings

## 🔐 Authentication System

### Landing Page
- **Route**: `/` - Role selection page
- **Features**: 6 role cards with navigation to respective sign-in pages

### Sign-In Pages
- **Admin**: `/admin/signin`
- **Owner**: `/owner/signin`
- **Tenant**: `/tenant/signin`
- **Provider**: `/provider/signin`
- **Security**: `/security/signin`
- **Authority**: `/authority/signin`

### Sign-Up Pages
- **Admin**: `/admin/signup`
- **Owner**: `/owner/signup`
- **Tenant**: `/tenant/signup`
- **Provider**: `/provider/signup`
- **Security**: `/security/signup`
- **Authority**: `/authority/signup`

### Forgot Password Pages
- **Admin**: `/admin/forgot-password`
- **Owner**: `/owner/forgot-password`
- **Tenant**: `/tenant/forgot-password`
- **Provider**: `/provider/forgot-password`
- **Security**: `/security/forgot-password`
- **Authority**: `/authority/forgot-password`

## 🎨 UI Components & Layout

### Layout System
- **Root Layout**: `app/layout.tsx` - Global layout with metadata
- **Role Layouts**: Each role has its own layout in `app/{role}/layout.tsx`
- **Auth Layout**: `components/layout/auth-layout.tsx` - Authentication pages layout
- **Sidebar**: `components/layout/sidebar.tsx` - Navigation sidebar
- **Header**: `components/layout/header.tsx` - Page headers

### Key Features
- **Responsive Design**: Mobile-first approach with collapsible navigation
- **Role-Based Navigation**: Different menu items for each role
- **Profile Management**: Avatar dropdown with profile and settings access
- **Sign Out**: Returns to landing page
- **Mobile Hamburger Menu**: Properly aligned for smaller screens

## 📱 Responsive Design Features

### Mobile Optimizations
- **Collapsible Sidebar**: Hidden on mobile, accessible via hamburger menu
- **Touch-Friendly**: Proper button sizing and spacing
- **Flexible Grids**: Responsive card layouts
- **Text Truncation**: Prevents text overflow in cards

### Desktop Features
- **Fixed Sidebar**: Always visible on large screens
- **Profile Dropdown**: Click avatar for profile options
- **Search Bar**: Available in header
- **Notification Bell**: With badge count

## 🗂️ File Structure

```
app/
├── globals.css                 # Global styles and CSS variables
├── layout.tsx                  # Root layout
├── page.tsx                    # Landing page
├── admin/                      # Admin role pages
│   ├── layout.tsx             # Admin layout with sidebar
│   ├── dashboard/             # Admin dashboard
│   ├── users/                 # User management
│   ├── units/                 # Unit management
│   ├── payments/              # Payment tracking
│   ├── expenses/              # Expense management
│   ├── visitors/              # Visitor management
│   ├── providers/             # Service provider management
│   ├── reports/               # Analytics and reports
│   ├── settings/              # System settings
│   ├── profile/               # Admin profile
│   ├── signin/                # Admin sign-in
│   ├── signup/                # Admin sign-up
│   └── forgot-password/       # Admin forgot password
├── owner/                     # Owner role pages
├── tenant/                    # Tenant role pages
├── provider/                  # Service provider pages
├── security/                  # Security personnel pages
└── authority/                 # Authority/regulatory pages

components/
├── layout/
│   ├── sidebar.tsx            # Navigation sidebar
│   ├── header.tsx             # Page headers
│   └── auth-layout.tsx        # Authentication layout
└── ui/                        # shadcn/ui components

lib/
└── utils.ts                   # Utility functions
```

## 🎯 Key Features Implemented

### Dashboard Features
- **Overview Cards**: Key metrics and statistics
- **Charts**: Bar charts, pie charts for data visualization
- **Recent Activities**: Activity feeds
- **Quick Actions**: Common tasks and shortcuts

### Profile Management
- **Profile Pictures**: Avatar upload functionality
- **Personal Information**: Name, email, phone, etc.
- **Role-Specific Details**: Custom fields for each role
- **Form Validation**: Client-side validation

### Settings Management
- **Password Management**: Change password with confirmation
- **Notification Preferences**: Email, SMS, push notifications
- **Role-Specific Settings**: Customized for each user type
- **Privacy Controls**: Data sharing and visibility options

### Navigation System
- **Role-Based Menus**: Different navigation for each role
- **Breadcrumbs**: Clear navigation hierarchy
- **Active States**: Visual indication of current page
- **Mobile Navigation**: Hamburger menu for mobile devices

## 🚀 Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 🔧 Configuration Files

### Next.js Configuration
- **File**: `next.config.js`
- **Features**: SWC compiler, image optimization

### Tailwind Configuration
- **File**: `tailwind.config.js`
- **Features**: Custom colors, animations, dark mode support

### Package Dependencies
- **File**: `package.json`
- **Key Dependencies**: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui

## 📊 Data Management

### Mock Data
- All pages currently use mock data for demonstration
- Data structures defined for each role's specific needs
- Ready for backend integration

### State Management
- React useState hooks for component state
- No global state management currently implemented
- Ready for Redux, Zustand, or Context API integration

## 🎨 Design System

### Color Scheme
- **Primary**: Blue tones for main actions
- **Success**: Green for positive actions
- **Warning**: Yellow/Orange for warnings
- **Danger**: Red for errors and destructive actions
- **Secondary**: Gray tones for secondary elements

### Typography
- **Headings**: Clear hierarchy with proper font weights
- **Body Text**: Readable font sizes and line heights
- **Code**: Monospace font for technical content

### Components
- **Cards**: Consistent padding and shadows
- **Buttons**: Multiple variants (primary, secondary, ghost)
- **Forms**: Proper labeling and validation states
- **Navigation**: Clear active states and hover effects

## 🔮 Future Enhancements

### Backend Integration
- API endpoints for all CRUD operations
- Authentication and authorization
- Database integration (PostgreSQL, MongoDB, etc.)
- File upload for profile pictures

### Advanced Features
- Real-time notifications
- Advanced reporting and analytics
- Mobile app development
- Payment gateway integration
- Email/SMS notification services

### Performance Optimizations
- Image optimization
- Code splitting
- Caching strategies
- SEO optimization

## 📝 Development Notes

### Recent Changes
1. **Profile Management**: Added profile and settings pages for all roles
2. **Navigation**: Enhanced sidebar with profile dropdown
3. **Authentication**: Created sign-in, sign-up, and forgot password pages
4. **Responsive Design**: Fixed mobile navigation and text overflow issues
5. **UI Improvements**: Consistent styling and better user experience

### Known Issues
- Build process may have permission issues on Windows
- Some TypeScript errors may need resolution
- Mock data needs to be replaced with real API calls

### Next Steps
1. Implement backend API
2. Add real authentication
3. Connect to database
4. Add real-time features
5. Implement file uploads
6. Add comprehensive testing

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Status**: Development Phase
