'use client';

import { useRealtimeSync } from '@/hooks/useRealtimeSync';

export function RealtimeProvider() {
  useRealtimeSync();
  return null;
}
