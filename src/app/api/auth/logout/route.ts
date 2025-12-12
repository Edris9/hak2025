import { NextRequest, NextResponse } from 'next/server';
import { mockDb } from '../mock-db';

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookie
    const refreshToken = request.cookies.get('refreshToken')?.value;

    // Delete refresh token if it exists
    if (refreshToken) {
      mockDb.refreshTokens.delete(refreshToken);
    }

    // Create response and clear cookie
    const res = NextResponse.json({ success: true }, { status: 200 });
    res.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    });

    return res;
  } catch {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
