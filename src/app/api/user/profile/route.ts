import { NextRequest, NextResponse } from 'next/server';
import { UpdateProfileData, UpdateUserResponse, ApiErrorResponse } from '@/application/dto';
import { mockDb } from '@/app/api/auth/mock-db';

function getUserIdFromToken(request: NextRequest): string | null {
  // First try access token from Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const userId = mockDb.accessTokens.get(token);
    if (userId) {
      return userId;
    }
  }

  // Fallback to refresh token from cookie (for cases where access token is out of sync)
  const refreshToken = request.cookies.get('refreshToken')?.value;
  if (refreshToken) {
    return mockDb.refreshTokens.get(refreshToken) || null;
  }

  return null;
}

export async function PUT(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      const errorResponse: ApiErrorResponse = {
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid or expired token',
        },
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    const body: UpdateProfileData = await request.json();
    const { firstName, lastName, email } = body;

    // Validation
    if (!firstName || !lastName || !email) {
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

    // Check if email is taken by another user
    const existingUser = mockDb.users.findByEmail(email);
    if (existingUser && existingUser.id !== userId) {
      const errorResponse: ApiErrorResponse = {
        error: {
          code: 'EMAIL_EXISTS',
          message: 'This email is already in use',
          field: 'email',
        },
      };
      return NextResponse.json(errorResponse, { status: 409 });
    }

    // Update user
    const updatedUser = mockDb.users.update(userId, { firstName, lastName, email });
    if (!updatedUser) {
      const errorResponse: ApiErrorResponse = {
        error: {
          code: 'NOT_FOUND',
          message: 'User not found',
        },
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    // Prepare response (without password)
    const userWithoutPassword = {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      preferences: updatedUser.preferences,
      notifications: updatedUser.notifications,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    const response: UpdateUserResponse = {
      user: userWithoutPassword,
      message: 'Profile updated successfully',
    };

    return NextResponse.json(response, { status: 200 });
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
