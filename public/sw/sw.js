// Enhanced Service Worker for Advanced Caching
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

const { registerRoute } = workbox.routing;
const { CacheFirst, NetworkFirst, StaleWhileRevalidate, NetworkOnly } = workbox.strategies;
const { CacheableResponsePlugin } = workbox.cacheableResponse;
const { ExpirationPlugin } = workbox.expiration;
const { BackgroundSyncPlugin } = workbox.backgroundSync;

const CACHE_VERSION = 'v3';
const CACHE_NAMES = {
  pages: `pages-${CACHE_VERSION}`,
  static: `static-${CACHE_VERSION}`,
  images: `images-${CACHE_VERSION}`,
  fonts: `fonts-${CACHE_VERSION}`,
  api: `api-${CACHE_VERSION}`,
  offline: `offline-${CACHE_VERSION}`,
};

// Background sync for offline actions
const bgSyncPlugin = new BackgroundSyncPlugin('offline-queue', {
  maxRetentionTime: 24 * 60, // Retry for 24 hours
  onSync: async ({ queue }) => {
    console.log('🔄 Background sync triggered');
    let entry;
    while ((entry = await queue.shiftRequest())) {
      try {
        const response = await fetch(entry.request.clone());
        if (!response.ok) {
          throw new Error('Sync failed');
        }
        console.log('✅ Synced:', entry.request.url);
      } catch (error) {
        console.error('❌ Sync failed:', error);
        // Re-queue for next attempt
        await queue.unshiftRequest(entry);
        throw error;
      }
    }
  },
});

// Cache pages with NetworkFirst strategy
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: CACHE_NAMES.pages,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      }),
    ],
  })
);

// Cache static assets with StaleWhileRevalidate
registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker',
  new StaleWhileRevalidate({
    cacheName: CACHE_NAMES.static,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  })
);

// Cache images with CacheFirst strategy
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: CACHE_NAMES.images,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Cache fonts with CacheFirst strategy
registerRoute(
  ({ request }) =>
    request.destination === 'font' ||
    request.url.includes('fonts.googleapis.com') ||
    request.url.includes('fonts.gstatic.com'),
  new CacheFirst({
    cacheName: CACHE_NAMES.fonts,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
      }),
    ],
  })
);

// Cache API calls with NetworkFirst + Background Sync
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: CACHE_NAMES.api,
    plugins: [
      bgSyncPlugin,
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 5 * 60, // 5 minutes
      }),
    ],
  })
);

// Handle offline fallback
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/offline.html') || caches.match('/');
      })
    );
  }
});

// Clean up old caches on activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => !Object.values(CACHE_NAMES).includes(cacheName))
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});

// Handle push notifications (future feature)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [100, 50, 100],
      data: data.data,
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});

// Periodic background sync for data refresh
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(syncContent());
  }
});

async function syncContent() {
  console.log('🔄 Periodic content sync');
  // Implement content sync logic here
  // Could refresh recipes, articles, etc.
}

// Message handling for client communication
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
