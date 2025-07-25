const CACHE_NAME = 'vite-app-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/skeleton.html',
  // Vite assets will be added dynamically during install
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Cache initial assets
      await cache.addAll(STATIC_ASSETS);
      
      // Get all assets from the manifest (Vite generates these)
      try {
        const response = await fetch('/assets-manifest.json');
        if (response.ok) {
          const manifest = await response.json();
          const assetUrls = Object.values(manifest).filter(url => 
            typeof url === 'string' && (url.endsWith('.js') || url.endsWith('.css'))
          );
          await cache.addAll(assetUrls);
        }
      } catch (error) {
        console.log('No manifest found, caching common patterns');
        // Fallback: cache common Vite asset patterns
        const commonAssets = [
          '/assets/index.js',
          '/assets/index.css',
          '/logo.png',
          '/robots.txt'
        ];
        
        for (const asset of commonAssets) {
          try {
            await cache.add(asset);
          } catch (e) {
            console.log(`Failed to cache ${asset}:`, e);
          }
        }
      }
      
      console.log('Service Worker installed and assets cached');
    })
  );
  
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // API requests - Network First strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request);
        })
    );
    return;
  }
  
  // Static assets - Cache First strategy
  if (
    request.method === 'GET' && 
    (url.pathname.startsWith('/assets/') || 
     url.pathname.endsWith('.js') || 
     url.pathname.endsWith('.css') || 
     url.pathname.endsWith('.png') || 
     url.pathname.endsWith('.jpg') || 
     url.pathname.endsWith('.jpeg') || 
     url.pathname.endsWith('.gif') || 
     url.pathname.endsWith('.svg') ||
     url.pathname.endsWith('.woff') ||
     url.pathname.endsWith('.woff2'))
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(request).then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      })
    );
    return;
  }
  
  // Navigation requests - Cache First with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html')
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(request).catch(() => {
            // Offline fallback
            return caches.match('/skeleton.html');
          });
        })
    );
    return;
  }
  
  // Default: try cache first, then network
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      return cachedResponse || fetch(request);
    })
  );
});

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});