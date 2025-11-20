import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    console.log('Fetching cake with ID:', id);
    
    const cake = await prisma.cake.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: { id: true, name: true, image: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    console.log('Cake found:', cake ? 'Yes' : 'No');

    if (!cake) {
      return NextResponse.json({ error: 'Cake not found' }, { status: 404 });
    }

    const averageRating =
      cake.reviews.length > 0
        ? cake.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / cake.reviews.length
        : 0;

    return NextResponse.json({
      ...cake,
      averageRating,
      reviewCount: cake.reviews.length,
    });
  } catch (error: any) {
    console.error('Error fetching cake:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

// 🟠 UPDATE a cake (Admin only)
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    const cake = await prisma.cake.update({
      where: { id },
      data,
      include: { category: true },
    });

    return NextResponse.json(cake);
  } catch (error: any) {
    console.error('Error updating cake:', error.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH partial update (Admin only)
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    const cake = await prisma.cake.update({
      where: { id },
      data,
      include: { category: true },
    });

    return NextResponse.json(cake);
  } catch (error: any) {
    console.error('Error patching cake:', error.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 🔴 DELETE a cake (Admin only)
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.cake.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Cake deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting cake:', error.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
