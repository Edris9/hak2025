import { NextResponse } from 'next/server';

/**
 * GET /api/jobb
 *
 * Fetch jobs from Arbetsförmedlingen (JobTech API)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = searchParams.get('limit') || '20';
    const municipality = searchParams.get('municipality') || '';
    const offset = searchParams.get('offset') || '0';

    // Build query parameters
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (municipality) params.append('municipality', municipality);
    params.append('limit', limit);
    params.append('offset', offset);

    // Call JobTech API
    const apiUrl = `https://jobsearch.api.jobtechdev.se/search?${params.toString()}`;

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`JobTech API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch jobs',
      },
      { status: 500 }
    );
  }
}
