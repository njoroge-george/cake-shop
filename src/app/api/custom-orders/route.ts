import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session && (session.user as any).role === 'ADMIN';
    
    if (!session && !isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const where = isAdmin ? {} : { userId };

    const customOrders = await prisma.customOrder.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ customOrders });
  } catch (error) {
    console.error('Error fetching custom orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session ? (session.user as any).id : null;

    const data = await req.json();

    const {
      name,
      email,
      phone,
      eventType,
      eventDate,
      servings,
      budget,
      description,
      flavors,
      colors,
      theme,
      specialRequests,
      referenceImages,
    } = data;

    // Basic validation
    if (!name || !email || !phone || !eventType || !eventDate || !servings || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const customOrder = await prisma.customOrder.create({
      data: {
        userId,
        name,
        email,
        phone,
        eventType,
        eventDate: new Date(eventDate),
        servings: Number(servings),
        budget: budget ? Number(budget) : null,
        description,
        flavors: flavors || null,
        colors: colors || null,
        theme: theme || null,
        specialRequests: specialRequests || null,
        referenceImages: referenceImages || [],
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Send notification email to admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_FROM || 'admin@cakeshop.com';
      await sendEmail({
        to: adminEmail,
        subject: `New Custom Order Request - ${customOrder.id}`,
        html: `
          <h2>New Custom Order Request</h2>
          <p><strong>Customer:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Event Type:</strong> ${eventType}</p>
          <p><strong>Event Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>
          <p><strong>Servings:</strong> ${servings}</p>
          ${budget ? `<p><strong>Budget:</strong> KSh ${Number(budget).toLocaleString()}</p>` : ''}
          <p><strong>Description:</strong></p>
          <p>${description}</p>
          ${flavors ? `<p><strong>Flavors:</strong> ${flavors}</p>` : ''}
          ${colors ? `<p><strong>Colors:</strong> ${colors}</p>` : ''}
          ${theme ? `<p><strong>Theme:</strong> ${theme}</p>` : ''}
          ${specialRequests ? `<p><strong>Special Requests:</strong> ${specialRequests}</p>` : ''}
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/custom-orders/${customOrder.id}">View in Admin Panel</a></p>
        `,
      });

      // Send confirmation to customer
      await sendEmail({
        to: email,
        subject: 'Custom Cake Order Request Received',
        html: `
          <h2>Thank You for Your Custom Cake Request!</h2>
          <p>Dear ${name},</p>
          <p>We've received your custom cake order request for your ${eventType} on ${new Date(eventDate).toLocaleDateString()}.</p>
          <p><strong>Order ID:</strong> ${customOrder.id}</p>
          <p>Our team will review your requirements and get back to you within 24-48 hours with a quote and design proposal.</p>
          <p><strong>What's Next?</strong></p>
          <ul>
            <li>Our cake designers will review your request</li>
            <li>We'll send you a custom quote and design mockup</li>
            <li>Once approved, we'll begin creating your dream cake!</li>
          </ul>
          <p>If you have any questions, feel free to reply to this email.</p>
          <p>Best regards,<br><strong>The Cake Shop Team</strong> 🎂</p>
        `,
      });
    } catch (emailError) {
      console.error('Email send failed (non-fatal):', emailError);
    }

    return NextResponse.json({ customOrder }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating custom order:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
