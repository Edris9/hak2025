import { NextRequest, NextResponse } from 'next/server';
import { ChangePasswordData, ChangePasswordResponse, ApiErrorResponse } from '@/application/dto';
import { mockDb, validatePassword } from '@/app/api/auth/mock-db';

function getUserIdFromToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  return mockDb.accessTokens.get(token) || null;
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

    const body: ChangePasswordData = await request.json();
    const { currentPassword, newPassword } = body;

    // Validation
    if (!currentPassword || !newPassword) {
      const errorResponse: ApiErrorResponse = {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Current password and new password are required',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
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

    // Verify current password
    if (!validatePassword(currentPassword, user.password)) {
      const errorResponse: ApiErrorResponse = {
        error: {
          code: 'INVALID_PASSWORD',
          message: 'Current password is incorrect',
          field: 'currentPassword',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Validate new password
    if (newPassword.length < 8) {
      const errorResponse: ApiErrorResponse = {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'New password must be at least 8 characters',
          field: 'newPassword',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (!/[A-Z]/.test(newPassword)) {
      const errorResponse: ApiErrorResponse = {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'New password must contain at least one uppercase letter',
          field: 'newPassword',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (!/[a-z]/.test(newPassword)) {
      const errorResponse: ApiErrorResponse = {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'New password must contain at least one lowercase letter',
          field: 'newPassword',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (!/[0-9]/.test(newPassword)) {
      const errorResponse: ApiErrorResponse = {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'New password must contain at least one number',
          field: 'newPassword',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Update password
    mockDb.users.update(userId, { password: newPassword });

    const response: ChangePasswordResponse = {
      message: 'Password changed successfully',
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
