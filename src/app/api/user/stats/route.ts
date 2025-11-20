import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as any).id as string;

    const [totalOrders, favoritesCount, pendingOrders] = await Promise.all([
      prisma.order.count({ where: { userId } }),
      prisma.favorite.count({ where: { userId } }),
      prisma.order.count({
        where: {
          userId,
          status: { in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'] },
        },
      }),
    ]);

    return NextResponse.json({ totalOrders, favoritesCount, pendingOrders });
  } catch (error) {
    console.error('User stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
