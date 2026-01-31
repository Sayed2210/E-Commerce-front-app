# E-Commerce Frontend Authentication System

## Quick Start

### 1. Setup Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env and set backend API URL
# NUXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

### 2. Install & Run

```bash
# Install dependencies (already done)
npm install

# Run development server
npm run dev

# Run tests
npm test
```

### 3. Access the Application

- **User Website:** http://localhost:3000
- **User Login:** http://localhost:3000/login
- **User Register:** http://localhost:3000/register
- **Admin Login:** http://localhost:3000/admin/login
- **Admin Dashboard:** http://localhost:3000/admin

## Features Implemented

### ✅ Dual Authentication System

- **Admin authentication** with role verification
- **User/Customer authentication** for shopping
- Separate login flows and layouts
- Role-based access control (RBAC)

### ✅ Security

- JWT tokens (access + refresh)
- HTTP-only cookies for token storage
- Automatic token refresh on expiration
- Protected routes with middleware
- SSR-safe authentication

### ✅ User Experience

- Form validation with Zod
- Error handling with toast notifications
- Loading states
- Dark mode support
- Responsive design
- Remember me functionality

### ✅ Testing

- 30 unit tests passing
- Vitest test framework
- Coverage reporting
- Mock utilities

## Project Structure

```
app/                              # Nuxt 4 app directory
├── app.vue                       # Root component
├── composables/useAuth.ts        # Main auth logic
├── stores/auth.ts                # Pinia state management
├── middleware/                   # Route protection
│   ├── auth.ts                   # Authenticated routes
│   ├── admin.ts                  # Admin-only routes
│   └── guest.ts                  # Guest-only routes
├── layouts/
│   ├── admin.vue                 # Admin dashboard layout
│   └── default.vue               # User website layout
├── pages/
│   ├── admin/                    # Admin pages
│   │   ├── login.vue
│   │   ├── index.vue
│   │   └── products/index.vue
│   ├── account/index.vue         # User account
│   ├── index.vue                 # Homepage
│   ├── login.vue                 # User login
│   └── register.vue              # User registration
├── utils/
│   ├── api.ts                    # API client
│   ├── token.ts                  # Token management
│   ├── validation.ts             # Form schemas
│   └── errorHandler.ts           # Error utilities
└── types/auth.ts                 # TypeScript types
tests/                            # Unit tests
public/                           # Static assets
```

## Backend API Integration

### Required Endpoints

Your backend should provide these endpoints:

```typescript
POST /auth/login
- Body: { email: string, password: string }
- Response: { user: User, accessToken: string, refreshToken: string }

POST /auth/register
- Body: { email: string, password: string, firstName?: string, lastName?: string }
- Response: { user: User, accessToken: string, refreshToken: string }

POST /auth/refresh
- Body: { refreshToken: string }
- Response: { accessToken: string, refreshToken: string }

POST /auth/logout
- No body required

GET /users/me
- Headers: Authorization: Bearer <token>
- Response: User object
```

### User Object Structure

```typescript
{
  id: string
  email: string
  firstName?: string
  lastName?: string
  roles: ['ADMIN' | 'CUSTOMER']
  createdAt: string
  updatedAt: string
}
```

## Usage Examples

### Admin Login

```typescript
// Navigate to /admin/login
// Enter admin credentials
// System checks for ADMIN role
// Redirects to /admin/dashboard on success
```

### User Registration

```typescript
// Navigate to /register
// Fill registration form
// Click "Create Account"
// Auto-login after successful registration
// Redirects to homepage
```

### Using Auth in Components

```vue
<script setup>
const { user, isAuthenticated, isAdmin, logout } = useAuth()

// Check if logged in
if (isAuthenticated.value) {
  console.log('User:', user.value.email)
}

// Check if admin
if (isAdmin.value) {
  console.log('User is admin')
}

// Logout
function handleLogout() {
  await logout()
}
</script>
```

### Protecting Routes

```vue
<script setup>
// pages/some-page.vue
definePageMeta({
  middleware: 'auth' // Requires authentication
})
</script>
```

```vue
<script setup>
// pages/admin/some-page.vue
definePageMeta({
  middleware: 'admin' // Requires admin role
})
</script>
```

## Testing

### Run Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# UI mode
npm run test:ui

# Coverage report
npm run test:coverage
```

### Test Results

```
✓ tests/stores/auth.test.ts (9 tests)
✓ tests/utils/errorHandler.test.ts (7 tests)
✓ tests/utils/validation.test.ts (8 tests)
✓ tests/composables/useAuth.test.ts (1 test)
✓ tests/utils/token.test.ts (5 tests)

Test Files  5 passed (5)
Tests  30 passed (30)
```

## Environment Variables

Create a `.env` file:

```env
# Backend API URL
NUXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

## Next Steps

1. **Test with Backend:**
   - Start your NestJS backend on port 3000
   - Create test admin and user accounts
   - Test login/logout flows

2. **Add Features:**
   - Products listing and details
   - Shopping cart functionality
   - Order management
   - User profile editing
   - Password reset flow

3. **Deploy:**
   - Build production bundle: `npm run build`
   - Preview: `npm run preview`
   - Deploy to hosting platform

## Documentation

- [Implementation Plan](file:///home/elssayd/.gemini/antigravity/brain/8615adb3-ab3f-4b6f-82cc-c090953d50d3/implementation_plan.md)
- [Walkthrough](file:///home/elssayd/.gemini/antigravity/brain/8615adb3-ab3f-82cc-c090953d50d3/walkthrough.md)
- [Testing Guide](file:///home/elssayd/Downloads/projects/E-Commerce-front-app/TESTING.md)

## Support

For issues or questions:
1. Check the implementation plan for technical details
2. Review the walkthrough for component overview
3. Check the testing guide for test examples
4. Ensure backend API matches expected endpoints
