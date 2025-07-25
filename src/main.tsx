
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Enhanced Service Worker Registration with automatic updates
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
        
        // Check for updates immediately
        registration.update();
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            console.log('New service worker found, installing...');
            
            newWorker.addEventListener('statechange', () => {
              console.log('Service worker state changed:', newWorker.state);
              
              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New service worker installed, activate immediately
                  console.log('New service worker installed, activating...');
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                } else {
                  // First install
                  console.log('Service worker installed for the first time');
                }
              }
            });
          }
        });
        
        // Set up periodic update checks (every 5 minutes)
        setInterval(() => {
          registration.update();
        }, 5 * 60 * 1000);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
    
    // Listen for service worker controller changes and reload automatically
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service worker controller changed, reloading page...');
      window.location.reload();
    });
    
    // Listen for online/offline status changes
    window.addEventListener('online', () => {
      console.log('Back online, checking for updates...');
      // Register background sync when back online
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        navigator.serviceWorker.ready.then((registration) => {
          return registration.sync.register('background-sync');
        });
      }
    });
    
    window.addEventListener('offline', () => {
      console.log('Gone offline, caching will be used');
    });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
