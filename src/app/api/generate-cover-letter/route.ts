import { NextResponse } from 'next/server';
import OpenAI from 'openai';

/**
 * POST /api/generate-cover-letter
 *
 * Generate a personalized cover letter based on selected job postings
 */
export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env.local file.',
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { jobs } = body;

    if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No jobs provided',
        },
        { status: 400 }
      );
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey,
    });

    // Build job descriptions for the prompt
    const jobDescriptions = jobs
      .map(
        (job: { headline: string; employer: string; description: string }, index: number) =>
          `${index + 1}. ${job.headline} hos ${job.employer}\n   Beskrivning: ${job.description}`
      )
      .join('\n\n');

    // Create prompt for cover letter generation
    const prompt = `Du är en professionell jobbsökande som skriver ett personligt brev.

Jag söker följande jobb:
${jobDescriptions}

Skriv ett professionellt och personligt brev på svenska (1-2 paragrafer) som:
- Visar entusiasm för ${jobs.length > 1 ? 'dessa positioner' : 'denna position'}
- Betonar relevanta färdigheter och erfarenheter
- Är koncis och övertygande
- Passar för alla valda jobb

Skriv ENDAST brevet, ingen rubrik eller hälsning (t.ex. "Bästa rekryterare"). Börja direkt med innehållet.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Du är en expert på att skriva professionella personliga brev på svenska.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const coverLetter = completion.choices[0]?.message?.content?.trim();

    if (!coverLetter) {
      throw new Error('No response from OpenAI');
    }

    return NextResponse.json({
      success: true,
      coverLetter,
    });
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate cover letter',
      },
      { status: 500 }
    );
  }
}
