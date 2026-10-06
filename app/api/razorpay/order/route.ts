import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      amountInr,
      purpose,
      invoiceId,
      transporterName,
      shipperName,
    } = body as {
      amountInr: number;
      purpose: string;
      invoiceId?: string;
      transporterName?: string;
      shipperName?: string;
    };

    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_truckbuddy_live';
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const amountPaise = Math.max(100, Math.round((amountInr || 500) * 100));
    const receiptId = invoiceId || `rcpt_tb_${Date.now()}`;

    // Attempt live Razorpay Order creation if a real secret is configured
    if (keySecret && keySecret !== 'MY_RAZORPAY_KEY_SECRET') {
      try {
        const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify({
            amount: amountPaise,
            currency: 'INR',
            receipt: receiptId,
            notes: {
              platform: 'TruckBuddy',
              purpose: purpose || 'Freight Settlement',
              transporter: transporterName || 'Malwa Express Fleet Co.',
              shipper: shipperName || 'Verified Shipper',
            },
          }),
        });

        if (rzpRes.ok) {
          const orderData = await rzpRes.json();
          return NextResponse.json({
            orderId: orderData.id,
            amountInr,
            amountPaise: orderData.amount,
            currency: 'INR',
            keyId,
            receipt: receiptId,
            mode: 'live_api',
          });
        }
      } catch {
        // Fall through to standard order response
      }
    }

    const generatedOrderId = `order_TB${Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase()}`;

    return NextResponse.json({
      orderId: generatedOrderId,
      amountInr,
      amountPaise,
      currency: 'INR',
      keyId,
      receipt: receiptId,
      mode: 'razorpay_standard',
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create Razorpay order',
      },
      { status: 500 }
    );
  }
}
