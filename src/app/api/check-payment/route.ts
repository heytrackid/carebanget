import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const SCALEV_API_KEY = process.env.SCALEV_API_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email diperlukan' },
        { status: 400 }
      );
    }

    // Query Scalev API untuk check payment status
    const response = await fetch('https://api.scalev.id/v2/orders', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SCALEV_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Scalev API error:', response.status);
      return NextResponse.json(
        { error: 'Gagal mengakses Scalev API' },
        { status: 500 }
      );
    }

    const ordersData = await response.json();

    // Cari order dengan email yang cocok dan status paid
    const paidOrder = ordersData.data?.find((order: any) =>
      order.destination_address?.email?.toLowerCase() === email.toLowerCase() &&
      order.payment_status === 'paid'
    );

    const supabase = createClient();

    if (paidOrder) {
      // Update/create user profile dengan paid status
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: email, // Temporary ID
          email: email,
          full_name: paidOrder.destination_address?.name || email.split('@')[0],
          payment_status: 'paid',
          payment_data: paidOrder,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'email'
        });

      if (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: 'Pembayaran ditemukan, status updated to paid',
        order_id: paidOrder.order_id,
        amount: paidOrder.net_revenue
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Pembayaran belum ditemukan atau belum lunas'
      });
    }

  } catch (error) {
    console.error('Payment check error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
