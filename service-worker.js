// public/service-worker.js
// Offline support service worker for T-Break app
// Handles caching, offline data sync, and background tasks

const CACHE_VERSION = 'v1';
const CACHE_NAME = `tbreak-cache-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `tbreak-dynamic-${CACHE_VERSION}`;
const API_CACHE = `tbreak-api-${CACHE_VERSION}`;

// Assets to cache on install (critical for offline)
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
];

// Cache strategies
const CACHE_STRATEGIES = {
  // Cache first, fallback to network (for assets that don't change often)
  cacheFirst: async (request) => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      return new Response('Offline - Resource not available', { status: 503 });
    }
  },

  // Network first, fallback to cache (for API calls and dynamic content)
  networkFirst: async (request) => {
    try {
      const response = await fetch(request);
      if (response.ok) {
        const cache = await caches.open(API_CACHE);
        cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      const cache = await caches.open(API_CACHE);
      const cached = await cache.match(request);
      if (cached) return cached;
      return new Response(
        JSON.stringify({ error: 'Offline - cached data unavailable' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }
  },

  // Stale while revalidate (show cache, update in background)
  staleWhileRevalidate: async (request) => {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cached = await cache.match(request);

    const fetchPromise = fetch(request).then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    });

    return cached || fetchPromise;
  },
};

// Install event: cache critical assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching critical assets');
      return cache.addAll(CRITICAL_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName !== CACHE_NAME &&
            cacheName !== DYNAMIC_CACHE &&
            cacheName !== API_CACHE
          ) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event: route requests to appropriate cache strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // API calls: network first (with fallback to cache)
  if (url.pathname.startsWith('/api') || url.hostname.includes('firestore')) {
    event.respondWith(CACHE_STRATEGIES.networkFirst(request));
    return;
  }

  // Static assets (JS, CSS, images): cache first
  if (/\.(js|css|png|jpg|jpeg|gif|svg|woff2?)$/.test(url.pathname)) {
    event.respondWith(CACHE_STRATEGIES.cacheFirst(request));
    return;
  }

  // HTML & dynamic content: stale while revalidate
  if (url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(CACHE_STRATEGIES.staleWhileRevalidate(request));
    return;
  }

  // Default: network first
  event.respondWith(CACHE_STRATEGIES.networkFirst(request));
});

// Handle background sync (for offline data)
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  if (event.tag === 'sync-offline-data') {
    event.waitUntil(syncOfflineData());
  }
});

// Sync offline data when network returns
async function syncOfflineData() {
  try {
    console.log('Syncing offline data...');
    // Open IndexedDB and sync pending changes
    const db = await openIndexedDB();
    const pendingChanges = await getPendingChanges(db);
    
    if (pendingChanges.length === 0) {
      console.log('No offline changes to sync');
      return;
    }

    // Send each pending change to server
    for (const change of pendingChanges) {
      try {
        const response = await fetch(change.endpoint, {
          method: change.method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(change.data),
        });

        if (response.ok) {
          // Mark change as synced
          await markSynced(db, change.id);
          console.log('Synced change:', change.id);
        }
      } catch (error) {
        console.error('Failed to sync change:', change.id, error);
      }
    }

    console.log('Offline sync completed');
  } catch (error) {
    console.error('Error in syncOfflineData:', error);
  }
}

// IndexedDB helpers
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('tbreak-offline-db', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pending-changes')) {
        db.createObjectStore('pending-changes', { keyPath: 'id' });
      }
    };
  });
}

function getPendingChanges(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pending-changes'], 'readonly');
    const store = transaction.objectStore('pending-changes');
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function markSynced(db, changeId) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pending-changes'], 'readwrite');
    const store = transaction.objectStore('pending-changes');
    const request = store.delete(changeId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}
