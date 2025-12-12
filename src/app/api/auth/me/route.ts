import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorResponse } from '@/application/dto';
import { mockDb } from '../mock-db';

export async function GET(request: NextRequest) {
  try {
    // Get refresh token from cookie (simplified auth check)
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      const errorResponse: ApiErrorResponse = {
        error: {
          code: 'UNAUTHORIZED',
          message: 'Not authenticated',
        },
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    // Get user ID from refresh token
    const userId = mockDb.refreshTokens.get(refreshToken);
    if (!userId) {
      const errorResponse: ApiErrorResponse = {
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid session',
        },
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    // Get user
    const user = mockDb.users.findById(userId);
    if (!user) {
      const errorResponse: ApiErrorResponse = {
        error: {
          code: 'NOT_FOUND',
          message: 'User not found',
        },
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    // Return user without password
    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return NextResponse.json(userWithoutPassword, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
