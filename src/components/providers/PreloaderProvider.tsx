'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Preloader, preloaders } from '@/components/ui/preloader';
import { useDataPreloader } from '@/hooks/useDataPreloader';

interface PreloaderProviderProps {
  children: React.ReactNode;
}

export function PreloaderProvider({ children }: PreloaderProviderProps) {
  const pathname = usePathname();
  const { preloadPageData } = useDataPreloader();

  // Determine preload resources based on current route
  const getPreloadResources = () => {
    // Base app resources
    let resources = [...preloaders.app];

    // Route-specific resources
    if (pathname === '/dashboard' || pathname === '/') {
      resources.push(...preloaders.dashboard);
    } else if (pathname.startsWith('/recipes')) {
      resources.push(...preloaders.recipes);
    }

    return resources;
  };

  // Preload data for current route
  useEffect(() => {
    const preloadRouteData = async () => {
      if (pathname === '/dashboard' || pathname === '/') {
        await preloadPageData('dashboard');
      } else if (pathname.startsWith('/recipes')) {
        await preloadPageData('recipes');
      } else if (pathname.startsWith('/expenses')) {
        await preloadPageData('expenses');
      }
    };

    preloadRouteData();
  }, [pathname, preloadPageData]);

  return (
    <Preloader
      resources={getPreloadResources()}
      onComplete={() => {
        console.log('🎉 All preloading completed for route:', pathname);
      }}
    >
      {children}
    </Preloader>
  );
}
