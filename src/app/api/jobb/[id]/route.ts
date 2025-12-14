import { NextResponse } from 'next/server';

/**
 * GET /api/jobb/[id]
 *
 * Fetch detailed job information from Arbetsförmedlingen (JobTech API)
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Call JobTech API for specific job
    const apiUrl = `https://jobsearch.api.jobtechdev.se/ad/${id}`;

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
    console.error('Error fetching job details:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch job details',
      },
      { status: 500 }
    );
  }
}
