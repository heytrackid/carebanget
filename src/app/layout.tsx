'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { QueryClientProvider } from '@tanstack/react-query';
import { OfflineProvider } from '@/contexts/OfflineContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { queryClient } from '@/lib/react-query';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { ProfileSyncProvider } from '@/components/ProfileSyncProvider';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <title>Carebanget</title>
        <meta name="description" content="AI-powered meal planning and nutrition tracking for parents" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#667eea" />
      </head>
      <body className={inter.className}>
        <UserProvider>
          <QueryClientProvider client={queryClient}>
            <NotificationProvider>
              <OfflineProvider>
                <ProfileSyncProvider>
                  {children}
                </ProfileSyncProvider>
              </OfflineProvider>
            </NotificationProvider>
          </QueryClientProvider>
        </UserProvider>
      </body>
    </html>
  );
}
