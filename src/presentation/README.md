# Presentation Layer

## Overview

The **Presentation Layer** contains all UI-related code - React components, hooks, providers, and utilities. This layer is responsible for user interaction and displaying data.

## Purpose

- Build reusable UI components
- Manage UI state with hooks
- Provide context for global state (auth, theme, etc.)
- Handle form validation and user input

## Structure

```
presentation/
├── components/           # Reusable UI components
│   └── auth/             # Authentication components
│       ├── AuthCard.tsx      # Card wrapper for auth forms
│       ├── LoginForm.tsx     # Login form component
│       ├── RegisterForm.tsx  # Registration form component
│       └── index.ts          # Barrel export
├── hooks/                # Custom React hooks
│   ├── useAuth.ts        # Combined auth hook
│   ├── useLogin.ts       # Login mutation hook
│   ├── useLogout.ts      # Logout mutation hook
│   ├── useRegister.ts    # Register mutation hook
│   └── index.ts          # Barrel export
├── providers/            # React context providers
│   ├── AuthProvider.tsx  # Authentication context
│   ├── QueryProvider.tsx # TanStack Query provider
│   └── index.ts          # Barrel export
├── utils/                # UI utilities
│   ├── validation.ts     # Zod validation schemas
│   └── index.ts          # Barrel export
└── README.md             # This file
```

## Key Principles

### 1. Component Composition
Small, focused components that compose into larger features.

### 2. Hooks for Logic
Business logic extracted into reusable hooks.

### 3. Provider Pattern
Global state managed through React Context.

### 4. Separation of Concerns
Components handle rendering, hooks handle logic.

## Files Explained

### components/auth/

**AuthCard.tsx** - Reusable card wrapper for auth pages
```typescript
<AuthCard title="Welcome back" description="Sign in to continue">
  <LoginForm />
</AuthCard>
```

**LoginForm.tsx** - Complete login form with:
- Form state management (react-hook-form)
- Validation (zod)
- API integration (useLogin hook)
- Error display
- Loading states

**RegisterForm.tsx** - Registration form with same features.

### hooks/

**useAuth.ts** - Combined hook for all auth operations:
```typescript
const {
  user,              // Current user or null
  isAuthenticated,   // Boolean
  login,             // Login function
  register,          // Register function
  logout,            // Logout function
  isLoginPending,    // Loading state
} = useAuth();
```

**useLogin.ts** - TanStack Query mutation for login:
```typescript
const { mutate: login, isPending, error } = useLogin();
login({ email, password });
```

### providers/

**AuthProvider.tsx** - Manages authentication state:
- Current user
- Access token (in memory)
- Auth helpers (setAuth, clearAuth)

**QueryProvider.tsx** - Configures TanStack Query:
- Default stale time
- Retry logic
- Cache settings

### utils/validation.ts

Zod schemas for form validation:
```typescript
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});
```

## Component Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     LOGIN FLOW EXAMPLE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  LoginPage (app/login/page.tsx)                                 │
│      │                                                          │
│      └──▶ AuthCard (presentation/components/auth)               │
│              │                                                  │
│              └──▶ LoginForm (presentation/components/auth)      │
│                      │                                          │
│                      ├── Uses: useLogin hook                    │
│                      │         │                                │
│                      │         └──▶ authRepository.login()      │
│                      │                   │                      │
│                      │                   └──▶ API call          │
│                      │                                          │
│                      ├── Uses: useForm (react-hook-form)        │
│                      │                                          │
│                      └── Uses: loginSchema (zod validation)     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## State Management

```
┌─────────────────────────────────────────────────────────────────┐
│                      STATE ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐                     │
│  │  AuthProvider   │    │  QueryProvider  │                     │
│  │  (Auth State)   │    │  (Server State) │                     │
│  └────────┬────────┘    └────────┬────────┘                     │
│           │                      │                              │
│           ▼                      ▼                              │
│  ┌─────────────────────────────────────────┐                    │
│  │           useAuth Hook                   │                   │
│  │  Combines: AuthContext + Query Mutations │                   │
│  └─────────────────────────────────────────┘                    │
│                      │                                          │
│                      ▼                                          │
│  ┌─────────────────────────────────────────┐                    │
│  │              Components                  │                   │
│  │  LoginForm, RegisterForm, Dashboard      │                   │
│  └─────────────────────────────────────────┘                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Connection to Other Layers

### Imports FROM (Dependencies)
- `domain/models` - User type for auth state
- `application/dto` - LoginCredentials, RegisterData, etc.
- `infrastructure/repositories` - authRepository
- `infrastructure/api` - setAccessToken
- `components/ui` - shadcn/ui components

### Imported BY (Dependents)
- `app/` - Pages import components and hooks

## When to Modify This Layer

- Adding new UI components
- Creating new hooks for features
- Adding form validation schemas
- Modifying global state providers

## Best Practices

1. **Max 150 lines per component** - Extract to smaller components
2. **Hooks for logic** - Keep components focused on rendering
3. **Co-locate related files** - Component + hook + types together
4. **Barrel exports** - Clean imports via index.ts files
5. **Type everything** - Full TypeScript coverage
