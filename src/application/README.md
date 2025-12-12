# Application Layer

## Overview

The **Application Layer** contains application-specific business rules. It orchestrates the flow of data between the domain layer and outer layers through DTOs (Data Transfer Objects) and use cases.

## Purpose

- Define DTOs for data transfer between layers
- Implement use cases (application-specific business logic)
- Transform data between domain entities and external representations

## Structure

```
application/
├── dto/              # Data Transfer Objects
│   ├── auth.dto.ts   # Authentication DTOs
│   └── index.ts      # Barrel export
├── use-cases/        # Application business logic (future)
│   └── auth/         # Auth-related use cases
└── README.md         # This file
```

## Key Principles

### 1. Orchestration
Coordinates between domain entities and infrastructure services.

### 2. DTOs as Contracts
DTOs define the shape of data flowing in and out of the application.

### 3. Use Case Driven
Each use case represents a specific application action.

## Files Explained

### dto/auth.dto.ts

Defines data structures for authentication operations.

```typescript
// Input DTOs (what the user sends)
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Output DTOs (what the API returns)
interface AuthResponse {
  user: User;
  accessToken: string;
  expiresIn: number;
}

interface RefreshResponse {
  accessToken: string;
  expiresIn: number;
}

// Error DTOs
interface ApiError {
  code: string;
  message: string;
  field?: string;
}
```

## Data Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   User Input                                                     │
│       │                                                          │
│       ▼                                                          │
│   ┌─────────────────┐                                            │
│   │  Input DTO      │  LoginCredentials, RegisterData            │
│   │  (Validation)   │                                            │
│   └────────┬────────┘                                            │
│            │                                                     │
│            ▼                                                     │
│   ┌─────────────────┐     ┌─────────────────┐                    │
│   │   Use Case      │────▶│  Domain Layer   │                    │
│   │  (Orchestrate)  │◀────│  (Entities)     │                    │
│   └────────┬────────┘     └─────────────────┘                    │
│            │                                                     │
│            ▼                                                     │
│   ┌─────────────────┐                                            │
│   │  Output DTO     │  AuthResponse, RefreshResponse             │
│   │  (Transform)    │                                            │
│   └────────┬────────┘                                            │
│            │                                                     │
│            ▼                                                     │
│   API Response                                                   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Connection to Other Layers

### Imports FROM (Dependencies)
- `domain/models` - Uses domain entities in DTOs

### Imported BY (Dependents)
- `infrastructure/repositories` - Uses DTOs for API contracts
- `presentation/hooks` - Uses DTOs for type safety
- `app/api` - Uses DTOs for request/response typing

## Authentication Flow Example

```
1. User fills login form
   │
   ▼
2. LoginCredentials DTO created
   { email: "test@example.com", password: "Password123" }
   │
   ▼
3. Repository receives DTO, calls API
   │
   ▼
4. API validates, returns AuthResponse DTO
   { user: {...}, accessToken: "...", expiresIn: 900 }
   │
   ▼
5. Hook receives response, updates auth state
```

## When to Modify This Layer

- Adding new DTOs for new features
- Creating use cases for complex business logic
- Adding validation rules at the application level

## Best Practices

1. **DTOs are immutable** - Don't modify after creation
2. **Separate input/output** - Different DTOs for requests vs responses
3. **Include error types** - Standardize error responses
4. **Keep use cases focused** - One responsibility per use case
