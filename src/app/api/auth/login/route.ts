import { NextRequest, NextResponse } from 'next/server';
import { LoginCredentials, AuthResponse, ApiErrorResponse } from '@/application/dto';
import {
  mockDb,
  generateToken,
  validatePassword,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
} from '../mock-db';

export async function POST(request: NextRequest) {
  try {
    const body: LoginCredentials = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      const errorResponse: ApiErrorResponse = {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email and password are required',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Find user
    const user = mockDb.users.findByEmail(email);
    if (!user) {
      const errorResponse: ApiErrorResponse = {
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    // Validate password
    if (!validatePassword(password, user.password)) {
      const errorResponse: ApiErrorResponse = {
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    // Invalidate old tokens for this user
    mockDb.refreshTokens.deleteByUserId(user.id);
    mockDb.accessTokens.deleteByUserId(user.id);

    // Generate new tokens
    const accessToken = generateToken();
    const refreshToken = generateToken();

    // Store tokens
    mockDb.refreshTokens.set(refreshToken, user.id);
    mockDb.accessTokens.set(accessToken, user.id);

    // Prepare response (without password)
    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      preferences: user.preferences,
      notifications: user.notifications,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    const response: AuthResponse = {
      user: userWithoutPassword,
      accessToken,
      expiresIn: ACCESS_TOKEN_EXPIRY,
    };

    // Create response with refresh token cookie
    const res = NextResponse.json(response, { status: 200 });
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
