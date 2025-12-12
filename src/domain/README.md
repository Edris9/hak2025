# Domain Layer

## Overview

The **Domain Layer** is the innermost layer of Clean Architecture. It contains the core business logic and entities that are independent of any external frameworks, databases, or UI concerns.

## Purpose

- Define the core business entities (models)
- Establish contracts (interfaces) that outer layers must implement
- Contain business rules that are universal to the application

## Structure

```
domain/
├── models/           # Business entities
│   ├── User.ts       # User entity definition
│   └── index.ts      # Barrel export
├── interfaces/       # Repository contracts
│   ├── IAuthRepository.ts  # Authentication repository interface
│   └── index.ts      # Barrel export
└── README.md         # This file
```

## Key Principles

### 1. No External Dependencies
The domain layer should **never** import from outer layers:
- No framework imports (Next.js, React)
- No database libraries
- No HTTP clients

### 2. Pure TypeScript
Only TypeScript types and interfaces - no implementation details.

### 3. Dependency Inversion
Outer layers depend on domain interfaces, not the other way around.

## Files Explained

### models/User.ts

Defines the `User` entity - the core representation of a user in our system.

```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Used by:** Application layer (DTOs), Infrastructure layer (repositories), Presentation layer (components)

### interfaces/IAuthRepository.ts

Defines the contract for authentication operations. Any repository implementation must follow this interface.

```typescript
interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(data: RegisterData): Promise<AuthResponse>;
  refresh(): Promise<RefreshResponse>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}
```

**Implemented by:** `infrastructure/repositories/AuthRepository.ts`

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      OUTER LAYERS                           │
│  (Presentation, Infrastructure, Application)                │
│                          │                                  │
│                          ▼                                  │
│              ┌───────────────────────┐                      │
│              │    Domain Layer       │                      │
│              │  ┌─────────────────┐  │                      │
│              │  │     Models      │  │ ◄── Entities         │
│              │  └─────────────────┘  │                      │
│              │  ┌─────────────────┐  │                      │
│              │  │   Interfaces    │  │ ◄── Contracts        │
│              │  └─────────────────┘  │                      │
│              └───────────────────────┘                      │
│                          ▲                                  │
│                          │                                  │
│              Dependencies point INWARD                      │
└─────────────────────────────────────────────────────────────┘
```

## When to Modify This Layer

- Adding new business entities (e.g., `Product`, `Order`)
- Adding new repository interfaces (e.g., `IProductRepository`)
- Modifying core business rules

## Best Practices

1. **Keep it simple** - Only essential business concepts
2. **No implementation** - Just types and interfaces
3. **Stable core** - Changes here affect all layers
4. **Document contracts** - Clear interface documentation
