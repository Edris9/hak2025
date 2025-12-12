# Testing - Developer Documentation

## Overview

The project uses two testing frameworks:
- **Vitest** - Unit tests for validation, hooks, and utilities
- **Playwright** - End-to-end tests for user flows

## Test Structure

```
Template/
├── src/__tests__/           # Unit tests
│   ├── setup.ts             # Vitest setup
│   └── auth/
│       └── validation.test.ts
├── e2e/                     # E2E tests
│   └── auth.spec.ts
├── vitest.config.ts         # Vitest configuration
└── playwright.config.ts     # Playwright configuration
```

## Running Tests

```bash
# Unit tests
npm run test          # Watch mode
npm run test:run      # Single run
npm run test:coverage # With coverage

# E2E tests
npm run test:e2e      # Headless
npm run test:e2e:ui   # Interactive UI
```

## Unit Tests (Vitest)

### Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
  },
});
```

### Setup File

The setup file (`src/__tests__/setup.ts`) mocks:
- `next/navigation` (useRouter, usePathname)
- `next-themes` (useTheme)

### Test Examples

#### Validation Schema Test

```typescript
describe('loginSchema', () => {
  it('should validate correct credentials', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'Password123',
    });
    expect(result.success).toBe(true);
  });
});
```

## E2E Tests (Playwright)

### Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './e2e',
  baseURL: 'http://localhost:3000',
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
  },
});
```

### Test Structure

E2E tests follow this pattern:
1. **Happy Path** - Successful user flows
2. **Error Scenarios** - Validation and API errors
3. **Navigation** - Link testing

### Test Example

```typescript
test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('Password123');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL('/dashboard');
  });
});
```

## Test Coverage

### Unit Tests Cover

- Login validation schema
- Register validation schema
- Password requirements
- Email format validation

### E2E Tests Cover

| Flow | Happy Path | Error Scenarios |
|------|------------|-----------------|
| Login | Valid credentials | Empty fields, invalid format, wrong credentials |
| Register | New user signup | Validation errors, duplicate email |
| Logout | Successful logout | - |

## Adding New Tests

### Unit Test

```typescript
// src/__tests__/feature/feature.test.ts
import { describe, it, expect } from 'vitest';

describe('Feature', () => {
  it('should work correctly', () => {
    expect(true).toBe(true);
  });
});
```

### E2E Test

```typescript
// e2e/feature.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Feature', () => {
  test('should work correctly', async ({ page }) => {
    await page.goto('/feature');
    await expect(page).toHaveURL('/feature');
  });
});
```

## CI Integration

For CI environments, set `CI=true` to:
- Run tests once (not watch mode)
- Fail on `test.only`
- Add retries for flaky tests
