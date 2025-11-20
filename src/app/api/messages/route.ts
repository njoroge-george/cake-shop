import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { sendEmail, getContactEmailTemplate, getCustomerConfirmationTemplate } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const data = await req.json();

    const { name, email, phone, subject, message } = data;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save message to database
    const newMessage = await prisma.message.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message,
        userId: session?.user ? (session.user as any).id : null,
      },
    });

    // Try to send emails (don't fail if email sending fails)
    try {
      const adminEmail = process.env.SMTP_USER || 'nicknicc95@gmail.com';
      
      // Send email to admin
      await sendEmail({
        to: adminEmail,
        subject: `New Contact Message: ${subject}`,
        html: getContactEmailTemplate(data),
      });

      // Send confirmation email to customer
      await sendEmail({
        to: email,
        subject: 'We received your message - Cake Shop',
        html: getCustomerConfirmationTemplate({ name, subject }),
      });
    } catch (emailError) {
      console.error('Failed to send email notification, but message was saved:', emailError);
      // Continue even if email fails - message is already saved
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error in POST /api/messages:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Only admin can view all messages
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const isRead = searchParams.get('isRead');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: any = {};
    if (isRead !== null && isRead !== undefined && isRead !== '') {
      where.isRead = isRead === 'true';
    }

    const [messages, total, unreadCount] = await Promise.all([
      prisma.message.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.message.count({ where }),
      prisma.message.count({ where: { isRead: false } }),
    ]);

    return NextResponse.json({
      messages,
      total,
      unreadCount,
      page,
      totalPages: Math.ceil(total / limit),
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
