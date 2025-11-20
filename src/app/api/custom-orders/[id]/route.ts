import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const isAdmin = session && (session.user as any).role === 'ADMIN';

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customOrder = await prisma.customOrder.findUnique({
      where: { id },
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
    });

    if (!customOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check authorization: admin or owner
    const userId = (session.user as any).id;
    if (!isAdmin && customOrder.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ customOrder });
  } catch (error) {
    console.error('Error fetching custom order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const isAdmin = session && (session.user as any).role === 'ADMIN';

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { status, adminNotes, quotedPrice } = data;

    const existingOrder = await prisma.customOrder.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const customOrder = await prisma.customOrder.update({
      where: { id },
      data: {
        status: status || existingOrder.status,
        adminNotes: adminNotes !== undefined ? adminNotes : existingOrder.adminNotes,
        quotedPrice: quotedPrice !== undefined ? quotedPrice : existingOrder.quotedPrice,
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

    // Send notification email to customer if status changed to QUOTED
    if (status === 'QUOTED' && existingOrder.status !== 'QUOTED' && quotedPrice) {
      try {
        await sendEmail({
          to: customOrder.email,
          subject: 'Your Custom Cake Quote is Ready!',
          html: `
            <h2>Custom Cake Quote</h2>
            <p>Dear ${customOrder.name},</p>
            <p>Great news! We've reviewed your custom cake request for your ${customOrder.eventType} on ${new Date(customOrder.eventDate).toLocaleDateString()}.</p>
            
            <h3>Quote Details:</h3>
            <p><strong>Quoted Price:</strong> KSh ${quotedPrice.toLocaleString()}</p>
            <p><strong>Servings:</strong> ${customOrder.servings}</p>
            
            ${adminNotes ? `<p><strong>Additional Notes:</strong></p><p>${adminNotes}</p>` : ''}
            
            <p>To proceed with this order, please reply to this email or contact us at your earliest convenience.</p>
            
            <p>We look forward to creating your dream cake!</p>
            
            <p>Best regards,<br><strong>The Cake Shop Team</strong> 🎂</p>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send quote email:', emailError);
      }
    }

    // Send notification for ACCEPTED status
    if (status === 'ACCEPTED' && existingOrder.status !== 'ACCEPTED') {
      try {
        await sendEmail({
          to: customOrder.email,
          subject: 'Custom Order Accepted - Production Starting!',
          html: `
            <h2>Order Confirmed!</h2>
            <p>Dear ${customOrder.name},</p>
            <p>Wonderful news! We've confirmed your custom cake order.</p>
            <p><strong>Event Date:</strong> ${new Date(customOrder.eventDate).toLocaleDateString()}</p>
            <p>Our team is excited to start creating your beautiful cake. We'll keep you updated on the progress!</p>
            <p>Best regards,<br><strong>The Cake Shop Team</strong> 🎂</p>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send acceptance email:', emailError);
      }
    }

    // Send notification for COMPLETED status
    if (status === 'COMPLETED' && existingOrder.status !== 'COMPLETED') {
      try {
        await sendEmail({
          to: customOrder.email,
          subject: 'Your Custom Cake is Ready!',
          html: `
            <h2>Cake Completed!</h2>
            <p>Dear ${customOrder.name},</p>
            <p>Your custom cake is ready for pickup/delivery!</p>
            <p>Thank you for choosing us for your ${customOrder.eventType}. We hope you and your guests enjoy it!</p>
            <p>Best regards,<br><strong>The Cake Shop Team</strong> 🎂</p>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send completion email:', emailError);
      }
    }

    return NextResponse.json({ customOrder });
  } catch (error) {
    console.error('Error updating custom order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const isAdmin = session && (session.user as any).role === 'ADMIN';

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.customOrder.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting custom order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
