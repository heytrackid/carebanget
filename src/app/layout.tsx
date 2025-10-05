import { AppPreloader } from "@/components/ui/app-preloader";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OfflineProvider } from '@/contexts/OfflineContext';
import { queryClient } from '@/lib/react-query';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Parenting Meal Planner",
  description: "AI-powered meal planning and nutrition tracking for parents",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#667eea',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <AppPreloader>
          <QueryClientProvider client={queryClient}>
            <OfflineProvider>
              {children}
            </OfflineProvider>
          </QueryClientProvider>
        </AppPreloader>
      </body>
    </html>
  );
}
