'use client';

import { useOffline } from '@/contexts/OfflineContext';
import { Wifi, WifiOff, Cloud, CloudOff } from 'lucide-react';
import { useEffect, useState } from 'react';

export function OfflineIndicator() {
  const { isOnline, isRegistered, lastSync } = useOffline();
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    // Show indicator when offline or when online after being offline
    if (!isOnline) {
      setShowIndicator(true);
    } else {
      // Show success indicator briefly when coming back online
      setShowIndicator(true);
      const timer = setTimeout(() => setShowIndicator(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (!showIndicator && isOnline) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${
      isOnline 
        ? 'bg-green-100 text-green-800 border border-green-200' 
        : 'bg-red-100 text-red-800 border border-red-200'
    }`}>
      {isOnline ? (
        <>
          <Wifi className="w-4 h-4" />
          <span className="text-sm font-medium">Online</span>
          {isRegistered && <Cloud className="w-4 h-4 text-green-600" />}
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4" />
          <span className="text-sm font-medium">Offline</span>
          <CloudOff className="w-4 h-4 text-red-600" />
        </>
      )}

      {lastSync && (
        <span className="text-xs text-gray-600 ml-2">
          Last sync: {lastSync.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}

export function OfflineBanner() {
  const { isOnline } = useOffline();

  if (isOnline) return null;

  return (
    <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2">
      <div className="flex items-center justify-center gap-2 text-yellow-800">
        <WifiOff className="w-4 h-4" />
        <span className="text-sm font-medium">
          You're currently offline. Some features may be limited.
        </span>
      </div>
    </div>
  );
}
