import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import type { CakeSize, CakeLayer } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session && (session.user as any).role === 'ADMIN';

    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const where: any = {
      inStock: true,
    };

    // Only show visible cakes to non-admin users
    if (!isAdmin) {
      where.isVisible = true;
    }

    if (category) {
      where.category = { slug: category };
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }

    // Sort handling
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price-low') orderBy = { basePrice: 'asc' };
    else if (sort === 'price-high') orderBy = { basePrice: 'desc' };
    else if (sort === 'popular') orderBy = [{ reviews: { _count: 'desc' } }, { createdAt: 'desc' }];

    const [cakes, total] = await Promise.all([
      prisma.cake.findMany({
        where,
        include: {
          category: true,
          reviews: {
            select: {
              rating: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.cake.count({ where }),
    ]);

        const cakesWithRatings = cakes.map((cake: any) => ({
      ...cake,
      sizes: cake.sizes as CakeSize[],
      layers: cake.layers as CakeLayer[],
      averageRating: cake.reviews && cake.reviews.length > 0
          ? cake.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / cake.reviews.length
          : 0,
    }));

    return NextResponse.json({
      cakes: cakesWithRatings,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching cakes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const cake = await prisma.cake.create({
      data: {
        ...data,
        slug,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(cake, { status: 201 });
  } catch (error) {
    console.error('Error creating cake:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
