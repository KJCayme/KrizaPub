
const CACHE_NAME = 'kenneth-portfolio-cache-v5';
const STATIC_CACHE_NAME = 'static-cache-v5';
const DYNAMIC_CACHE_NAME = 'dynamic-cache-v5';
const CACHE_EXPIRATION_TIME = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

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

// Network status tracking
let isOnline = true;

// Helper function to add timestamp to cached responses
const addCacheMetadata = (response, timestamp = Date.now()) => {
  const headers = new Headers(response.headers);
  headers.set('sw-cache-timestamp', timestamp.toString());
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers
  });
};

// Helper function to check if cache entry is expired
const isCacheExpired = (response) => {
  const cacheTimestamp = response.headers.get('sw-cache-timestamp');
  if (!cacheTimestamp) return true; // If no timestamp, consider expired
  
  const timestamp = parseInt(cacheTimestamp);
  const now = Date.now();
  const isExpired = (now - timestamp) > CACHE_EXPIRATION_TIME;
  
  console.log(`Cache check - Age: ${Math.round((now - timestamp) / 1000 / 60)}min, Expired: ${isExpired}`);
  return isExpired;
};

// Helper function to clean expired cache entries
const cleanExpiredCache = async (cacheName) => {
  try {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response && isCacheExpired(response)) {
        console.log('Removing expired cache entry:', request.url);
        await cache.delete(request);
      }
    }
  } catch (error) {
    console.warn('Failed to clean expired cache:', error);
  }
};

