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
          // Create profile directly in user_profiles table
          console.log('Creating profile for Auth0 user:', session.user.email);
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
          } else {
            console.log('Profile created successfully for:', session.user.email);
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
