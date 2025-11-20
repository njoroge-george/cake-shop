import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

type MonthlyPoint = { month: string; sales: number; orders: number };
type NameValue = { name: string; value: number };
type TopCake = { cakeId: string; name: string; totalSold: number; revenue: number };

function getLast12Months(): { key: string; label: string; date: Date }[] {
  const months: { key: string; label: string; date: Date }[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleString('en-US', { month: 'short' });
    months.push({ key, label, date: d });
  }
  return months;
}

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const monthBuckets = getLast12Months();
    const rangeStart = new Date(monthBuckets[0].date);
    // Range end: first day of next month after last bucket
    const last = monthBuckets[monthBuckets.length - 1].date;
    const rangeEnd = new Date(last.getFullYear(), last.getMonth() + 1, 1);

    // Pull orders in range that are paid (for trend/category/top-cakes)
    const paidOrdersInRange = await prisma.order.findMany({
      where: {
        createdAt: { gte: rangeStart, lt: rangeEnd },
        paymentStatus: 'COMPLETED',
      },
      select: { id: true, total: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    // Sales trend by month (sum totals and count orders)
    const salesTrendMap = new Map<string, { sales: number; orders: number }>();
    for (const m of monthBuckets) salesTrendMap.set(m.key, { sales: 0, orders: 0 });
    for (const o of paidOrdersInRange) {
      const key = `${o.createdAt.getFullYear()}-${String(o.createdAt.getMonth() + 1).padStart(2, '0')}`;
      const entry = salesTrendMap.get(key);
      if (entry) {
        entry.sales += o.total || 0;
        entry.orders += 1;
      }
    }
    const salesTrend: MonthlyPoint[] = monthBuckets.map((m) => ({
      month: m.label,
      sales: Math.round((salesTrendMap.get(m.key)?.sales || 0) * 100) / 100,
      orders: salesTrendMap.get(m.key)?.orders || 0,
    }));

    // Order status breakdown (all-time)
    const statuses: Array<keyof typeof import('@prisma/client').OrderStatus> = [
      'PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED',
    ] as any;
    const orderStatus: NameValue[] = [];
    for (const s of statuses) {
      const cnt = await prisma.order.count({ where: { status: s as any } });
      orderStatus.push({ name: s, value: cnt });
    }

    // Category distribution (by quantity sold in last 12 months on paid orders)
    const orderItemsInRange = await prisma.orderItem.findMany({
      where: {
        order: {
          createdAt: { gte: rangeStart, lt: rangeEnd },
          paymentStatus: 'COMPLETED',
        },
      },
      include: {
        cake: { include: { category: true } },
      },
    });

    const categoryMap = new Map<string, number>();
    for (const item of orderItemsInRange) {
      const cat = item.cake?.category?.name || 'Other';
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + item.quantity);
    }
    const categoryDistribution: NameValue[] = Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    // Top cakes (by quantity + revenue in last 12 months on paid orders)
    const cakeAgg = new Map<string, { qty: number; revenue: number; name: string }>();
    for (const item of orderItemsInRange) {
      const id = item.cakeId;
      const name = item.cake?.name || 'Unknown Cake';
      const prev = cakeAgg.get(id) || { qty: 0, revenue: 0, name };
      prev.qty += item.quantity;
      prev.revenue += item.subtotal || item.price * item.quantity;
      prev.name = name; // ensure name set
      cakeAgg.set(id, prev);
    }
    const topCakes: TopCake[] = Array.from(cakeAgg.entries())
      .map(([cakeId, v]) => ({ cakeId, name: v.name, totalSold: v.qty, revenue: Math.round(v.revenue * 100) / 100 }))
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 6);

    // Dashboard stats (all-time)
    const [totalOrders, totalCompletedOrders, totalPendingOrders, totalRevenueAgg, totalCustomers, lowStock, unreadMessages, pendingCustomOrders, activeCakes] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { paymentStatus: 'COMPLETED' } }),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: 'COMPLETED' } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.cake.count({ where: { OR: [{ stock: { lt: 5 } }, { inStock: false }] } }),
      prisma.message.count({ where: { isRead: false } }),
      prisma.customOrder.count({ where: { status: 'PENDING' } }),
      prisma.cake.count({ where: { isVisible: true, inStock: true } }),
    ]);

    const totalRevenue = Math.round((totalRevenueAgg._sum.total || 0) * 100) / 100;

    // Get new customers this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const newCustomersThisWeek = await prisma.user.count({
      where: {
        role: 'CUSTOMER',
        createdAt: { gte: weekAgo },
      },
    });

    // Get today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await prisma.order.count({
      where: {
        createdAt: { gte: today },
      },
    });

    // Calculate revenue growth (last 30 days vs previous 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const [currentPeriodRevenue, previousPeriodRevenue] = await Promise.all([
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          paymentStatus: 'COMPLETED',
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          paymentStatus: 'COMPLETED',
          createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
        },
      }),
    ]);

    const currentRevenue = currentPeriodRevenue._sum.total || 0;
    const previousRevenue = previousPeriodRevenue._sum.total || 0;
    const revenueGrowth = previousRevenue > 0
      ? Math.round(((currentRevenue - previousRevenue) / previousRevenue) * 1000) / 10
      : 0;

    return NextResponse.json({
      stats: {
        totalOrders,
        totalRevenue,
        pendingOrders: totalPendingOrders,
        completedOrders: totalCompletedOrders,
        totalCustomers,
        lowStock,
        unreadMessages,
        pendingCustomOrders,
        activeCakes,
        newCustomersThisWeek,
        todayOrders,
        revenueGrowth,
      },
      salesTrend,
      categoryDistribution,
      topCakes,
      orderStatus,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to load analytics' }, { status: 500 });
  }
}
