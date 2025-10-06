import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Scalev webhook received:', body);

    const { event, data } = body;

    // Only process payment success events
    if (event === 'order.paid' || (event === 'order.created' && data.payment_status === 'paid')) {
      const { destination_address, payment_status } = data;
      const customerEmail = destination_address?.email;

      if (!customerEmail) {
        console.error('No customer email in webhook');
        return NextResponse.json({ error: 'No customer email' }, { status: 400 });
      }

      if (payment_status === 'paid') {
        const supabase = createClient();

        // Update or create user profile with paid status
        const { error } = await supabase
          .from('user_profiles')
          .upsert({
            id: customerEmail, // Use email as ID for now (will be replaced with Auth0 sub later)
            email: customerEmail,
            full_name: destination_address?.name || customerEmail.split('@')[0],
            payment_status: 'paid',
            payment_data: data, // Store full payment data
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'email'
          });

        if (error) {
          console.error('Error updating user profile:', error);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        console.log('User profile updated to paid:', customerEmail);
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
