import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useRealtimeStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  useEffect(() => {
    // Monitor Supabase realtime connection
    const channel = supabase.channel('connection_status')
      .on('system', { event: 'CHANNEL_JOIN' }, () => {
        setConnectionStatus('connected');
        setIsConnected(true);
      })
      .on('system', { event: 'CHANNEL_ERROR' }, () => {
        setConnectionStatus('disconnected');
        setIsConnected(false);
      })
      .on('system', { event: 'CHANNEL_LEAVE' }, () => {
        setConnectionStatus('disconnected');
        setIsConnected(false);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setConnectionStatus('connected');
          setIsConnected(true);
        } else if (status === 'CHANNEL_ERROR') {
          setConnectionStatus('disconnected');
          setIsConnected(false);
        }
      });

    // Fallback connection check
    const interval = setInterval(() => {
      if (navigator.onLine && connectionStatus !== 'connected') {
        setConnectionStatus('connecting');
      }
    }, 5000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [connectionStatus]);

  return { isConnected, connectionStatus };
}
