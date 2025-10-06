'use client';

import { useEffect, useState } from 'react';

export function useProfileSync() {
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    // Only run once on mount to check/sync profile
    if (!synced) {
      createUserProfile();
    }
  }, [synced]);

  const createUserProfile = async () => {
    try {
      const response = await fetch('/api/create-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Profile sync successful:', data.message);
        setSynced(true);
      } else {
        console.error('Profile sync failed:', data.error);
      }
    } catch (error) {
      console.error('Error syncing profile:', error);
    }
  };

  return { synced };
}
