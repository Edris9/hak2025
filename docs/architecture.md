# Architecture Overview

## Clean Architecture in Next.js

This project follows **Clean Architecture** principles adapted for a Next.js application. The architecture ensures separation of concerns, testability, and maintainability.

## Layer Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                           EXTERNAL WORLD                                │
│                        (Browser, HTTP Clients)                          │
│                                                                         │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   APP LAYER (Next.js)                                        src/app/   │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  • Pages (login, register, dashboard)                           │   │
│   │  • Layouts                                                      │   │
│   │  • API Routes (/api/auth/*)                                     │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   PRESENTATION LAYER                                  src/presentation/ │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  • Components (LoginForm, RegisterForm, AuthCard)               │   │
│   │  • Hooks (useAuth, useLogin, useRegister, useLogout)            │   │
│   │  • Providers (AuthProvider, QueryProvider)                      │   │
│   │  • Utils (validation schemas)                                   │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   INFRASTRUCTURE LAYER                              src/infrastructure/ │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  • API Client (axiosClient with interceptors)                   │   │
│   │  • Repositories (AuthRepository)                                │   │
│   │  • Services (external integrations - future)                    │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   APPLICATION LAYER                                   src/application/  │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  • DTOs (LoginCredentials, AuthResponse, etc.)                  │   │
│   │  • Use Cases (future)                                           │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   DOMAIN LAYER (Core)                                      src/domain/  │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  • Models (User)                                                │   │
│   │  • Interfaces (IAuthRepository)                                 │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Dependency Rule

**Dependencies point INWARD.** Inner layers know nothing about outer layers.

```
App → Presentation → Infrastructure → Application → Domain
                                                      ▲
                                                      │
                                          (innermost, no dependencies)
```

## Layer Responsibilities

| Layer | Responsibility | Example Files |
|-------|---------------|---------------|
| **Domain** | Business entities, contracts | `User.ts`, `IAuthRepository.ts` |
| **Application** | DTOs, use cases | `auth.dto.ts` |
| **Infrastructure** | External implementations | `axiosClient.ts`, `AuthRepository.ts` |
| **Presentation** | UI components, hooks | `LoginForm.tsx`, `useAuth.ts` |
| **App** | Next.js routing, API | `page.tsx`, `route.ts` |

## Complete Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER LOGIN FLOW                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────┐                                                           │
│  │  User    │                                                           │
│  └────┬─────┘                                                           │
│       │ 1. Enters email/password                                        │
│       ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  APP: /login (page.tsx)                                          │   │
│  │  └── Renders AuthCard + LoginForm                                │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│       │                                                                 │
│       │ 2. Form submit                                                  │
│       ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  PRESENTATION: LoginForm.tsx                                     │   │
│  │  └── Validates with Zod schema                                   │   │
│  │  └── Calls useLogin().mutate(credentials)                        │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│       │                                                                 │
│       │ 3. Hook triggers mutation                                       │
│       ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  PRESENTATION: useLogin.ts                                       │   │
│  │  └── Calls authRepository.login(credentials)                     │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│       │                                                                 │
│       │ 4. Repository makes HTTP call                                   │
│       ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  INFRASTRUCTURE: AuthRepository.ts                               │   │
│  │  └── axiosClient.post('/auth/login', credentials)                │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│       │                                                                 │
│       │ 5. HTTP POST to API                                             │
│       ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  APP: /api/auth/login (route.ts)                                 │   │
│  │  └── Validates credentials                                       │   │
│  │  └── Queries mock database                                       │   │
│  │  └── Generates tokens                                            │   │
│  │  └── Sets refresh token cookie                                   │   │
│  │  └── Returns { user, accessToken, expiresIn }                    │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│       │                                                                 │
│       │ 6. Response flows back                                          │
│       ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  PRESENTATION: useLogin.ts (onSuccess)                           │   │
│  │  └── setAuth(user, accessToken)                                  │   │
│  │  └── router.push('/dashboard')                                   │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│       │                                                                 │
│       │ 7. Redirect to dashboard                                        │
│       ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  APP: /dashboard (page.tsx)                                      │   │
│  │  └── useAuth() retrieves user from context                       │   │
│  │  └── Displays user profile                                       │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Token Management Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        TOKEN STORAGE                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ACCESS TOKEN                      REFRESH TOKEN                       │
│   ┌─────────────────────┐           ┌─────────────────────┐             │
│   │  Stored in Memory   │           │  HTTP-only Cookie   │             │
│   │  (React Context)    │           │  (Browser Storage)  │             │
│   └─────────────────────┘           └─────────────────────┘             │
│           │                                   │                         │
│           │                                   │                         │
│   Short-lived (15 min)              Long-lived (7 days)                 │
│           │                                   │                         │
│           │                                   │                         │
│   Attached to every                 Sent automatically                  │
│   API request via                   with credentials                    │
│   Authorization header              to /api/auth/refresh                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Why This Architecture?

### 1. Testability
Each layer can be tested independently with mocked dependencies.

### 2. Maintainability
Changes in one layer don't ripple through the entire codebase.

### 3. Scalability
Easy to add new features following established patterns.

### 4. Flexibility
Infrastructure can be swapped (e.g., mock → real database) without changing business logic.

## Adding New Features

When adding a new feature, follow this checklist:

1. **Domain Layer**
   - [ ] Add new entities to `domain/models/`
   - [ ] Add repository interface to `domain/interfaces/`

2. **Application Layer**
   - [ ] Add DTOs to `application/dto/`
   - [ ] Add use cases if needed

3. **Infrastructure Layer**
   - [ ] Implement repository in `infrastructure/repositories/`
   - [ ] Add API client methods if needed

4. **Presentation Layer**
   - [ ] Create hooks in `presentation/hooks/`
   - [ ] Create components in `presentation/components/`
   - [ ] Add validation schemas

5. **App Layer**
   - [ ] Add pages in `app/`
   - [ ] Add API routes in `app/api/`

6. **Documentation**
   - [ ] Update `docs/features/` with new feature docs
   - [ ] Update CLAUDE.md if significant

## File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `LoginForm.tsx` |
| Hooks | camelCase with `use` prefix | `useAuth.ts` |
| Types/Models | PascalCase | `User.ts` |
| DTOs | camelCase with `.dto` suffix | `auth.dto.ts` |
| API Routes | lowercase with `route` | `route.ts` |
| Utils | camelCase | `validation.ts` |
