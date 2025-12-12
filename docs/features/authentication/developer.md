# Authentication - Developer Documentation

## Overview

This document covers the technical implementation of authentication in the application.

---

## Architecture

### File Structure

```
src/
├── domain/
│   ├── models/
│   │   └── User.ts              # User entity
│   └── interfaces/
│       └── IAuthRepository.ts   # Auth repository contract
│
├── application/
│   ├── dto/
│   │   └── auth.dto.ts          # Auth DTOs
│   └── use-cases/
│       └── auth/
│           ├── login.ts         # Login use case
│           └── register.ts      # Register use case
│
├── infrastructure/
│   ├── api/
│   │   └── axiosClient.ts       # Configured axios instance
│   └── repositories/
│       └── AuthRepository.ts    # Auth repository implementation
│
├── presentation/
│   ├── hooks/
│   │   └── useAuth.ts           # Auth hook
│   └── components/
│       └── auth/
│           ├── LoginForm.tsx    # Login form component
│           └── RegisterForm.tsx # Register form component
│
└── app/
    ├── (auth)/
    │   ├── login/page.tsx       # Login page
    │   └── register/page.tsx    # Register page
    └── api/auth/
        ├── login/route.ts       # Login endpoint
        ├── register/route.ts    # Register endpoint
        ├── refresh/route.ts     # Refresh token endpoint
        └── logout/route.ts      # Logout endpoint
```

---

## API Endpoints

### POST /api/auth/register

**Request:**
```typescript
{
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
```

**Response (201):**
```typescript
{
  user: User;
  accessToken: string;
  expiresIn: number;
}
```

**Errors:**
- 400: Validation error
- 409: Email already exists

---

### POST /api/auth/login

**Request:**
```typescript
{
  email: string;
  password: string;
}
```

**Response (200):**
```typescript
{
  user: User;
  accessToken: string;
  expiresIn: number;
}
```

**Errors:**
- 400: Validation error
- 401: Invalid credentials

---

### POST /api/auth/refresh

**Request:** No body (uses HTTP-only cookie)

**Response (200):**
```typescript
{
  accessToken: string;
  expiresIn: number;
}
```

**Errors:**
- 401: Invalid or expired refresh token

---

### POST /api/auth/logout

**Request:** No body

**Response (200):**
```typescript
{
  success: true;
}
```

---

## Token Management

### Access Token Flow

1. On login/register, access token received in response body
2. Stored in React context (AuthContext)
3. Attached to requests via axios interceptor
4. On 401, refresh token endpoint called automatically

### Refresh Token Flow

1. Set as HTTP-only cookie on login/register
2. Cookie settings:
   - `httpOnly: true`
   - `secure: true` (production)
   - `sameSite: 'strict'`
   - `path: '/'`
   - `maxAge: 7 days`
3. Automatically sent with requests to /api/auth/refresh

---

## Hooks

### useAuth

```typescript
const {
  user,           // Current user or null
  isLoading,      // Loading state
  isAuthenticated,// Boolean auth status
  login,          // Login mutation
  register,       // Register mutation
  logout,         // Logout mutation
} = useAuth();
```

### useLogin

```typescript
const {
  mutate: login,
  isPending,
  isError,
  error,
} = useLogin();

login({ email, password });
```

### useRegister

```typescript
const {
  mutate: register,
  isPending,
  isError,
  error,
} = useRegister();

register({ email, password, firstName, lastName });
```

---

## Error Handling

### API Error Response Format

```typescript
{
  error: {
    code: string;      // Error code (e.g., 'INVALID_CREDENTIALS')
    message: string;   // Human-readable message
    field?: string;    // Optional field name for validation errors
  }
}
```

### Error Codes

| Code                | HTTP Status | Description              |
|---------------------|-------------|--------------------------|
| VALIDATION_ERROR    | 400         | Invalid input data       |
| INVALID_CREDENTIALS | 401         | Wrong email/password     |
| TOKEN_EXPIRED       | 401         | Access token expired     |
| REFRESH_INVALID     | 401         | Refresh token invalid    |
| EMAIL_EXISTS        | 409         | Email already registered |

---

## Security Considerations

1. **Password Hashing**: Use bcrypt with cost factor 12
2. **Token Signing**: Use RS256 algorithm for JWTs
3. **Rate Limiting**: 5 attempts per minute for login
4. **CORS**: Configured for same-origin only
5. **XSS Prevention**: Tokens never exposed to JavaScript (refresh in cookie)
