# App Layer (Next.js)

## Overview

The **App Layer** is the outermost layer containing Next.js-specific code - pages, layouts, and API routes. This is the entry point of the application where all layers come together.

## Purpose

- Define application routes and pages
- Configure layouts for route groups
- Implement API endpoints (mock or real)
- Wire together all architectural layers

## Structure

```
app/
├── (auth)/               # Auth route group (no /auth in URL)
│   ├── layout.tsx        # Centered layout for auth pages
│   ├── login/
│   │   └── page.tsx      # Login page
│   └── register/
│       └── page.tsx      # Register page
├── api/                  # API routes (backend)
│   └── auth/
│       ├── mock-db.ts    # In-memory mock database
│       ├── login/
│       │   └── route.ts  # POST /api/auth/login
│       ├── register/
│       │   └── route.ts  # POST /api/auth/register
│       ├── refresh/
│       │   └── route.ts  # POST /api/auth/refresh
│       ├── logout/
│       │   └── route.ts  # POST /api/auth/logout
│       └── me/
│           └── route.ts  # GET /api/auth/me
├── dashboard/
│   └── page.tsx          # Protected dashboard page
├── globals.css           # Global styles + Tailwind
├── layout.tsx            # Root layout (providers)
├── page.tsx              # Home page (redirects to /login)
└── README.md             # This file
```

## Key Concepts

### Route Groups `(auth)`

Parentheses create a route group - organizes files without affecting URL:
- `app/(auth)/login/page.tsx` → URL: `/login`
- `app/(auth)/register/page.tsx` → URL: `/register`

### Layouts

Layouts wrap pages and persist across navigation:

```
layout.tsx (root)           ◄── Providers, global styles
└── (auth)/layout.tsx       ◄── Centered container
    └── login/page.tsx      ◄── Login form
```

### API Routes

Server-side endpoints in `app/api/`:
- `route.ts` exports HTTP method handlers
- Runs on server only (secure for secrets)

## Pages Explained

### layout.tsx (Root Layout)

Wraps entire application with providers:
```tsx
<html>
  <body>
    <QueryProvider>      {/* TanStack Query */}
      <AuthProvider>     {/* Auth state */}
        {children}
      </AuthProvider>
    </QueryProvider>
  </body>
</html>
```

### (auth)/layout.tsx

Centers auth pages on screen:
```tsx
<div className="min-h-screen flex items-center justify-center">
  {children}
</div>
```

### (auth)/login/page.tsx

Composes presentation components:
```tsx
<AuthCard title="Welcome back" description="...">
  <LoginForm />
</AuthCard>
```

### dashboard/page.tsx

Protected page showing user info:
```tsx
const { user, logout } = useAuth();
// Display user profile, logout button
```

## API Routes Explained

### POST /api/auth/login

1. Receives `{ email, password }`
2. Validates credentials
3. Finds user in mock database
4. Generates access + refresh tokens
5. Sets refresh token as HTTP-only cookie
6. Returns user + access token

### POST /api/auth/register

1. Receives `{ email, password, firstName, lastName }`
2. Validates all fields
3. Checks email uniqueness
4. Creates user in mock database
5. Generates tokens
6. Returns user + access token

### POST /api/auth/refresh

1. Reads refresh token from cookie
2. Validates token exists in database
3. Rotates tokens (new refresh token)
4. Returns new access token

### POST /api/auth/logout

1. Reads refresh token from cookie
2. Deletes from database
3. Clears cookie

### GET /api/auth/me

1. Validates session via refresh token
2. Returns current user (without password)

## Request/Response Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    FULL REQUEST FLOW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Browser                                                        │
│     │                                                           │
│     │ User clicks "Login"                                       │
│     ▼                                                           │
│  LoginForm (presentation/components)                            │
│     │                                                           │
│     │ form.handleSubmit()                                       │
│     ▼                                                           │
│  useLogin hook (presentation/hooks)                             │
│     │                                                           │
│     │ mutate({ email, password })                               │
│     ▼                                                           │
│  AuthRepository (infrastructure/repositories)                   │
│     │                                                           │
│     │ axiosClient.post('/auth/login', credentials)              │
│     ▼                                                           │
│  API Route (app/api/auth/login/route.ts)                        │
│     │                                                           │
│     │ Validate, authenticate, generate tokens                   │
│     ▼                                                           │
│  Response                                                       │
│     │                                                           │
│     │ { user, accessToken, expiresIn }                          │
│     │ + Set-Cookie: refreshToken                                │
│     ▼                                                           │
│  useLogin onSuccess                                             │
│     │                                                           │
│     │ setAuth(user, accessToken)                                │
│     │ router.push('/dashboard')                                 │
│     ▼                                                           │
│  Dashboard Page                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Mock Database

`api/auth/mock-db.ts` provides in-memory storage:

```typescript
// Users Map: id -> UserWithPassword
const users: Map<string, UserWithPassword> = new Map();

// Refresh Tokens Map: token -> userId
const refreshTokens: Map<string, string> = new Map();

// Pre-seeded test user:
// Email: test@example.com
// Password: Password123
```

**Note:** Data resets on server restart. Replace with real database for production.

## Connection to Other Layers

### Imports FROM (Dependencies)
- `presentation/components` - UI components
- `presentation/hooks` - useAuth, etc.
- `presentation/providers` - QueryProvider, AuthProvider
- `application/dto` - Request/response types
- `domain/models` - User type

### This Layer Is
- The entry point for all requests
- Where Next.js routing is configured
- Where server-side API logic lives

## When to Modify This Layer

- Adding new pages/routes
- Creating new API endpoints
- Modifying layouts
- Changing route structure

## Best Practices

1. **Thin pages** - Pages should compose presentation components
2. **Route groups** - Organize related routes with layouts
3. **API validation** - Always validate input in API routes
4. **HTTP-only cookies** - For sensitive tokens
5. **Proper status codes** - 200, 201, 400, 401, 404, 500
