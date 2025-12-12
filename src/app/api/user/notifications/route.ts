import { NextRequest, NextResponse } from 'next/server';
import { UpdateNotificationsData, UpdateUserResponse, ApiErrorResponse } from '@/application/dto';
import { NotificationSettings } from '@/domain/models';
import { mockDb } from '@/app/api/auth/mock-db';

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

    const body: UpdateNotificationsData = await request.json();
    const { emailNotifications, marketingEmails, securityAlerts } = body;

    // Get current user
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

    // Update notifications
    const updatedNotifications: NotificationSettings = {
      ...user.notifications,
      ...(emailNotifications !== undefined && { emailNotifications }),
      ...(marketingEmails !== undefined && { marketingEmails }),
      ...(securityAlerts !== undefined && { securityAlerts }),
    };

    const updatedUser = mockDb.users.update(userId, { notifications: updatedNotifications });
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
      message: 'Notification settings updated successfully',
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
