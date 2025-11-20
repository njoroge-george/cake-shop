import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function computeDiscount(subtotal: number, promo: any) {
  let amount = 0;
  if (promo.type === 'PERCENTAGE') {
    amount = (subtotal * promo.discount) / 100;
    if (promo.maxDiscount != null) amount = Math.min(amount, promo.maxDiscount);
  } else {
    amount = promo.discount;
  }
  amount = Math.max(0, Math.min(amount, subtotal));
  return amount;
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
  const codeRaw = String(searchParams.get('code') || '').trim();
  const code = codeRaw.toUpperCase();
    const subtotal = Number(searchParams.get('subtotal') || '0');

  if (!code) return NextResponse.json({ valid: false, error: 'Code is required' });
    const now = new Date();

  // Use a case-insensitive lookup to be forgiving with code entry
  const promo = await prisma.promoCode.findFirst({ where: { code: { equals: code, mode: 'insensitive' } } });
  if (!promo) return NextResponse.json({ valid: false, error: 'Invalid code' });

  if (!promo.isActive) return NextResponse.json({ valid: false, error: 'Code is inactive' });
  if (promo.validFrom && now < promo.validFrom) return NextResponse.json({ valid: false, error: 'Code not yet valid' });
  if (promo.validUntil && now > promo.validUntil) return NextResponse.json({ valid: false, error: 'Code expired' });
  if (promo.usageLimit != null && promo.usageCount >= promo.usageLimit) return NextResponse.json({ valid: false, error: 'Code usage limit reached' });
  if (promo.minOrder != null && subtotal < promo.minOrder) return NextResponse.json({ valid: false, error: `Minimum order KSh ${promo.minOrder}` });

    const discountAmount = computeDiscount(subtotal, promo);
    const p: any = promo;
    const info = {
      code: promo.code,
      description: promo.description,
      season: p.season,
      reference: p.reference,
      type: promo.type,
      discount: promo.discount,
      maxDiscount: promo.maxDiscount,
      discountAmount,
    };

    return NextResponse.json({ valid: true, promo: info });
  } catch (error) {
    console.error('Promo validate error:', error);
    return NextResponse.json({ valid: false, error: 'Internal server error' }, { status: 500 });
  }
}
