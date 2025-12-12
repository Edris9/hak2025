import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema } from '@/presentation/utils/validation';

describe('Auth Validation Schemas', () => {
  describe('loginSchema', () => {
    describe('happy path', () => {
      it('should validate correct login credentials', () => {
        const validData = {
          email: 'test@example.com',
          password: 'Password123',
        };

        const result = loginSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should accept email with subdomain', () => {
        const validData = {
          email: 'user@mail.example.com',
          password: 'Password123',
        };

        const result = loginSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    describe('error scenarios', () => {
      it('should reject empty email', () => {
        const invalidData = {
          email: '',
          password: 'Password123',
        };

        const result = loginSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toContain('email');
        }
      });

      it('should reject invalid email format', () => {
        const invalidData = {
          email: 'invalid-email',
          password: 'Password123',
        };

        const result = loginSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toContain('email');
        }
      });

      it('should reject empty password', () => {
        const invalidData = {
          email: 'test@example.com',
          password: '',
        };

        const result = loginSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toContain('password');
        }
      });

      it('should reject password shorter than 8 characters', () => {
        const invalidData = {
          email: 'test@example.com',
          password: 'Pass1',
        };

        const result = loginSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toContain('password');
        }
      });
    });
  });

  describe('registerSchema', () => {
    describe('happy path', () => {
      it('should validate correct registration data', () => {
        const validData = {
          email: 'test@example.com',
          password: 'Password123',
          firstName: 'John',
          lastName: 'Doe',
        };

        const result = registerSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should accept complex password', () => {
        const validData = {
          email: 'test@example.com',
          password: 'MyP@ssw0rd!2024',
          firstName: 'John',
          lastName: 'Doe',
        };

        const result = registerSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    describe('error scenarios', () => {
      it('should reject empty first name', () => {
        const invalidData = {
          email: 'test@example.com',
          password: 'Password123',
          firstName: '',
          lastName: 'Doe',
        };

        const result = registerSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toContain('firstName');
        }
      });

      it('should reject empty last name', () => {
        const invalidData = {
          email: 'test@example.com',
          password: 'Password123',
          firstName: 'John',
          lastName: '',
        };

        const result = registerSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toContain('lastName');
        }
      });

      it('should reject password without uppercase letter', () => {
        const invalidData = {
          email: 'test@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
        };

        const result = registerSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toContain('password');
        }
      });

      it('should reject password without lowercase letter', () => {
        const invalidData = {
          email: 'test@example.com',
          password: 'PASSWORD123',
          firstName: 'John',
          lastName: 'Doe',
        };

        const result = registerSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toContain('password');
        }
      });

      it('should reject password without number', () => {
        const invalidData = {
          email: 'test@example.com',
          password: 'PasswordABC',
          firstName: 'John',
          lastName: 'Doe',
        };

        const result = registerSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toContain('password');
        }
      });

      it('should reject first name exceeding max length', () => {
        const invalidData = {
          email: 'test@example.com',
          password: 'Password123',
          firstName: 'A'.repeat(51),
          lastName: 'Doe',
        };

        const result = registerSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toContain('firstName');
        }
      });
    });
  });
});
