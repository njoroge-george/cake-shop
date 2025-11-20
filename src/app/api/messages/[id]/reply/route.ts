import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await context.params;

    // Only admin can reply to messages
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reply } = await req.json();

    if (!reply) {
      return NextResponse.json({ error: 'Reply message is required' }, { status: 400 });
    }

    // Get the original message
    const originalMessage = await prisma.message.findUnique({
      where: { id },
    });

    if (!originalMessage) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    // Update message with reply
    const updatedMessage = await prisma.message.update({
      where: { id },
      data: {
        reply,
        repliedAt: new Date(),
        repliedBy: (session.user as any).id,
        isRead: true,
      },
    });

    // Send email notification to customer
    try {
      await sendEmail({
        to: originalMessage.email,
        subject: `Re: ${originalMessage.subject}`,
        html: getReplyEmailTemplate({
          customerName: originalMessage.name,
          originalSubject: originalMessage.subject,
          originalMessage: originalMessage.message,
          reply,
          adminName: session.user?.name || 'Cake Shop Team',
        }),
      });
    } catch (emailError) {
      console.error('Failed to send reply email:', emailError);
      // Continue even if email fails - reply is already saved
    }

    return NextResponse.json({
      success: true,
      message: 'Reply sent successfully',
      data: updatedMessage,
    });

  } catch (error) {
    console.error('Error sending reply:', error);
    return NextResponse.json(
      { error: 'Failed to send reply' },
      { status: 500 }
    );
  }
}

function getReplyEmailTemplate(data: {
  customerName: string;
  originalSubject: string;
  originalMessage: string;
  reply: string;
  adminName: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FF69B4 0%, #9C27B0 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .message-box { background: white; padding: 20px; border-left: 4px solid #FF69B4; margin: 20px 0; }
          .reply-box { background: white; padding: 20px; border-left: 4px solid #9C27B0; margin: 20px 0; }
          .label { font-weight: bold; color: #666; margin-bottom: 5px; }
          .footer { text-align: center; margin-top: 30px; padding: 20px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 Reply from Cake Shop</h1>
          </div>
          <div class="content">
            <p>Dear ${data.customerName},</p>
            <p>Thank you for contacting us. We've responded to your inquiry below:</p>

            <div class="message-box">
              <div class="label">Your Original Message:</div>
              <p><strong>Subject:</strong> ${data.originalSubject}</p>
              <p>${data.originalMessage.replace(/\n/g, '<br>')}</p>
            </div>

            <div class="reply-box">
              <div class="label">Our Response:</div>
              <p>${data.reply.replace(/\n/g, '<br>')}</p>
              <p style="margin-top: 20px;"><em>- ${data.adminName}</em></p>
            </div>

            <p>If you have any further questions, feel free to reply to this email or contact us directly.</p>
            
            <p>Best regards,<br><strong>The Cake Shop Team</strong> 🍰</p>
          </div>
          <div class="footer">
            <p>Cake Shop - Making Your Celebrations Sweeter</p>
            <p>Email: info@cakeshop.com | Phone: +254 712 345 678</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
