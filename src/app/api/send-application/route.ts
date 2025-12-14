import { NextResponse } from 'next/server';

/**
 * POST /api/send-application
 *
 * Send job application with CV and cover letter
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      recipientEmail,
      recipientName,
      jobTitle,
      coverLetter,
      cvFileName,
      applicantName,
      applicantEmail,
      applicantPhone
    } = body;

    if (!recipientEmail || !jobTitle || !coverLetter) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    // Here you would typically send an email using a service like:
    // - SendGrid
    // - Resend
    // - AWS SES
    // - Nodemailer

    // For now, we'll simulate sending the email
    console.log('Sending application:', {
      to: recipientEmail,
      subject: `Jobbansökan: ${jobTitle}`,
      from: applicantEmail,
      body: coverLetter,
      attachments: cvFileName ? [cvFileName] : [],
    });

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In a real implementation, you would:
    // 1. Upload CV to storage (S3, Azure Blob, etc.)
    // 2. Create email with cover letter and CV attachment
    // 3. Send email via email service
    // 4. Log the application in database

    return NextResponse.json({
      success: true,
      message: 'Ansökan skickad!',
    });
  } catch (error) {
    console.error('Error sending application:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send application',
      },
      { status: 500 }
    );
  }
}
