import type { NextRequest } from "next/server";
import { auth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {
  // First check authentication
  const authResponse = await auth0.middleware(request);

  // If it's an auth-related request, let it pass through
  if (request.nextUrl.pathname.startsWith('/auth/')) {
    return authResponse;
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
