import { NextRequest, NextResponse } from 'next/server';
import { UpdatePreferencesData, UpdateUserResponse, ApiErrorResponse } from '@/application/dto';
import { UserPreferences } from '@/domain/models';
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

const validLanguages = ['en', 'sv', 'de', 'fr', 'es'];
const validDateFormats = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'];
const validTimeFormats = ['12h', '24h'];
const validThemes = ['light', 'dark', 'system'];

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

    const body: UpdatePreferencesData = await request.json();
    const { language, dateFormat, timeFormat, theme } = body;

    // Validate preferences
    if (language && !validLanguages.includes(language)) {
      const errorResponse: ApiErrorResponse = {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid language',
          field: 'language',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (dateFormat && !validDateFormats.includes(dateFormat)) {
      const errorResponse: ApiErrorResponse = {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid date format',
          field: 'dateFormat',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (timeFormat && !validTimeFormats.includes(timeFormat)) {
      const errorResponse: ApiErrorResponse = {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid time format',
          field: 'timeFormat',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (theme && !validThemes.includes(theme)) {
      const errorResponse: ApiErrorResponse = {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid theme',
          field: 'theme',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

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

    // Update preferences
    const updatedPreferences: UserPreferences = {
      ...user.preferences,
      ...(language && { language }),
      ...(dateFormat && { dateFormat }),
      ...(timeFormat && { timeFormat }),
      ...(theme && { theme }),
    };

    const updatedUser = mockDb.users.update(userId, { preferences: updatedPreferences });
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
      message: 'Preferences updated successfully',
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
