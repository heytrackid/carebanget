'use client';

import { useProfileSync } from '@/hooks/useProfileSync';

interface ProfileSyncProviderProps {
  children: React.ReactNode;
}

export function ProfileSyncProvider({ children }: ProfileSyncProviderProps) {
  // This will automatically sync user profile when they log in
  useProfileSync();

  return <>{children}</>;
}
