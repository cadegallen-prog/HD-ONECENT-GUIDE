// HD Penny Items Guide - Service Worker
// Version 1.0.0

const CACHE_VERSION = 'hd-penny-guide-v1.0.0';
const OFFLINE_CACHE = 'hd-penny-guide-offline-v1';
const RUNTIME_CACHE = 'hd-penny-guide-runtime-v1';

// Files to cache immediately on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/styles.css',
  '/scripts.js',
  '/offline.html',
  '/quick-start.html',
  '/what-are-pennies.html',
  '/clearance-lifecycle.html',
  '/digital-prehunt.html',
  '/in-store-strategy.html',
  '/checkout-strategy.html',
  '/internal-systems.html',
  '/facts-vs-myths.html',
  '/responsible-hunting.html',
  '/faq.html',
  '/resources.html',
  '/quick-reference-card.html',
  '/contribute.html',
  '/changelog.html',
  '/about.html',
  '/store-visit-checklist.html',
  '/store-notes-template.html',
  '/digital-prehunt-workflow.html',
  '/finds-log-template.html',
  '/Home Depot Penny Items Guide.pdf'
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');

  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => {
        console.log('[Service Worker] Precaching app shell and content');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        console.log('[Service Worker] Skip waiting');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Precache failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_VERSION &&
                cacheName !== OFFLINE_CACHE &&
                cacheName !== RUNTIME_CACHE) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // HTML pages - Network first, then cache, then offline page
  if (request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone the response
          const responseClone = response.clone();

          // Update cache with fresh content
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });

          return response;
        })
        .catch(() => {
          // Network failed, try cache
          return caches.match(request)
            .then((response) => {
              // Return cached page or offline page
              return response || caches.match('/offline.html');
            });
        })
    );
    return;
  }

  // CSS, JS, PDF - Cache first, then network
  if (request.url.endsWith('.css') ||
      request.url.endsWith('.js') ||
      request.url.endsWith('.pdf')) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            // Return cached version
            return response;
          }

          // Not in cache, fetch from network
          return fetch(request)
            .then((response) => {
              // Clone the response
              const responseClone = response.clone();

              // Cache the new resource
              caches.open(CACHE_VERSION).then((cache) => {
                cache.put(request, responseClone);
              });

              return response;
            });
        })
    );
    return;
  }

  // Default - try network first, fallback to cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        const responseClone = response.clone();

        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(request, responseClone);
        });

        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[Service Worker] Received skip waiting message');
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

// Background sync (for future features)
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);

  if (event.tag === 'sync-user-data') {
    event.waitUntil(syncUserData());
  }
});

async function syncUserData() {
  // Placeholder for future background sync functionality
  console.log('[Service Worker] Syncing user data...');
}

// Push notifications (for future features)
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received');

  const options = {
    body: event.data ? event.data.text() : 'New content available',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Now'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('HD Penny Guide', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked');

  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('[Service Worker] Loaded - Version:', CACHE_VERSION);
