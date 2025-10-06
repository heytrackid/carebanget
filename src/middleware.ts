import type { NextRequest } from "next/server";
import { auth0 } from "./lib/auth0";
import { createClient } from '@/lib/supabase/server';

export async function middleware(request: NextRequest) {
  // Auth0 middleware handles authentication
  const authResponse = await auth0.middleware(request);

  // If it's an auth-related request, let it pass through
  if (request.nextUrl.pathname.startsWith('/auth/')) {
    return authResponse;
  }

  // For protected routes, ensure user has profile in Supabase
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    try {
      const session = await auth0.getSession(request);

      if (session?.user) {
        const supabase = createClient();

        // Check if profile exists in user_profiles
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('id, payment_status')
          .eq('id', session.user.sub)
          .single();

        if (!profile) {
          // OPTION 1: Check if this email has already paid (pre-paid flow via webhook)
          const { data: existingProfile } = await supabase
            .from('user_profiles')
            .select('id, payment_status')
            .eq('email', session.user.email)
            .eq('payment_status', 'paid')
            .single();

          if (existingProfile) {
            // User has already paid, create profile with paid status
            console.log('Found existing paid user (webhook), creating Auth0 profile:', session.user.email);
            const { error: profileError } = await supabase
              .from('user_profiles')
              .insert({
                id: session.user.sub,
                email: session.user.email,
                full_name: session.user.name || session.user.email?.split('@')[0],
                avatar_url: session.user.picture,
                payment_status: 'paid', // Inherit paid status
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });

            if (profileError) {
              console.error('Profile creation error:', profileError);
            } else {
              console.log('Paid profile created successfully for:', session.user.email);
            }
          } else {
            // OPTION 2: API Polling - Check payment status via Scalev API
            console.log('Checking payment status via API for:', session.user.email);
            try {
              const paymentResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003'}/api/check-payment`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: session.user.email }),
              });

              const paymentData = await paymentResponse.json();

              if (paymentData.success) {
                // Payment found, create paid profile
                console.log('Payment found via API, creating paid profile:', session.user.email);
                const { error: profileError } = await supabase
                  .from('user_profiles')
                  .insert({
                    id: session.user.sub,
                    email: session.user.email,
                    full_name: session.user.name || session.user.email?.split('@')[0],
                    avatar_url: session.user.picture,
                    payment_status: 'paid',
                    payment_data: paymentData,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  });

                if (profileError) {
                  console.error('Profile creation error:', profileError);
                } else {
                  console.log('Paid profile created successfully for:', session.user.email);
                }
              } else {
                // No payment found, create unpaid profile
                console.log('No payment found, creating unpaid profile for:', session.user.email);
                const { error: profileError } = await supabase
                  .from('user_profiles')
                  .insert({
                    id: session.user.sub,
                    email: session.user.email,
                    full_name: session.user.name || session.user.email?.split('@')[0],
                    avatar_url: session.user.picture,
                    payment_status: 'unpaid',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  });

                if (profileError) {
                  console.error('Profile creation error:', profileError);
                }
              }
            } catch (apiError) {
              console.error('Payment API check failed:', apiError);
              // Fallback: create unpaid profile
              const { error: profileError } = await supabase
                .from('user_profiles')
                .insert({
                  id: session.user.sub,
                  email: session.user.email,
                  full_name: session.user.name || session.user.email?.split('@')[0],
                  avatar_url: session.user.picture,
                  payment_status: 'unpaid',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                });

              if (profileError) {
                console.error('Fallback profile creation error:', profileError);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Middleware profile creation error:', error);
      // Continue anyway - don't block the request
    }
  }

  return authResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - / (home page - should be accessible for login)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|^/$).*)"
  ]
};
