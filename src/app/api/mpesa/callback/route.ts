import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { parseMpesaCallback } from '@/lib/mpesa';

export async function POST(req: NextRequest) {
  try {
    const callbackData = await req.json();

    console.log('M-Pesa Callback received:', JSON.stringify(callbackData, null, 2));

    const result = parseMpesaCallback(callbackData);

    if (result.success) {
      // Find order by checkout request ID or merchant request ID
      // You'll need to store these IDs when creating the order
      // For now, we'll update by mpesaRef if available

      if (result.mpesaRef) {
        await prisma.order.updateMany({
          where: {
            mpesaReference: result.checkoutRequestId,
          },
          data: {
            paymentStatus: 'COMPLETED',
            status: 'CONFIRMED',
          },
        });
      }

      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' });
    } else {
      // Payment failed
      await prisma.order.updateMany({
        where: {
          mpesaReference: result.checkoutRequestId,
        },
        data: {
          paymentStatus: 'FAILED',
        },
      });

      return NextResponse.json({
        ResultCode: result.resultCode,
        ResultDesc: result.resultDesc,
      });
    }
  } catch (error) {
    console.error('M-Pesa callback error:', error);
    return NextResponse.json(
      { ResultCode: 1, ResultDesc: 'Failed to process callback' },
      { status: 500 }
    );
  }
}
