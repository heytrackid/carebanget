'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PaymentGuardProps {
  children: React.ReactNode;
}

interface PaymentStatus {
  payment_status: string;
  has_access: boolean;
  payment_completed_at?: string;
  message?: string;
}

export default function PaymentGuard({ children }: PaymentGuardProps) {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkPaymentStatus();
  }, []);

  const checkPaymentStatus = async () => {
    try {
      const response = await fetch('/api/payment-status');
      const data = await response.json();
      setPaymentStatus(data);
    } catch (error) {
      console.error('Error checking payment status:', error);
      // If API fails, assume no access
      setPaymentStatus({
        payment_status: 'error',
        has_access: false,
        message: 'Unable to verify payment status'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying payment status...</p>
        </div>
      </div>
    );
  }

  // If user has access, show the protected content
  if (paymentStatus?.has_access) {
    return <>{children}</>;
  }

  // Show payment required page
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-xl flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payment Required</h1>
            <p className="text-sm text-gray-600 mt-1">Complete your payment to access Carebanget</p>
          </div>
        </div>

        {/* Payment Required Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-lg text-red-600">Access Restricted</CardTitle>
            <CardDescription>
              You need to complete your one-time payment to use the Carebanget meal planning and nutrition tracking features.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm">
                  <p className="font-medium text-red-800">Payment Status: {paymentStatus?.payment_status || 'Unknown'}</p>
                  <p className="text-red-700 mt-1">
                    {paymentStatus?.message || 'Please complete your payment to continue using the app.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button className="w-full" onClick={() => window.open('https://scalev.id/payment-link', '_blank')}>
                Complete Payment
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/auth/logout')}
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Need help? Contact our support team
          </p>
        </div>
      </div>
    </div>
  );
}
