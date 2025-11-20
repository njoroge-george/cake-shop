import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const codes = await prisma.promoCode.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ promoCodes: codes });
  } catch (error) {
    console.error('Error fetching promo codes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    // Basic validation
    if (!body.code || !body.discount || !body.type || !body.validFrom || !body.validUntil) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const baseData: any = {
      code: String(body.code).toUpperCase().trim(),
      description: body.description || null,
      discount: Number(body.discount),
      type: body.type === 'FIXED' ? 'FIXED' : 'PERCENTAGE',
      minOrder: body.minOrder != null ? Number(body.minOrder) : null,
      maxDiscount: body.maxDiscount != null ? Number(body.maxDiscount) : null,
      validFrom: new Date(body.validFrom),
      validUntil: new Date(body.validUntil),
      usageLimit: body.usageLimit != null ? Number(body.usageLimit) : null,
      isActive: body.isActive !== false,
    };

    // Attempt with season/reference first, then fallback if schema not migrated yet
    let code;
    try {
      code = await prisma.promoCode.create({
        data: { ...baseData, season: body.season || null, reference: body.reference || null },
      });
    } catch (e: any) {
      if (String(e?.message || '').includes('Unknown argument `season`') || String(e?.message || '').includes('Unknown argument `reference`')) {
        code = await prisma.promoCode.create({ data: baseData });
      } else {
        throw e;
      }
    }
    return NextResponse.json({ promoCode: code }, { status: 201 });
  } catch (error) {
    console.error('Error creating promo code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
