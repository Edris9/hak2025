# Settings - Developer Documentation

## Overview

The Settings feature provides a comprehensive user preferences system with sidebar navigation, form validation, and API persistence.

## Architecture

```
Settings Feature
├── Domain Layer
│   ├── User Model (preferences, notifications)
│   └── IUserRepository Interface
├── Application Layer
│   └── User DTOs
├── Infrastructure Layer
│   ├── Mock Database (update method)
│   └── UserRepository
├── API Layer
│   ├── /api/user/profile
│   ├── /api/user/password
│   ├── /api/user/preferences
│   └── /api/user/notifications
└── Presentation Layer
    ├── Hooks (useUpdateProfile, etc.)
    ├── Validation Schemas
    ├── Settings Layout
    └── Form Components
```

## File Structure

```
src/
├── domain/models/User.ts           # UserPreferences, NotificationSettings
├── domain/interfaces/IUserRepository.ts
├── application/dto/user.dto.ts
├── infrastructure/repositories/UserRepository.ts
├── app/api/user/
│   ├── profile/route.ts
│   ├── password/route.ts
│   ├── preferences/route.ts
│   └── notifications/route.ts
├── app/(dashboard)/settings/
│   ├── layout.tsx                  # Settings sidebar navigation
│   ├── page.tsx                    # Redirects to /account
│   ├── account/page.tsx
│   ├── notifications/page.tsx
│   ├── appearance/page.tsx
│   └── security/page.tsx
└── presentation/
    ├── hooks/
    │   ├── useUpdateProfile.ts
    │   ├── useChangePassword.ts
    │   ├── useUpdatePreferences.ts
    │   └── useUpdateNotifications.ts
    ├── utils/settings-validation.ts
    └── components/settings/
        ├── AccountForm.tsx
        ├── NotificationsForm.tsx
        ├── AppearanceForm.tsx
        └── SecurityForm.tsx
```

## Data Models

### UserPreferences

```typescript
interface UserPreferences {
  language: 'en' | 'sv' | 'de' | 'fr' | 'es';
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
  theme: 'light' | 'dark' | 'system';
}
```

### NotificationSettings

```typescript
interface NotificationSettings {
  emailNotifications: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
}
```

## API Endpoints

### PUT /api/user/profile

Update user profile information.

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string"
}
```

**Response:**
```json
{
  "user": { ... },
  "message": "Profile updated successfully"
}
```

### PUT /api/user/password

Change user password.

**Request Body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Response:**
```json
{
  "message": "Password changed successfully"
}
```

### PUT /api/user/preferences

Update user preferences.

**Request Body:**
```json
{
  "language": "en",
  "dateFormat": "MM/DD/YYYY",
  "timeFormat": "12h",
  "theme": "system"
}
```

### PUT /api/user/notifications

Update notification settings.

**Request Body:**
```json
{
  "emailNotifications": true,
  "marketingEmails": false,
  "securityAlerts": true
}
```

## Hooks

### useUpdateProfile

```typescript
const { mutate, isPending, error, isSuccess } = useUpdateProfile();

mutate({ firstName, lastName, email });
```

### useChangePassword

```typescript
const { mutate, isPending, error, isSuccess } = useChangePassword();

mutate({ currentPassword, newPassword });
```

### useUpdatePreferences

```typescript
const { mutate, isPending } = useUpdatePreferences();

mutate({ theme: 'dark' });
```

### useUpdateNotifications

```typescript
const { mutate, isPending } = useUpdateNotifications();

mutate({ emailNotifications: true });
```

## Validation Schemas

```typescript
// Profile validation
updateProfileSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email(),
});

// Password validation
changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword);
```

## Authentication

All API endpoints require a valid access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

The token is extracted and validated in each route handler:

```typescript
function getUserIdFromToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7);
  return mockDb.accessTokens.get(token) || null;
}
```

## Extending Settings

### Adding a New Settings Page

1. Create the page in `src/app/(dashboard)/settings/[name]/page.tsx`
2. Create the form component in `src/presentation/components/settings/`
3. Add the navigation item to `settings/layout.tsx`
4. Add API endpoint if needed
5. Create hook for API calls
6. Add validation schema

### Adding a New Preference

1. Update `UserPreferences` in `src/domain/models/User.ts`
2. Update `defaultPreferences` constant
3. Add validation in API route
4. Update `AppearanceForm` component

## Testing

Settings functionality can be tested through:
- Manual testing via UI
- API testing with tools like Postman
- E2E tests with Playwright (extend auth.spec.ts)
