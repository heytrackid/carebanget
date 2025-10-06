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

  // For protected routes, check if user has valid Auth0 session
  // and ensure they have a profile in Supabase
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    try {
      const session = await auth0.getSession(request);

      if (session?.user) {
        // Check if profile exists, if not, create it
        const supabase = createClient();
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('id', session.user.sub)
          .single();

        if (!profile) {
          // Create profile with Auth0 user info
          await supabase
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
        }
      }
    } catch (error) {
      console.error('Middleware profile creation error:', error);
      // Continue anyway - let client-side handle authentication errors
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
