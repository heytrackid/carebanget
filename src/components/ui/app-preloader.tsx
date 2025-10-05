'use client';

import { useEffect, useState } from 'react';

interface AppPreloaderProps {
  children: React.ReactNode;
  onReady?: () => void;
}

export function AppPreloader({ children, onReady }: AppPreloaderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Skip preloader - langsung ready
    setIsReady(true);
    onReady?.();
  }, [onReady]);

  // Langsung render children tanpa preloader
  return <>{children}</>;
}

// Utility functions (disabled for now)
async function preloadFont(url: string): Promise<void> {
  return Promise.resolve();
}

async function preloadImage(url: string): Promise<void> {
  return Promise.resolve();
}
