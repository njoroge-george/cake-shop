import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Public endpoint: list categories for filters and navigation
export async function GET(_req: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
