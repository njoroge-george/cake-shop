import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    const baseUpdate: any = {
      code: body.code ? String(body.code).toUpperCase().trim() : undefined,
      description: body.description ?? undefined,
      discount: body.discount != null ? Number(body.discount) : undefined,
      type: body.type ? (body.type === 'FIXED' ? 'FIXED' : 'PERCENTAGE') : undefined,
      minOrder: body.minOrder != null ? Number(body.minOrder) : undefined,
      maxDiscount: body.maxDiscount != null ? Number(body.maxDiscount) : undefined,
      validFrom: body.validFrom ? new Date(body.validFrom) : undefined,
      validUntil: body.validUntil ? new Date(body.validUntil) : undefined,
      usageLimit: body.usageLimit != null ? Number(body.usageLimit) : undefined,
      isActive: body.isActive != null ? Boolean(body.isActive) : undefined,
    };

    let updated;
    try {
      updated = await prisma.promoCode.update({
        where: { id },
        data: { ...baseUpdate, season: body.season ?? undefined, reference: body.reference ?? undefined },
      });
    } catch (e: any) {
      if (String(e?.message || '').includes('Unknown argument `season`') || String(e?.message || '').includes('Unknown argument `reference`')) {
        updated = await prisma.promoCode.update({ where: { id }, data: baseUpdate });
      } else {
        throw e;
      }
    }

    return NextResponse.json({ promoCode: updated });
  } catch (error) {
    console.error('Error updating promo code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    await prisma.promoCode.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting promo code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
