import { NextRequest, NextResponse } from 'next/server';
import { RefreshResponse, ApiErrorResponse } from '@/application/dto';
import {
  mockDb,
  generateToken,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
} from '../mock-db';

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookie
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      const errorResponse: ApiErrorResponse = {
        error: {
          code: 'REFRESH_INVALID',
          message: 'No refresh token provided',
        },
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    // Validate refresh token
    const userId = mockDb.refreshTokens.get(refreshToken);
    if (!userId) {
      const errorResponse: ApiErrorResponse = {
        error: {
          code: 'REFRESH_INVALID',
          message: 'Invalid or expired refresh token',
        },
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    // Check if user still exists
    const user = mockDb.users.findById(userId);
    if (!user) {
      mockDb.refreshTokens.delete(refreshToken);
      const errorResponse: ApiErrorResponse = {
        error: {
          code: 'REFRESH_INVALID',
          message: 'User not found',
        },
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    // Delete old refresh token and create new one (token rotation)
    mockDb.refreshTokens.delete(refreshToken);
    const newRefreshToken = generateToken();
    mockDb.refreshTokens.set(newRefreshToken, userId);

    // Generate new access token
    const accessToken = generateToken();

    const response: RefreshResponse = {
      accessToken,
      expiresIn: ACCESS_TOKEN_EXPIRY,
    };

    // Create response with new refresh token cookie
    const res = NextResponse.json(response, { status: 200 });
    res.cookies.set('refreshToken', newRefreshToken, {
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
