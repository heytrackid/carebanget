import type { NextRequest } from "next/server";
import { auth0 } from "./lib/auth0";
import { createClient } from '@/lib/supabase/server';

export async function middleware(request: NextRequest) {
  // First check authentication
  const authResponse = await auth0.middleware(request);

  // If it's an auth-related request, let it pass through
  if (request.nextUrl.pathname.startsWith('/auth/')) {
    return authResponse;
  }

  // For protected routes, check if user needs profile creation
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Check if profile exists, if not, trigger creation
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('id', user.id)
          .single();

        if (!profile) {
          // Profile doesn't exist, create it
          await supabase
            .from('user_profiles')
            .insert({
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.name || user.email?.split('@')[0],
              avatar_url: user.user_metadata?.picture,
              payment_status: 'unpaid',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
        }
      }
    } catch (error) {
      console.error('Middleware profile creation error:', error);
      // Continue anyway - don't block the request
    }
  }

  // For protected routes, we let the client-side component handle payment checks
  // The middleware focuses on authentication only
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
