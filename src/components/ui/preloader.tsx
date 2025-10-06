'use client';

import { useEffect, useState } from 'react';
import { LoadingSpinner } from './loading-states';

interface PreloaderProps {
  children: React.ReactNode;
  resources?: PreloadResource[];
  onComplete?: () => void;
}

interface PreloadResource {
  type: 'font' | 'image' | 'script' | 'style';
  url: string;
  as?: string;
  crossOrigin?: string;
}

export function Preloader({ children, resources = [], onComplete }: PreloaderProps) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadResources = async () => {
      const totalResources = resources.length;
      let loadedCount = 0;

      if (totalResources === 0) {
        setLoading(false);
        onComplete?.();
        return;
      }

      // Preload fonts
      const fontPromises = resources
        .filter(r => r.type === 'font')
        .map(resource => {
          return new Promise<void>((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.url;
            link.as = 'font';
            link.crossOrigin = resource.crossOrigin || 'anonymous';
            
            link.onload = () => {
              loadedCount++;
              setProgress((loadedCount / totalResources) * 100);
              resolve();
            };
            
            link.onerror = reject;
            document.head.appendChild(link);
          });
        });

      // Preload images
      const imagePromises = resources
        .filter(r => r.type === 'image')
        .map(resource => {
          return new Promise<void>((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
              loadedCount++;
              setProgress((loadedCount / totalResources) * 100);
              resolve();
            };
            img.onerror = reject;
            img.src = resource.url;
          });
        });

      // Preload styles
      const stylePromises = resources
        .filter(r => r.type === 'style')
        .map(resource => {
          return new Promise<void>((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.url;
            link.as = 'style';
            
            link.onload = () => {
              loadedCount++;
              setProgress((loadedCount / totalResources) * 100);
              resolve();
            };
            
            link.onerror = reject;
            document.head.appendChild(link);
          });
        });

      try {
        await Promise.all([...fontPromises, ...imagePromises, ...stylePromises]);
        setProgress(100);
        
        // Small delay for smooth transition
        setTimeout(() => {
          setLoading(false);
          onComplete?.();
        }, 200);
        
      } catch (error) {
        console.warn('Some resources failed to preload:', error);
        // Still complete loading even if some resources fail
        setLoading(false);
        onComplete?.();
      }
    };

    loadResources();
  }, [resources, onComplete]);

  if (loading) {
    return (
      <PreloaderScreen progress={progress} />
    );
  }

  return <>{children}</>;
}

function PreloaderScreen({ progress }: { progress: number }) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-50 to-blue-50 flex items-center justify-center z-50">
      <div className="text-center space-y-8">
        {/* Logo/Brand */}
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Carebanget</h1>
          <p className="text-gray-600">Memuat aplikasi...</p>
        </div>

        {/* Progress Bar */}
        <div className="w-80 max-w-sm mx-auto space-y-4">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-pink-500 to-blue-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Loading resources...</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center">
          <div className="relative">
            <LoadingSpinner size="lg" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-pink-500 animate-spin" 
                 style={{ animationDuration: '1s' }} />
          </div>
        </div>

        {/* Fun loading messages */}
        <div className="text-sm text-gray-500">
          {progress < 25 && "Menyiapkan resep..."}
          {progress >= 25 && progress < 50 && "Memuat bahan makanan..."}
          {progress >= 50 && progress < 75 && "Mengatur jadwal makan..."}
          {progress >= 75 && progress < 100 && "Hampir selesai..."}
          {progress >= 100 && "Siap digunakan! 🎉"}
        </div>
      </div>
    </div>
  );
}

// Utility functions for different preload scenarios
export const preloaders = {
  // Critical app resources
  app: [
    { type: 'font' as const, url: '/fonts/inter.woff2', crossOrigin: 'anonymous' },
    { type: 'image' as const, url: '/icon-192.png' },
    { type: 'style' as const, url: '/globals.css' },
  ],
  
  // Dashboard specific resources
  dashboard: [
    { type: 'image' as const, url: '/avatars/child.jpg' },
    { type: 'font' as const, url: '/fonts/inter-medium.woff2', crossOrigin: 'anonymous' },
  ],
  
  // Recipe specific resources
  recipes: [
    { type: 'image' as const, url: '/placeholder-recipe.jpg' },
  ],
};

export default Preloader;
