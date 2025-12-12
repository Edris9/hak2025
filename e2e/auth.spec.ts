import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.describe('Login', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
    });

    test.describe('Happy Path', () => {
      test('should display login form', async ({ page }) => {
        await expect(page.getByText('Welcome back')).toBeVisible();
        await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
        await expect(page.getByPlaceholder('Enter your password')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
      });

      test('should login with valid credentials and redirect to dashboard', async ({ page }) => {
        await page.getByPlaceholder('Enter your email').fill('test@example.com');
        await page.getByPlaceholder('Enter your password').fill('Password123');
        await page.getByRole('button', { name: 'Sign in' }).click();

        await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
        await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
      });

      test('should show user info after successful login', async ({ page }) => {
        await page.getByPlaceholder('Enter your email').fill('test@example.com');
        await page.getByPlaceholder('Enter your password').fill('Password123');
        await page.getByRole('button', { name: 'Sign in' }).click();

        await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
        // Check for user name in sidebar (first match)
        await expect(page.getByText('Test User').first()).toBeVisible();
      });
    });

    test.describe('Error Scenarios', () => {
      test('should show validation error for empty email', async ({ page }) => {
        await page.getByPlaceholder('Enter your password').fill('Password123');
        await page.getByRole('button', { name: 'Sign in' }).click();

        await expect(page.getByText('Email is required')).toBeVisible();
      });

      test('should prevent submission with invalid email format', async ({ page }) => {
        await page.getByPlaceholder('Enter your email').fill('invalid-email');
        await page.getByPlaceholder('Enter your password').fill('Password123');
        await page.getByRole('button', { name: 'Sign in' }).click();

        // Browser's native email validation prevents form submission
        // Verify we stay on the login page
        await expect(page).toHaveURL('/login');
      });

      test('should show validation error for empty password', async ({ page }) => {
        await page.getByPlaceholder('Enter your email').fill('test@example.com');
        await page.getByRole('button', { name: 'Sign in' }).click();

        await expect(page.getByText('Password is required')).toBeVisible();
      });

      test('should show validation error for short password', async ({ page }) => {
        await page.getByPlaceholder('Enter your email').fill('test@example.com');
        await page.getByPlaceholder('Enter your password').fill('Pass1');
        await page.getByRole('button', { name: 'Sign in' }).click();

        await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
      });

      test('should show error for invalid credentials', async ({ page }) => {
        await page.getByPlaceholder('Enter your email').fill('wrong@example.com');
        await page.getByPlaceholder('Enter your password').fill('WrongPassword123');
        await page.getByRole('button', { name: 'Sign in' }).click();

        await expect(page.getByText('Invalid email or password')).toBeVisible({ timeout: 10000 });
      });

      test('should show error for wrong password', async ({ page }) => {
        await page.getByPlaceholder('Enter your email').fill('test@example.com');
        await page.getByPlaceholder('Enter your password').fill('WrongPassword123');
        await page.getByRole('button', { name: 'Sign in' }).click();

        await expect(page.getByText('Invalid email or password')).toBeVisible({ timeout: 10000 });
      });
    });

    test.describe('Navigation', () => {
      test('should navigate to register page', async ({ page }) => {
        await page.getByRole('link', { name: 'Register' }).click();
        await expect(page).toHaveURL('/register');
      });
    });
  });

  test.describe('Register', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/register');
      await page.waitForLoadState('networkidle');
    });

    test.describe('Happy Path', () => {
      test('should display registration form', async ({ page }) => {
        await expect(page.getByText('Create an account')).toBeVisible();
        await expect(page.getByPlaceholder('First name')).toBeVisible();
        await expect(page.getByPlaceholder('Last name')).toBeVisible();
        await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
        await expect(page.getByPlaceholder('Create a password')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
      });

      test('should register with valid data and redirect to dashboard', async ({ page }) => {
        const uniqueEmail = `user${Date.now()}@example.com`;

        await page.getByPlaceholder('First name').fill('Jane');
        await page.getByPlaceholder('Last name').fill('Smith');
        await page.getByPlaceholder('Enter your email').fill(uniqueEmail);
        await page.getByPlaceholder('Create a password').fill('SecurePass123');
        await page.getByRole('button', { name: 'Create account' }).click();

        await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
        // Check for user name in sidebar (first match)
        await expect(page.getByText('Jane Smith').first()).toBeVisible();
      });
    });

    test.describe('Error Scenarios', () => {
      test('should show validation error for empty first name', async ({ page }) => {
        await page.getByPlaceholder('Last name').fill('Smith');
        await page.getByPlaceholder('Enter your email').fill('newuser@example.com');
        await page.getByPlaceholder('Create a password').fill('Password123');
        await page.getByRole('button', { name: 'Create account' }).click();

        await expect(page.getByText('First name is required')).toBeVisible();
      });

      test('should show validation error for empty last name', async ({ page }) => {
        await page.getByPlaceholder('First name').fill('Jane');
        await page.getByPlaceholder('Enter your email').fill('newuser@example.com');
        await page.getByPlaceholder('Create a password').fill('Password123');
        await page.getByRole('button', { name: 'Create account' }).click();

        await expect(page.getByText('Last name is required')).toBeVisible();
      });

      test('should show validation error for password without uppercase', async ({ page }) => {
        await page.getByPlaceholder('First name').fill('Jane');
        await page.getByPlaceholder('Last name').fill('Smith');
        await page.getByPlaceholder('Enter your email').fill('newuser@example.com');
        await page.getByPlaceholder('Create a password').fill('password123');
        await page.getByRole('button', { name: 'Create account' }).click();

        await expect(page.getByText('Password must contain at least one uppercase letter')).toBeVisible();
      });

      test('should show validation error for password without lowercase', async ({ page }) => {
        await page.getByPlaceholder('First name').fill('Jane');
        await page.getByPlaceholder('Last name').fill('Smith');
        await page.getByPlaceholder('Enter your email').fill('newuser@example.com');
        await page.getByPlaceholder('Create a password').fill('PASSWORD123');
        await page.getByRole('button', { name: 'Create account' }).click();

        await expect(page.getByText('Password must contain at least one lowercase letter')).toBeVisible();
      });

      test('should show validation error for password without number', async ({ page }) => {
        await page.getByPlaceholder('First name').fill('Jane');
        await page.getByPlaceholder('Last name').fill('Smith');
        await page.getByPlaceholder('Enter your email').fill('newuser@example.com');
        await page.getByPlaceholder('Create a password').fill('PasswordABC');
        await page.getByRole('button', { name: 'Create account' }).click();

        await expect(page.getByText('Password must contain at least one number')).toBeVisible();
      });

      test('should show error for duplicate email', async ({ page }) => {
        await page.getByPlaceholder('First name').fill('Jane');
        await page.getByPlaceholder('Last name').fill('Smith');
        await page.getByPlaceholder('Enter your email').fill('test@example.com');
        await page.getByPlaceholder('Create a password').fill('Password123');
        await page.getByRole('button', { name: 'Create account' }).click();

        await expect(page.getByText('An account with this email already exists')).toBeVisible({ timeout: 10000 });
      });
    });

    test.describe('Navigation', () => {
      test('should navigate to login page', async ({ page }) => {
        await page.getByRole('link', { name: 'Sign in' }).click();
        await expect(page).toHaveURL('/login');
      });
    });
  });

  test.describe('Logout', () => {
    test('should logout successfully', async ({ page }) => {
      // First login
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      await page.getByPlaceholder('Enter your email').fill('test@example.com');
      await page.getByPlaceholder('Enter your password').fill('Password123');
      await page.getByRole('button', { name: 'Sign in' }).click();

      await expect(page).toHaveURL('/dashboard', { timeout: 10000 });

      // Click on user menu (the button containing user name)
      await page.locator('[data-sidebar="footer"]').getByRole('button').click();

      // Click sign out
      await page.getByRole('menuitem', { name: 'Sign out' }).click();

      await expect(page).toHaveURL('/login', { timeout: 10000 });
    });
  });
});
