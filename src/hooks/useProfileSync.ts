'use client';

import { useEffect, useState } from 'react';

export function useProfileSync() {
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    // Check if user is logged in and sync profile
    const syncProfile = async () => {
      try {
        // Check current session by calling an API
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

    // Only sync if not already synced
    if (!synced) {
      syncProfile();
    }
  }, [synced]);

  return { synced };
}
