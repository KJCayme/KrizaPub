
const CACHE_NAME = 'kenneth-portfolio-cache-v2';
const STATIC_CACHE_NAME = 'static-cache-v2';
const DYNAMIC_CACHE_NAME = 'dynamic-cache-v2';

// Enhanced static assets to cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/skeleton.html',
  '/robots.txt',
  '/manifest.json'
];

// Dynamic content patterns to cache
const DYNAMIC_CACHE_PATTERNS = [
  '/api/skills',
  '/api/portfolio',
  '/api/certificates', 
  '/api/tools',
  '/api/projects',
  '/api/testimonials',
  '/api/profile'
];

// Install event - cache static assets and skeleton
self.addEventListener('install', (event) => {
  console.log('Service Worker installing with enhanced caching');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE_NAME).then(async (cache) => {
        await cache.addAll(STATIC_ASSETS);
        
        // Cache Vite generated assets
        try {
          // Try to get the current build assets
          const indexResponse = await fetch('/index.html');
          const indexText = await indexResponse.text();
          
          // Extract asset URLs from the HTML
          const assetUrls = [];
          const jsMatches = indexText.match(/\/assets\/[^"]+\.js/g);
          const cssMatches = indexText.match(/\/assets\/[^"]+\.css/g);
          
          if (jsMatches) assetUrls.push(...jsMatches);
          if (cssMatches) assetUrls.push(...cssMatches);
          
          // Cache the found assets
          for (const url of assetUrls) {
            try {
              await cache.add(url);
            } catch (error) {
              console.warn(`Failed to cache asset: ${url}`, error);
            }
          }
        } catch (error) {
          console.warn('Failed to parse index.html for assets', error);
        }
      }),
      
      // Initialize dynamic cache
      caches.open(DYNAMIC_CACHE_NAME)
    ])
  );
  
  // Force immediate activation
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating with cache cleanup');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME && 
                cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all clients immediately
      self.clients.claim()
    ])
  );
});

// Enhanced fetch handler with comprehensive caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Skip Chrome extension requests
  if (request.url.startsWith('chrome-extension://')) {
    return;
  }
  
  // API requests - Network First with enhanced caching
  if (url.pathname.startsWith('/api/') || 
      DYNAMIC_CACHE_PATTERNS.some(pattern => url.pathname.includes(pattern))) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          // Fallback to cache if network fails
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Return empty response for API calls when offline
          return new Response(JSON.stringify({ error: 'Offline' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }
  
  // Static assets - Cache First with Vite hash support
  if (
    request.method === 'GET' && 
    (url.pathname.startsWith('/assets/') || 
     url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|ico)$/) ||
     url.pathname.includes('index-') || // Vite hashed files
     url.pathname.includes('.js') ||
     url.pathname.includes('.css'))
  ) {
    event.respondWith(
      caches.open(STATIC_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        
        try {
          const response = await fetch(request);
          if (response.ok) {
            cache.put(request, response.clone());
          }
          return response;
        } catch (error) {
          console.warn('Failed to fetch static asset:', request.url);
          throw error;
        }
      })
    );
    return;
  }
  
  // Navigation requests - Enhanced offline fallback
  if (request.mode === 'navigate' || 
      (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'))) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful navigation responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(STATIC_CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          // Try cached version first
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Try cached index.html
          const indexResponse = await caches.match('/index.html');
          if (indexResponse) {
            return indexResponse;
          }
          
          // Final fallback to skeleton
          const skeletonResponse = await caches.match('/skeleton.html');
          if (skeletonResponse) {
            return skeletonResponse;
          }
          
          // Create basic offline response if skeleton not cached
          return new Response(`
            <!DOCTYPE html>
            <html>
            <head><title>Offline</title></head>
            <body>
              <h1>You're offline</h1>
              <p>Please check your connection and try again.</p>
            </body>
            </html>
          `, {
            status: 200,
            headers: { 'Content-Type': 'text/html' }
          });
        })
    );
    return;
  }
  
  // Default: Cache First for everything else
  event.respondWith(
    caches.open(DYNAMIC_CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      
      try {
        const response = await fetch(request);
        if (response.ok) {
          cache.put(request, response.clone());
        }
        return response;
      } catch (error) {
        console.warn('Failed to fetch:', request.url);
        throw error;
      }
    })
  );
});

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Refresh critical data when back online
      Promise.all([
        fetch('/api/skills').catch(() => {}),
        fetch('/api/portfolio').catch(() => {}),
        fetch('/api/certificates').catch(() => {}),
        fetch('/api/tools').catch(() => {})
      ])
    );
  }
});
