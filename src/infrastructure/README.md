# Infrastructure Layer

## Overview

The **Infrastructure Layer** contains implementations of external concerns - databases, APIs, external services, and framework-specific code. This layer implements the interfaces defined in the domain layer.

## Purpose

- Implement repository interfaces from the domain layer
- Configure HTTP clients and API communication
- Handle external service integrations
- Manage data persistence (when connected to a real database)

## Structure

```
infrastructure/
├── api/                    # HTTP client configuration
│   ├── axiosClient.ts      # Axios instance with interceptors
│   └── index.ts            # Barrel export
├── repositories/           # Repository implementations
│   ├── AuthRepository.ts   # IAuthRepository implementation
│   └── index.ts            # Barrel export
├── services/               # External services (future)
└── README.md               # This file
```

## Key Principles

### 1. Implements Domain Interfaces
Repositories implement contracts from `domain/interfaces`.

### 2. Framework-Specific Code
All axios, fetch, database client code lives here.

### 3. Easily Swappable
Implementations can be replaced without affecting other layers.

## Files Explained

### api/axiosClient.ts

Configured Axios instance with:
- Base URL configuration
- Request interceptor (attaches access token)
- Response interceptor (handles 401, auto-refresh)

```typescript
// Key features:
// 1. Automatic token attachment
axiosClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 2. Automatic token refresh on 401
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Refresh token and retry
    }
  }
);
```

### repositories/AuthRepository.ts

Implements `IAuthRepository` interface using axiosClient.

```typescript
class AuthRepository implements IAuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axiosClient.post('/auth/login', credentials);
    setAccessToken(response.data.accessToken);
    return response.data;
  }
  // ... other methods
}
```

## Token Refresh Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTOMATIC TOKEN REFRESH                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. API Request                                                 │
│     │                                                           │
│     ▼                                                           │
│  2. Request Interceptor                                         │
│     └── Attach: Authorization: Bearer {accessToken}             │
│     │                                                           │
│     ▼                                                           │
│  3. Server Response                                             │
│     │                                                           │
│     ├── 200 OK ──────────────────────▶ Return data              │
│     │                                                           │
│     └── 401 Unauthorized                                        │
│         │                                                       │
│         ▼                                                       │
│  4. Response Interceptor                                        │
│     └── Call POST /api/auth/refresh                             │
│         │                                                       │
│         ├── Success ──▶ Update token ──▶ Retry original request │
│         │                                                       │
│         └── Failure ──▶ Clear auth ──▶ Redirect to /login       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Request Queue (Concurrent 401s)

When multiple requests fail with 401 simultaneously:

```
Request A ──▶ 401 ──┐
Request B ──▶ 401 ──┼──▶ Only ONE refresh call
Request C ──▶ 401 ──┘
                    │
                    ▼
              Refresh Token
                    │
                    ▼
              New Access Token
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
    Retry A     Retry B     Retry C
```

## Connection to Other Layers

### Imports FROM (Dependencies)
- `domain/interfaces` - Implements IAuthRepository
- `domain/models` - Uses User type
- `application/dto` - Uses AuthResponse, LoginCredentials, etc.

### Imported BY (Dependents)
- `presentation/hooks` - Uses authRepository instance

## When to Modify This Layer

- Connecting to a real database (replace mock-db)
- Adding new API endpoints
- Integrating external services (payment, email, etc.)
- Modifying HTTP client behavior

## Replacing Mock with Real Database

To connect a real database:

1. Create database client in `infrastructure/database/`
2. Update `AuthRepository` to use real database
3. Remove `mock-db.ts` from `app/api/auth/`
4. Domain and presentation layers remain unchanged!

```typescript
// Example: Switch to Prisma
class AuthRepository implements IAuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email }
    });
    // ... rest of implementation
  }
}
```

## Best Practices

1. **Single responsibility** - One repository per domain entity
2. **Error handling** - Catch and transform external errors
3. **Configuration** - Environment-based settings
4. **Logging** - Log external interactions for debugging
