'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface OfflineContextType {
  isOnline: boolean;
  isRegistered: boolean;
  lastSync: Date | null;
  syncData: () => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    // Check online status
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration.scope);
          setIsRegistered(true);
        })
        .catch((error) => {
          console.log('SW registration failed:', error);
        });
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const syncData = async () => {
    if (!isOnline) return;

    try {
      // Implement background sync logic here
      // For now, just update last sync time
      setLastSync(new Date());
      console.log('Data synced successfully');
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  return (
    <OfflineContext.Provider value={{
      isOnline,
      isRegistered,
      lastSync,
      syncData
    }}>
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (context === undefined) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
}
