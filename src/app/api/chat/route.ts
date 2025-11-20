import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const requestingUserId = (session.user as any).id as string;
    const isAdmin = (session.user as any).role === 'ADMIN';
    const targetUserId = isAdmin && searchParams.get('userId') ? String(searchParams.get('userId')) : requestingUserId;

    const rows = await prisma.message.findMany({
      where: { userId: targetUserId, subject: 'CHAT' },
      select: {
        id: true,
        message: true,
        createdAt: true,
        userId: true,
        repliedBy: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const messages = rows.map(r => ({
      id: r.id,
      text: r.message,
      createdAt: r.createdAt,
      sender: r.repliedBy ? 'ADMIN' : 'USER',
    }));

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Chat GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const role = (session.user as any).role;
    const senderId = (session.user as any).id as string;

    const text = String(body.text || '').trim();
    if (!text) return NextResponse.json({ error: 'Message text required' }, { status: 400 });

    // For customer, send to themselves (their thread). For admin, require target userId.
    const targetUserId = role === 'ADMIN' ? String(body.userId || '') : senderId;
    if (!targetUserId) return NextResponse.json({ error: 'Target userId required' }, { status: 400 });

    const created = await prisma.message.create({
      data: {
        subject: 'CHAT',
        message: text,
        userId: targetUserId,
        // mark replier if admin sent
        repliedBy: role === 'ADMIN' ? senderId : null,
        name: role === 'ADMIN' ? 'Admin' : (session.user as any).name || 'Customer',
        email: role === 'ADMIN' ? null : (session.user as any).email || null,
      },
      select: { id: true, message: true, createdAt: true, repliedBy: true },
    });

    return NextResponse.json({
      message: {
        id: created.id,
        text: created.message,
        createdAt: created.createdAt,
        sender: created.repliedBy ? 'ADMIN' : 'USER',
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Chat POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
