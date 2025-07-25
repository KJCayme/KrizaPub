
const CACHE_NAME = 'kenneth-portfolio-cache-v3';
const STATIC_CACHE_NAME = 'static-cache-v3';
const DYNAMIC_CACHE_NAME = 'dynamic-cache-v3';

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
  console.log('Service Worker installing with enhanced caching v3');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE_NAME).then(async (cache) => {
        console.log('Caching static assets...');
        
        try {
          await cache.addAll(STATIC_ASSETS);
          console.log('Static assets cached successfully');
        } catch (error) {
          console.error('Failed to cache static assets:', error);
        }
        
        // Cache Vite generated assets
        try {
          console.log('Attempting to cache Vite assets...');
          const indexResponse = await fetch('/index.html');
          const indexText = await indexResponse.text();
          
          // Extract asset URLs from the HTML
          const assetUrls = [];
          const jsMatches = indexText.match(/\/assets\/[^"]+\.js/g);
          const cssMatches = indexText.match(/\/assets\/[^"]+\.css/g);
          
          if (jsMatches) {
            assetUrls.push(...jsMatches);
            console.log('Found JS assets:', jsMatches);
          }
          if (cssMatches) {
            assetUrls.push(...cssMatches);
            console.log('Found CSS assets:', cssMatches);
          }
          
          // Cache the found assets
          for (const url of assetUrls) {
            try {
              await cache.add(url);
              console.log('Cached asset:', url);
            } catch (error) {
              console.warn(`Failed to cache asset: ${url}`, error);
            }
          }
        } catch (error) {
          console.warn('Failed to parse index.html for assets', error);
        }
      }),
      
      // Initialize dynamic cache
      caches.open(DYNAMIC_CACHE_NAME).then(() => {
        console.log('Dynamic cache initialized');
      })
    ])
  );
  
  // Force immediate activation
  console.log('Service worker skipping waiting...');
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating with cache cleanup v3');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        console.log('Found caches:', cacheNames);
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
      self.clients.claim().then(() => {
        console.log('Service worker claimed all clients');
      })
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
  
  console.log('Fetching:', request.url);
  
  // API requests - Network First with enhanced caching
  if (url.pathname.startsWith('/api/') || 
      DYNAMIC_CACHE_PATTERNS.some(pattern => url.pathname.includes(pattern))) {
    console.log('API request - Network First strategy');
    
    event.respondWith(
      fetch(request)
        .then((response) => {
          console.log('API response received:', response.status);
          // Cache successful responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
              console.log('API response cached');
            });
          }
          return response;
        })
        .catch(async (error) => {
          console.log('API request failed, trying cache:', error);
          // Fallback to cache if network fails
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            console.log('Serving API response from cache');
            return cachedResponse;
          }
          
          // Return empty response for API calls when offline
          console.log('No cache available, returning offline response');
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
    console.log('Static asset - Cache First strategy');
    
    event.respondWith(
      caches.open(STATIC_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          console.log('Serving static asset from cache');
          return cachedResponse;
        }
        
        try {
          console.log('Fetching static asset from network');
          const response = await fetch(request);
          if (response.ok) {
            cache.put(request, response.clone());
            console.log('Static asset cached');
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
    console.log('Navigation request - Network First with skeleton fallback');
    
    event.respondWith(
      fetch(request)
        .then((response) => {
          console.log('Navigation response received:', response.status);
          // Cache successful navigation responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(STATIC_CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
              console.log('Navigation response cached');
            });
          }
          return response;
        })
        .catch(async (error) => {
          console.log('Navigation request failed, trying fallbacks:', error);
          
          // Try cached version first
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            console.log('Serving navigation from cache');
            return cachedResponse;
          }
          
          // Try cached index.html
          const indexResponse = await caches.match('/index.html');
          if (indexResponse) {
            console.log('Serving index.html from cache');
            return indexResponse;
          }
          
          // Final fallback to skeleton
          const skeletonResponse = await caches.match('/skeleton.html');
          if (skeletonResponse) {
            console.log('Serving skeleton.html from cache');
            return skeletonResponse;
          }
          
          // Create basic offline response if skeleton not cached
          console.log('No cache available, creating basic offline response');
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
  console.log('Default request - Cache First strategy');
  
  event.respondWith(
    caches.open(DYNAMIC_CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        console.log('Serving from cache');
        return cachedResponse;
      }
      
      try {
        console.log('Fetching from network');
        const response = await fetch(request);
        if (response.ok) {
          cache.put(request, response.clone());
          console.log('Response cached');
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
  console.log('Service worker received message:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('Skipping waiting...');
    self.skipWaiting();
  }
});

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  console.log('Background sync event:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Refresh critical data when back online
      Promise.all([
        fetch('/api/skills').then(() => console.log('Skills synced')).catch(() => {}),
        fetch('/api/portfolio').then(() => console.log('Portfolio synced')).catch(() => {}),
        fetch('/api/certificates').then(() => console.log('Certificates synced')).catch(() => {}),
        fetch('/api/tools').then(() => console.log('Tools synced')).catch(() => {})
      ])
    );
  }
});
