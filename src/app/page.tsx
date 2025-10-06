import { auth0 } from "../lib/auth0";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default async function HomePage() {
  const session = await auth0.getSession();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gray-900 rounded-xl flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Carebanget</h1>
            <p className="text-sm text-gray-600 mt-1">AI-powered meal planning and nutrition tracking</p>
          </div>
        </div>

        {/* Auth Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-lg">
              {session ? `Welcome back, ${session.user.name}!` : "Welcome"}
            </CardTitle>
            <CardDescription>
              {session
                ? "Ready to manage your family's nutrition?"
                : "Sign in to access your meal planning dashboard"
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {!session ? (
              <>
                <div className="space-y-3">
                  <Button asChild className="w-full">
                    <a href="/auth/login?screen_hint=signup">
                      Get Started
                    </a>
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Already have an account?</span>
                    </div>
                  </div>

                  <Button asChild variant="outline" className="w-full">
                    <a href="/auth/login">
                      Sign In
                    </a>
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <a href="/dashboard">
                    Go to Dashboard
                  </a>
                </Button>

                <Separator />

                <Button asChild variant="ghost" className="w-full text-gray-600 hover:text-gray-900">
                  <a href="/auth/logout?returnTo=/">
                    Sign Out
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Powered by Auth0 • Made for parents
          </p>
        </div>
      </div>
    </div>
  );
}
