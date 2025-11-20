import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { sendEmail, orderConfirmationEmail } from '@/lib/email';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = (session.user as any).role === 'ADMIN';
    const userId = (session.user as any).id;

    const where = isAdmin ? {} : { userId };

    const orders = await prisma.order.findMany({
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
        address: true,
        items: {
          include: {
            cake: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const data = await req.json();

    const {
      addressId,
      address, // optional inline address object
      deliveryDate,
      deliveryTime,
      items,
      subtotal,
      deliveryFee,
      discount: clientDiscount,
      total: clientTotal,
      promoCode,
      notes,
      paybillNumber,
      paybillAccount,
    } = data;

    // Validate and compute promo discount server-side
    let appliedDiscount = 0;
    let appliedCode: string | null = null;
    if (promoCode) {
      const code = String(promoCode).trim();
      // Case-insensitive lookup to avoid mismatch issues
      const promo = await prisma.promoCode.findFirst({ where: { code: { equals: code, mode: 'insensitive' } } });
      const now = new Date();
      if (
        promo &&
        promo.isActive &&
        (!promo.validFrom || now >= promo.validFrom) &&
        (!promo.validUntil || now <= promo.validUntil) &&
        (promo.usageLimit == null || promo.usageCount < promo.usageLimit) &&
        (promo.minOrder == null || subtotal >= promo.minOrder)
      ) {
        // compute discount
        if (promo.type === 'PERCENTAGE') {
          appliedDiscount = (subtotal * promo.discount) / 100;
          if (promo.maxDiscount != null) appliedDiscount = Math.min(appliedDiscount, promo.maxDiscount);
        } else {
          appliedDiscount = promo.discount;
        }
        appliedDiscount = Math.max(0, Math.min(appliedDiscount, subtotal));
        appliedCode = promo.code;
      }
    }

    const total = subtotal + deliveryFee - appliedDiscount;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order (manual Paybill flow)
    // Build base order data
    const baseOrderData = {
      orderNumber,
      // Link to the user via relation
      user: { connect: { id: userId } },
      // Address: connect existing or create new from inline payload
      ...(addressId
        ? { address: { connect: { id: addressId } } }
        : address
        ? {
            address: {
              create: {
                // address belongs to same user
                user: { connect: { id: userId } },
                name: String(address.name || ''),
                phone: String(address.phone || ''),
                street: String(address.street || ''),
                city: String(address.city || ''),
                county: String(address.county || ''),
                isDefault: false,
              },
            },
          }
        : (() => {
            throw new Error('Missing address: provide addressId or address details');
          })()),
      deliveryDate: new Date(deliveryDate),
      deliveryTime,
      paymentMethod: 'MPESA',
      subtotal,
      deliveryFee,
      discount: appliedDiscount,
      total,
      promoCode: appliedCode || null,
      notes,
      items: {
        create: items.map((item: any) => ({
          cakeId: item.cakeId,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedFlavor: item.selectedFlavor,
          selectedLayers: item.selectedLayers,
          customMessage: item.customMessage,
          specialRequests: item.specialRequests,
          price: item.price,
          subtotal: item.price * item.quantity,
        })),
      },
    } as any;

    // Attempt to create with paybill fields; fallback if client lacks columns
    let order: any;
    try {
      order = await prisma.order.create({
        data: ({
          ...baseOrderData,
          paybillNumber: paybillNumber || null,
          paybillAccount: paybillAccount || null,
        } as any),
        include: {
          user: true,
          address: true,
          items: { include: { cake: true } },
        },
      });
    } catch (e: any) {
      const msg = String(e?.message || '');
      if (msg.includes('Unknown argument `paybillNumber`') || msg.includes('Unknown argument `paybillAccount`')) {
        console.warn('Prisma client missing paybill fields; creating order without them and appending to notes');
        const appended = `\n[Paybill Details] Number: ${paybillNumber || '-'} | Account: ${paybillAccount || '-'}`;
        const safeNotes = (notes || '') + appended;
        order = await prisma.order.create({
          data: ({
            ...baseOrderData,
            notes: safeNotes,
          } as any),
          include: {
            user: true,
            address: true,
            items: { include: { cake: true } },
          },
        });
      } else {
        throw e;
      }
    }

    if (appliedCode) {
      // Best-effort increment usage count; if this fails, order remains valid
      try {
        await prisma.promoCode.update({
          where: { code: appliedCode },
          data: { usageCount: { increment: 1 } },
        });
      } catch (e) {
        console.error('Failed to increment promo code usage:', e);
      }
    }

    // Send order confirmation email with Paybill instructions (best-effort)
    try {
      await sendEmail({
        to: order.user.email,
        subject: `Order Placed - ${orderNumber}`,
        html: `
          <p>Thank you, ${order.user.name}!</p>
          <p>Your order <strong>${orderNumber}</strong> has been placed.</p>
          <p>Total Amount: <strong>KSh ${total.toLocaleString()}</strong></p>
          <p>Please pay via M-Pesa Paybill to complete your order:</p>
          <ul>
            <li>Paybill Number: <strong>${paybillNumber || '123456'}</strong></li>
            <li>Account Number: <strong>${paybillAccount || orderNumber}</strong></li>
          </ul>
          <p>We will confirm your payment and update your order status.</p>
        `,
      });
    } catch (e) {
      console.error('Email send failed (non-fatal):', e);
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating order:', error);
    const message = typeof error?.message === 'string' ? error.message : 'Internal server error';
    const status = message.includes('Missing address') ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
