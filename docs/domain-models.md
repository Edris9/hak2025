# Domain Models

## Overview

This document describes the core domain entities and their relationships in the application.

---

## User

The central entity representing a registered user in the system.

### Properties

| Property    | Type     | Required | Description                    |
|-------------|----------|----------|--------------------------------|
| id          | string   | Yes      | Unique identifier (UUID)       |
| email       | string   | Yes      | User's email address (unique)  |
| firstName   | string   | Yes      | User's first name              |
| lastName    | string   | Yes      | User's last name               |
| createdAt   | Date     | Yes      | Account creation timestamp     |
| updatedAt   | Date     | Yes      | Last update timestamp          |

### TypeScript Definition

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

---

## Authentication Tokens

### Access Token

Short-lived token for API authentication.

| Property  | Type   | Description                          |
|-----------|--------|--------------------------------------|
| token     | string | JWT token string                     |
| expiresIn | number | Expiration time in seconds (900s)    |

### Refresh Token

Long-lived token for obtaining new access tokens.

| Property  | Type   | Description                          |
|-----------|--------|--------------------------------------|
| token     | string | JWT token string                     |
| expiresIn | number | Expiration time in seconds (604800s) |

### Storage Strategy

- **Access Token**: Stored in memory (React state/context)
- **Refresh Token**: Stored in HTTP-only cookie (secure, sameSite: strict)

---

## DTOs (Data Transfer Objects)

### LoginCredentials

```typescript
interface LoginCredentials {
  email: string;
  password: string;
}
```

### RegisterData

```typescript
interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
```

### AuthResponse

```typescript
interface AuthResponse {
  user: User;
  accessToken: string;
  expiresIn: number;
}
```

---

## Entity Relationships

```
┌─────────────┐
│    User     │
├─────────────┤
│ id          │
│ email       │──────┐
│ firstName   │      │
│ lastName    │      │
│ createdAt   │      │
│ updatedAt   │      │
└─────────────┘      │
                     │
         ┌───────────┴───────────┐
         │                       │
    ┌────▼────┐            ┌─────▼────┐
    │  Login  │            │ Register │
    │ Session │            │  Flow    │
    └─────────┘            └──────────┘
```

---

## Validation Rules

### Email
- Must be valid email format
- Must be unique in system
- Max 255 characters

### Password
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### Names
- Minimum 1 character
- Maximum 50 characters
- Letters only (including unicode)
