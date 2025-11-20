import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const KEYS = {
  NUMBER: 'PAYBILL_NUMBER',
  DEFAULT_ACCOUNT: 'PAYBILL_DEFAULT_ACCOUNT',
  NOTE: 'PAYBILL_NOTE',
};

export async function GET() {
  try {
    const keys = Object.values(KEYS);
    const settings = await prisma.setting.findMany({ where: { key: { in: keys } } });
    const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    return NextResponse.json({
      number: map[KEYS.NUMBER] || '',
      defaultAccount: map[KEYS.DEFAULT_ACCOUNT] || '',
      note: map[KEYS.NOTE] || '',
    });
  } catch (e) {
    console.error('Failed to fetch public paybill settings', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
