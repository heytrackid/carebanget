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

  // For protected routes, ensure user exists in Supabase and has profile
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    try {
      const session = await auth0.getSession(request);

      if (session?.user) {
        const supabase = createClient();

        // This will trigger the database trigger to create profile if it doesn't exist
        // The database trigger on auth.users will auto-create user_profiles
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
          console.error('Supabase auth error:', error);
        }

        // Also ensure profile exists in user_profiles table
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('id', session.user.sub)
          .single();

        if (!profile) {
          // Manual profile creation as fallback
          console.log('Creating profile for user:', session.user.email);
          const { error: profileError } = await supabase.rpc('create_user_profile', {
            user_id: session.user.sub,
            user_email: session.user.email,
            user_name: session.user.name || null
          });

          if (profileError) {
            console.error('Profile creation error:', profileError);
          }
        }
      }
    } catch (error) {
      console.error('Middleware error:', error);
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
