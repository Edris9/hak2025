# Testing - User Documentation

## Overview

This document explains the testing strategy for workshop participants who want to understand or extend the tests.

## Test Types

### Unit Tests

Test individual pieces of code in isolation:
- Validation schemas
- Utility functions
- Business logic

### End-to-End (E2E) Tests

Test complete user flows through the browser:
- Login process
- Registration process
- Navigation

## Running Tests

### Unit Tests

```bash
# Run tests in watch mode (re-runs on file changes)
npm run test

# Run tests once
npm run test:run

# Run with coverage report
npm run test:coverage
```

### E2E Tests

```bash
# Run headless (no browser window)
npm run test:e2e

# Run with interactive UI
npm run test:e2e:ui
```

## Test Results

### Unit Tests

After running, you'll see output like:

```
✓ src/__tests__/auth/validation.test.ts (14 tests) 8ms

Test Files  1 passed (1)
     Tests  14 passed (14)
```

### E2E Tests

Results appear in the terminal and an HTML report is generated in `playwright-report/`.

## What's Tested

### Authentication

| Scenario | Type | Description |
|----------|------|-------------|
| Valid login | Happy | Login with correct credentials |
| Invalid email | Error | Empty or malformed email |
| Short password | Error | Password < 8 characters |
| Wrong password | Error | Incorrect password |
| Valid register | Happy | Create new account |
| Weak password | Error | Missing uppercase/number |
| Duplicate email | Error | Email already exists |

## Extending Tests

### Adding Unit Tests

1. Create file in `src/__tests__/` folder
2. Use `.test.ts` extension
3. Follow existing patterns

### Adding E2E Tests

1. Create file in `e2e/` folder
2. Use `.spec.ts` extension
3. Use `test.describe` for grouping

## Troubleshooting

### E2E tests failing?

- Ensure the dev server isn't already running
- Check if port 3000 is available
- Run `npx playwright install` if browsers are missing

### Unit tests not finding files?

- Check the path alias `@/` is working
- Verify `vitest.config.ts` is correct
