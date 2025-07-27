
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Enhanced Service Worker Registration with better debugging
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    console.log('Registering service worker...');
    
    navigator.serviceWorker.register('/sw.js', {
      // Update on reload in development
      updateViaCache: 'none'
    })
      .then((registration) => {
        console.log('SW registered successfully: ', registration);
        
        // Force update check immediately
        registration.update();
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('New service worker found, installing...');
          
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              console.log('Service worker state changed:', newWorker.state);
              
              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('New service worker installed, activating...');
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                } else {
                  console.log('Service worker installed for the first time');
                }
              }
              
              if (newWorker.state === 'activated') {
                console.log('Service worker activated');
              }
            });
          }
        });
        
        // Check for updates more frequently in development
        const isDev = import.meta.env.DEV;
        const updateInterval = isDev ? 10000 : 5 * 60 * 1000; // 10s in dev, 5min in prod
        
        setInterval(() => {
          console.log('Checking for service worker updates...');
          registration.update();
        }, updateInterval);
      })
      .catch((registrationError) => {
        console.error('SW registration failed: ', registrationError);
      });
    
    // Listen for service worker controller changes and reload automatically
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service worker controller changed, reloading page...');
      window.location.reload();
    });
    
    // Listen for online/offline status changes
    window.addEventListener('online', () => {
      console.log('Back online, checking for updates...');
      // Register background sync when back online (with proper type checking)
      if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then((registration) => {
          // Check if background sync is supported
          if ('sync' in registration) {
            const syncRegistration = registration as any;
            return syncRegistration.sync.register('background-sync');
          }
        }).catch((error) => {
          console.warn('Background sync registration failed:', error);
        });
      }
    });
    
    window.addEventListener('offline', () => {
      console.log('Gone offline, caching will be used');
    });
    
    // Add debugging for service worker messages
    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('Message from service worker:', event.data);
    });
  });
}

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
