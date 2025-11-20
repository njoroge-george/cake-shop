import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

const KEYS = {
  NUMBER: 'PAYBILL_NUMBER',
  DEFAULT_ACCOUNT: 'PAYBILL_DEFAULT_ACCOUNT',
  NOTE: 'PAYBILL_NOTE',
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const keys = Object.values(KEYS);
    const settings = await prisma.setting.findMany({ where: { key: { in: keys } } });
    const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    return NextResponse.json({
      number: map[KEYS.NUMBER] || '',
      defaultAccount: map[KEYS.DEFAULT_ACCOUNT] || '',
      note: map[KEYS.NOTE] || '',
    });
  } catch (e) {
    console.error('Failed to fetch paybill settings', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { number, defaultAccount, note } = await req.json();

    const ops = [] as any[];
    if (typeof number === 'string') {
      ops.push(
        prisma.setting.upsert({
          where: { key: KEYS.NUMBER },
          update: { value: number },
          create: { key: KEYS.NUMBER, value: number },
        })
      );
    }
    if (typeof defaultAccount === 'string') {
      ops.push(
        prisma.setting.upsert({
          where: { key: KEYS.DEFAULT_ACCOUNT },
          update: { value: defaultAccount },
          create: { key: KEYS.DEFAULT_ACCOUNT, value: defaultAccount },
        })
      );
    }
    if (typeof note === 'string') {
      ops.push(
        prisma.setting.upsert({
          where: { key: KEYS.NOTE },
          update: { value: note },
          create: { key: KEYS.NOTE, value: note },
        })
      );
    }

    await prisma.$transaction(ops);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Failed to update paybill settings', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
