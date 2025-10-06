import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Scalev API configuration
const SCALEV_API_BASE = 'https://api.scalev.id/v2';
const SCALEV_API_KEY = process.env.SCALEV_API_KEY;

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile with payment info
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('payment_status, payment_customer_id, payment_completed_at, last_payment_check')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // If user has already paid, grant access
    if (profile.payment_status === 'paid') {
      return NextResponse.json({
        payment_status: 'paid',
        has_access: true,
        payment_completed_at: profile.payment_completed_at
      });
    }

    // If no payment customer ID, user hasn't initiated payment
    if (!profile.payment_customer_id) {
      return NextResponse.json({
        payment_status: 'unpaid',
        has_access: false,
        message: 'User needs to complete payment'
      });
    }

    // Check with Scalev API for payment status
    if (!SCALEV_API_KEY) {
      return NextResponse.json({
        payment_status: profile.payment_status,
        has_access: profile.payment_status === 'paid',
        message: 'Scalev API key not configured'
      });
    }

    try {
      // Check order/payment status via Scalev API
      const response = await fetch(`${SCALEV_API_BASE}/order/${profile.payment_customer_id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${SCALEV_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        // If API fails, fallback to database status
        return NextResponse.json({
          payment_status: profile.payment_status,
          has_access: profile.payment_status === 'paid',
          message: 'Using cached status due to API error'
        });
      }

      const paymentData = await response.json();

      // Update database based on Scalev response
      let newStatus = profile.payment_status;
      let completedAt = profile.payment_completed_at;

      if (paymentData.status === 'paid' || paymentData.status === 'success') {
        newStatus = 'paid';
        completedAt = new Date().toISOString();
      } else if (paymentData.status === 'failed') {
        newStatus = 'failed';
      } else if (paymentData.status === 'pending') {
        newStatus = 'pending';
      }

      // Update database with latest status
      await supabase
        .from('user_profiles')
        .update({
          payment_status: newStatus,
          payment_completed_at: completedAt,
          last_payment_check: new Date().toISOString()
        })
        .eq('id', user.id);

      return NextResponse.json({
        payment_status: newStatus,
        has_access: newStatus === 'paid',
        payment_completed_at: completedAt,
        payment_data: paymentData
      });

    } catch (apiError) {
      // If API call fails, use cached status
      return NextResponse.json({
        payment_status: profile.payment_status,
        has_access: profile.payment_status === 'paid',
        message: 'Using cached status due to API error'
      });
    }

  } catch (error) {
    console.error('Payment check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