// Install event - cache static assets and skeleton
self.addEventListener('install', (event) => {
  console.log('Service Worker installing with network-first strategy v5');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets with better error handling
      caches.open(STATIC_CACHE_NAME).then(async (cache) => {
        console.log('Caching static assets...');
        
        // Cache static assets one by one to avoid failures
        for (const asset of STATIC_ASSETS) {
          try {
            const response = await fetch(asset);
            if (response.ok) {
              const responseWithTimestamp = addCacheMetadata(response);
              await cache.put(asset, responseWithTimestamp);
              console.log('Cached static asset:', asset);
            }
          } catch (error) {
            console.warn(`Failed to cache static asset: ${asset}`, error);
          }
        }
        
        // Cache Vite generated assets with improved error handling
        try {
          console.log('Attempting to cache Vite assets...');
          const indexResponse = await fetch('/index.html');
          
          if (!indexResponse.ok) {
            throw new Error(`Failed to fetch index.html: ${indexResponse.status}`);
          }
          
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
          
          // Cache the found assets with individual error handling
          for (const url of assetUrls) {
            try {
              const response = await fetch(url);
              if (response.ok) {
                const responseWithTimestamp = addCacheMetadata(response);
                await cache.put(url, responseWithTimestamp);
                console.log('Cached asset:', url);
              } else {
                console.warn(`Asset returned ${response.status}:`, url);
              }
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

// Activate event - clean up old caches and expired entries
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating with cache cleanup v5');
  
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
      
      // Clean expired entries from current caches
      cleanExpiredCache(STATIC_CACHE_NAME),
      cleanExpiredCache(DYNAMIC_CACHE_NAME),
      
      // Take control of all clients immediately
      self.clients.claim().then(() => {
        console.log('Service worker claimed all clients');
      })
    ])
  );
});

// Check if we're really offline by testing network connectivity
const checkNetworkConnectivity = async () => {
  try {
    const response = await fetch('/', { 
      method: 'HEAD',
      cache: 'no-cache',
      mode: 'no-cors'
    });
    return true;
  } catch (error) {
    return false;
  }
};

// Enhanced fetch handler with network-first approach and cache expiration
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
  
  // API requests - Network First with offline fallback ONLY
  if (url.pathname.startsWith('/api/') || 
      DYNAMIC_CACHE_PATTERNS.some(pattern => url.pathname.includes(pattern))) {
    console.log('API request - Network First with offline fallback');
    
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          console.log('API response received:', response.status);
          
          // Update network status
          isOnline = true;
          
          // Notify main thread that network is available
          self.clients.matchAll().then(clients => {
            clients.forEach(client => {
              client.postMessage({
                type: 'NETWORK_STATUS',
                isOnline: true
              });
            });
          });
          
          // Cache successful responses for offline use with timestamp
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
              const responseWithTimestamp = addCacheMetadata(responseClone);
              cache.put(request, responseWithTimestamp).catch(error => {
                console.warn('Failed to cache API response:', error);
              });
              console.log('API response cached for offline use with 6hr expiration');
            }).catch(error => {
              console.warn('Failed to open dynamic cache:', error);
            });
          }
          return response;
        })
        .catch(async (error) => {
          console.log('API request failed, checking if truly offline:', error);
          
          // Double-check network connectivity
          const isReallyOffline = !(await checkNetworkConnectivity());
          
          if (isReallyOffline) {
            console.log('Network confirmed offline, checking cached data');
            isOnline = false;
            
            // Notify main thread about offline status
            self.clients.matchAll().then(clients => {
              clients.forEach(client => {
                client.postMessage({
                  type: 'NETWORK_STATUS',
                  isOnline: false
                });
              });
            });
            
            // Check cache but respect expiration
            try {
              const cachedResponse = await caches.match(request);
              if (cachedResponse) {
                if (!isCacheExpired(cachedResponse)) {
                  console.log('Serving fresh API response from cache (offline)');
                  return cachedResponse;
                } else {
                  console.log('Cache expired, serving stale data with warning');
                  // Still serve expired cache in offline mode, but could add headers to indicate staleness
                  const staleResponse = new Response(cachedResponse.body, {
                    status: cachedResponse.status,
                    statusText: cachedResponse.statusText,
                    headers: {
                      ...Object.fromEntries(cachedResponse.headers.entries()),
                      'sw-cache-stale': 'true'
                    }
                  });
                  return staleResponse;
                }
              }
            } catch (cacheError) {
              console.warn('Failed to access cache:', cacheError);
            }
            
            // Return offline response when no cache available
            console.log('No cache available, returning offline response');
            return new Response(JSON.stringify({ error: 'Offline', cached: false }), {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            });
          } else {
            // Network error but not offline - propagate the error
            console.log('Network error but not offline, propagating error');
            throw error;
          }
        })
    );
    return;
  }
  
  // Static assets - Network First with cache fallback
  if (
    request.method === 'GET' && 
    (url.pathname.startsWith('/assets/') || 
     url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|ico)$/) ||
     url.pathname.includes('index-') || // Vite hashed files
     url.pathname.includes('.js') ||
     url.pathname.includes('.css'))
  ) {
    console.log('Static asset - Network First with cache fallback');
    
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          console.log('Static asset response received:', response.status);
          
          // Cache successful responses with timestamp
          if (response.ok) {
            try {
              const cache = await caches.open(STATIC_CACHE_NAME);
              const responseWithTimestamp = addCacheMetadata(response.clone());
              await cache.put(request, responseWithTimestamp);
              console.log('Static asset cached with 6hr expiration');
            } catch (cacheError) {
              console.warn('Failed to cache static asset:', cacheError);
            }
          }
          return response;
        })
        .catch(async (error) => {
          console.log('Static asset request failed, checking cache:', error);
          
          try {
            const cachedResponse = await caches.match(request);
            if (cachedResponse) {
              if (!isCacheExpired(cachedResponse)) {
                console.log('Serving fresh static asset from cache');
                return cachedResponse;
              } else {
                console.log('Serving expired static asset from cache (better than nothing)');
                return cachedResponse;
              }
            }
          } catch (cacheError) {
            console.warn('Failed to access cache for static asset:', cacheError);
          }
          
          throw error;
        })
    );
    return;
  }
  
  // Navigation requests - Network First with offline fallback
  if (request.mode === 'navigate' || 
      (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'))) {
    console.log('Navigation request - Network First with offline fallback');
    
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          console.log('Navigation response received:', response.status);
          
          // Cache successful navigation responses with timestamp
          if (response.ok) {
            try {
              const cache = await caches.open(STATIC_CACHE_NAME);
              const responseWithTimestamp = addCacheMetadata(response.clone());
              await cache.put(request, responseWithTimestamp);
              console.log('Navigation response cached with 6hr expiration');
            } catch (cacheError) {
              console.warn('Failed to cache navigation response:', cacheError);
            }
          }
          return response;
        })
        .catch(async (error) => {
          console.log('Navigation request failed, trying offline fallbacks:', error);
          
          try {
            // Try cached version of the specific page (respect expiration for navigation)
            const cachedResponse = await caches.match(request);
            if (cachedResponse && !isCacheExpired(cachedResponse)) {
              console.log('Serving fresh navigation from cache');
              return cachedResponse;
            }
            
            // Try cached index.html
            const indexResponse = await caches.match('/index.html');
            if (indexResponse && !isCacheExpired(indexResponse)) {
              console.log('Serving fresh index.html from cache');
              return indexResponse;
            }
            
            // Final fallback to skeleton (even if expired, better than nothing)
            const skeletonResponse = await caches.match('/skeleton.html');
            if (skeletonResponse) {
              console.log('Serving skeleton.html from cache');
              return skeletonResponse;
            }
          } catch (cacheError) {
            console.warn('Failed to access cache for navigation:', cacheError);
          }
          
          // Create basic offline response if no cache available
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
  
  // Default: Network First for everything else
  console.log('Default request - Network First strategy');
  
  event.respondWith(
    fetch(request)
      .then(async (response) => {
        console.log('Default response received:', response.status);
        
        // Notify about network status
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'NETWORK_STATUS',
              isOnline: true
            });
          });
        });
        
        // Cache successful responses for offline use with timestamp
        if (response.ok) {
          try {
            const cache = await caches.open(DYNAMIC_CACHE_NAME);
            const responseWithTimestamp = addCacheMetadata(response.clone());
            await cache.put(request, responseWithTimestamp);
            console.log('Response cached for offline use with 6hr expiration');
          } catch (cacheError) {
            console.warn('Failed to cache response:', cacheError);
          }
        }
        return response;
      })
      .catch(async (error) => {
        console.log('Default request failed, checking if offline:', error);
        
        // Check if truly offline
        const isReallyOffline = !(await checkNetworkConnectivity());
        
        if (isReallyOffline) {
          console.log('Confirmed offline, checking cache');
          
          // Notify about network failure
          self.clients.matchAll().then(clients => {
            clients.forEach(client => {
              client.postMessage({
                type: 'NETWORK_STATUS',
                isOnline: false
              });
            });
          });
          
          try {
            const cachedResponse = await caches.match(request);
            if (cachedResponse) {
              if (!isCacheExpired(cachedResponse)) {
                console.log('Serving fresh response from cache (offline)');
                return cachedResponse;
              } else {
                console.log('Serving expired response from cache (offline, better than nothing)');
                return cachedResponse;
              }
            }
          } catch (cacheError) {
            console.warn('Failed to access cache:', cacheError);
          }
        }
        
        throw error;
      })
  );
});

// Periodic cleanup of expired cache entries
setInterval(async () => {
  console.log('Running periodic cache cleanup...');
  await cleanExpiredCache(STATIC_CACHE_NAME);
  await cleanExpiredCache(DYNAMIC_CACHE_NAME);
}, 60 * 60 * 1000); // Run every hour

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  console.log('Service worker received message:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('Skipping waiting...');
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAN_EXPIRED_CACHE') {
    console.log('Manual cache cleanup requested...');
    cleanExpiredCache(STATIC_CACHE_NAME);
    cleanExpiredCache(DYNAMIC_CACHE_NAME);
  }
});

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  console.log('Background sync event:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Refresh critical data when back online and clean expired cache
      Promise.all([
        cleanExpiredCache(STATIC_CACHE_NAME),
        cleanExpiredCache(DYNAMIC_CACHE_NAME),
        fetch('/api/skills').then(() => console.log('Skills synced')).catch(() => {}),
        fetch('/api/portfolio').then(() => console.log('Portfolio synced')).catch(() => {}),
        fetch('/api/certificates').then(() => console.log('Certificates synced')).catch(() => {}),
        fetch('/api/tools').then(() => console.log('Tools synced')).catch(() => {})
      ])
    );
  }
});
