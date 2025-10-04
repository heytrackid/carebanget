'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface OfflineData {
  children: unknown[];
  mealPlans: unknown[];
  recipes: unknown[];
  mealLogs: unknown[];
  growthRecords: unknown[];
  shoppingLists: unknown[];
  settings: Record<string, unknown>;
  lastSync: string;
}

interface OfflineContextType {
  isOnline: boolean;
  data: OfflineData | null;
  syncData: () => Promise<void>;
  saveData: (key: keyof OfflineData, value: OfflineData[keyof OfflineData]) => void;
  clearData: () => void;
}

const OfflineContext = createContext<OfflineContextType | null>(null);

export function useOffline() {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within OfflineProvider');
  }
  return context;
}

interface OfflineProviderProps {
  children: ReactNode;
}

export function OfflineProvider({ children }: OfflineProviderProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [data, setData] = useState<OfflineData | null>(null);

  // Check online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('Back online');
      // syncData(); // Auto sync when back online
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('Connection lost - using offline mode');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    // Initial check
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    }
  }, []);

  const loadLocalData = () => {
    try {
      const stored = localStorage.getItem('parenting-meal-planner-data');
      if (stored) {
        const parsedData = JSON.parse(stored);
        setData(parsedData);
      } else {
        // Initialize with empty data
        const initialData: OfflineData = {
          children: [],
          mealPlans: [],
          recipes: [],
          mealLogs: [],
          growthRecords: [],
          shoppingLists: [],
          settings: {},
          lastSync: new Date().toISOString()
        };
        setData(initialData);
        saveToLocalStorage(initialData);
      }
    } catch (error) {
      console.error('Failed to load local data:', error);
    }
  };

  const saveToLocalStorage = (data: OfflineData) => {
    try {
      localStorage.setItem('parenting-meal-planner-data', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  };

  const saveData = (key: keyof OfflineData, value: OfflineData[keyof OfflineData]) => {
    if (!data) return;

    const newData = {
      ...data,
      [key]: value,
      lastSync: new Date().toISOString()
    };

    setData(newData);
    saveToLocalStorage(newData);

    if (!isOnline) {
      console.log('Data saved locally - will sync when online');
    }
  };

  const syncData = async (): Promise<void> => {
    if (!isOnline || !data) return;

    try {
      // In a real app, this would sync with a backend API
      // For now, we'll just mark as synced
      const syncedData = {
        ...data,
        lastSync: new Date().toISOString()
      };

      setData(syncedData);
      saveToLocalStorage(syncedData);

      console.log('Data synced successfully');
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  const clearData = () => {
    const emptyData: OfflineData = {
      children: [],
      mealPlans: [],
      recipes: [],
      mealLogs: [],
      growthRecords: [],
      shoppingLists: [],
      settings: {},
      lastSync: new Date().toISOString()
    };

    setData(emptyData);
    localStorage.removeItem('parenting-meal-planner-data');
    console.log('All local data cleared');
  };

  // Load data from localStorage on mount
  useEffect(() => {
    loadLocalData();
  }, []);

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && data) {
      syncData();
    }
  }, [isOnline, data]);

  const value: OfflineContextType = {
    isOnline,
    data,
    syncData,
    saveData,
    clearData
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
}

// Hook to check if data needs sync
export function useSyncStatus() {
  const { data, isOnline } = useOffline();

  const needsSync = data && isOnline && (
    new Date().getTime() - new Date(data.lastSync).getTime() > 5 * 60 * 1000 // 5 minutes
  );

  return {
    needsSync,
    lastSync: data?.lastSync,
    pendingChanges: data ? Object.values(data).some(arr => Array.isArray(arr) && arr.length > 0) : false
  };
}

// Component to show offline status
export function OfflineIndicator() {
  const { isOnline } = useOffline();
  const { needsSync } = useSyncStatus();

  if (isOnline && !needsSync) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg border ${
      !isOnline
        ? 'bg-yellow-100 border-yellow-300 text-yellow-800'
        : 'bg-blue-100 border-blue-300 text-blue-800'
    }`}>
      <div className="flex items-center gap-2 text-sm">
        <div className={`w-2 h-2 rounded-full ${
          isOnline ? 'bg-blue-500' : 'bg-yellow-500'
        }`} />
        {isOnline ? 'Perlu sinkronisasi' : 'Mode Offline'}
      </div>
    </div>
  );
}
