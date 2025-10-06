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
        message: 'Tidak dapat memverifikasi status pembayaran'
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
          <p className="text-gray-600">Memverifikasi status pembayaran...</p>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pembayaran Diperlukan</h1>
            <p className="text-sm text-gray-600 mt-1">Lengkapi pembayaran Anda untuk mengakses Carebanget</p>
          </div>
        </div>

        {/* Payment Required Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-lg text-red-600">Akses Dibatasi</CardTitle>
            <CardDescription>
              Anda perlu melengkapi pembayaran satu kali untuk menggunakan fitur perencanaan makan dan pelacakan nutrisi Carebanget.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm">
                  <p className="font-medium text-red-800">Status Pembayaran: {paymentStatus?.payment_status || 'Tidak Diketahui'}</p>
                  <p className="text-red-700 mt-1">
                    {paymentStatus?.message || 'Silakan lengkapi pembayaran Anda untuk melanjutkan menggunakan aplikasi.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button className="w-full" onClick={() => window.open('https://app.scalev.id/pay/carebanget-premium', '_blank')}>
                Lengkapi Pembayaran
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/auth/logout')}
              >
                Keluar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Butuh bantuan? Hubungi tim dukungan kami
          </p>
        </div>
      </div>
    </div>
  );
}
