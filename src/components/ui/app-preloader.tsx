'use client';

import { useEffect, useState } from 'react';
import { LoadingSpinner } from './loading-states';

interface AppPreloaderProps {
  children: React.ReactNode;
  onReady?: () => void;
}

export function AppPreloader({ children, onReady }: AppPreloaderProps) {
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Step 1: Check service worker (10%)
        setProgress(10);
        if ('serviceWorker' in navigator) {
          await navigator.serviceWorker.ready;
        }

        // Step 2: Preload critical fonts (30%)
        setProgress(30);
        await preloadFont('/fonts/inter.woff2');

        // Step 3: Check authentication (50%)
        setProgress(50);
        // Auth check will happen in layout

        // Step 4: Preload critical images (70%)
        setProgress(70);
        await preloadImage('/icon-192.png');

        // Step 5: Initialize data (90%)
        setProgress(90);
        // Data preloading will happen in providers

        // Step 6: Complete (100%)
        setProgress(100);

        // Small delay for smooth transition
        setTimeout(() => {
          setIsReady(true);
          onReady?.();
        }, 300);

      } catch (error) {
        console.warn('Preloader error:', error);
        // Still proceed even if some preloading fails
        setIsReady(true);
        onReady?.();
      }
    };

    initializeApp();
  }, [onReady]);

  if (isReady) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 flex items-center justify-center z-50">
      <div className="text-center space-y-8 max-w-md mx-auto px-4">
        {/* Animated Logo */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl">
            <svg className="w-12 h-12 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          {/* Pulsing ring */}
          <div className="absolute inset-0 rounded-3xl border-4 border-pink-300 animate-ping opacity-20" />
        </div>

        {/* Brand */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
            Parenting Meal Planner
          </h1>
          <p className="text-gray-600 text-lg">Mempersiapkan aplikasi untuk Anda...</p>
        </div>

        {/* Progress */}
        <div className="space-y-4">
          <div className="w-full bg-white/50 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-pink-500 via-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600 font-medium">
            <span>Mempersiapkan...</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center items-center space-x-2">
          <LoadingSpinner size="md" />
          <span className="text-gray-600 text-sm">Mohon tunggu sebentar</span>
        </div>

        {/* Loading Steps */}
        <div className="text-left space-y-2 text-sm text-gray-500">
          {progress >= 10 && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Service Worker siap</span>
            </div>
          )}
          {progress >= 30 && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Font dimuat</span>
            </div>
          )}
          {progress >= 50 && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span>Autentikasi diperiksa</span>
            </div>
          )}
          {progress >= 70 && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span>Gambar dimuat</span>
            </div>
          )}
          {progress >= 90 && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <span>Data diinisialisasi</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Utility functions
async function preloadFont(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = 'font';
    link.crossOrigin = 'anonymous';

    link.onload = () => resolve();
    link.onerror = () => resolve(); // Don't fail on font load

    document.head.appendChild(link);

    // Timeout after 2 seconds
    setTimeout(() => resolve(), 2000);
  });
}

async function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // Don't fail on image load
    img.src = url;

    // Timeout after 2 seconds
    setTimeout(() => resolve(), 2000);
  });
}
