import { NextRequest, NextResponse } from 'next/server';
import { RegisterData, AuthResponse, ApiErrorResponse } from '@/application/dto';
import { UserWithPassword, defaultPreferences, defaultNotifications } from '@/domain/models';
import {
  mockDb,
  generateId,
  generateToken,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
} from '../mock-db';

export async function POST(request: NextRequest) {
  try {
    const body: RegisterData = await request.json();
    const { email, password, firstName, lastName } = body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      const errorResponse: ApiErrorResponse = {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'All fields are required',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const errorResponse: ApiErrorResponse = {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid email format',
          field: 'email',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Password validation
    if (password.length < 8) {
      const errorResponse: ApiErrorResponse = {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Password must be at least 8 characters',
          field: 'password',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Check if email already exists
    if (mockDb.users.findByEmail(email)) {
      const errorResponse: ApiErrorResponse = {
        error: {
          code: 'EMAIL_EXISTS',
          message: 'An account with this email already exists',
          field: 'email',
        },
      };
      return NextResponse.json(errorResponse, { status: 409 });
    }

    // Create user
    const now = new Date();
    const newUser: UserWithPassword = {
      id: generateId(),
      email,
      password,
      firstName,
      lastName,
      preferences: { ...defaultPreferences },
      notifications: { ...defaultNotifications },
      createdAt: now,
      updatedAt: now,
    };
    mockDb.users.create(newUser);

    // Generate tokens
    const accessToken = generateToken();
    const refreshToken = generateToken();

    // Store tokens
    mockDb.refreshTokens.set(refreshToken, newUser.id);
    mockDb.accessTokens.set(accessToken, newUser.id);

    // Prepare response (without password)
    const userWithoutPassword = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      preferences: newUser.preferences,
      notifications: newUser.notifications,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };
    const response: AuthResponse = {
      user: userWithoutPassword,
      accessToken,
      expiresIn: ACCESS_TOKEN_EXPIRY,
    };

    // Create response with refresh token cookie
    const res = NextResponse.json(response, { status: 201 });
    res.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: REFRESH_TOKEN_EXPIRY,
    });

    return res;
  } catch {
    const errorResponse: ApiErrorResponse = {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
