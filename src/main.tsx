
import * as React from 'react';
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
                // Don't reload automatically - let user continue using the app
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
    
    // REMOVED: Automatic page reload on controller change
    // This was causing the app to refresh after caching
    
    // Listen for online/offline status changes
    window.addEventListener('online', () => {
      console.log('Back online, checking for updates...');
      // Hide offline indicator
      const offlineIndicator = document.getElementById('offline-indicator');
      if (offlineIndicator) {
        offlineIndicator.style.display = 'none';
      }
      
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
      // Show offline indicator
      showOfflineIndicator();
    });
    
    // Add debugging for service worker messages
    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('Message from service worker:', event.data);
    });
    
    // Check initial online status
    if (!navigator.onLine) {
      showOfflineIndicator();
    }
  });
}

// Function to show offline indicator
function showOfflineIndicator() {
  let offlineIndicator = document.getElementById('offline-indicator');
  
  if (!offlineIndicator) {
    offlineIndicator = document.createElement('div');
    offlineIndicator.id = 'offline-indicator';
    offlineIndicator.innerHTML = `
      <div style="
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, hsl(0, 84%, 60%), hsl(0, 70%, 50%));
        color: white;
        padding: 12px 24px;
        border-radius: 24px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px hsla(0, 0%, 0%, 0.3);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 8px;
        backdrop-filter: blur(10px);
        border: 1px solid hsla(0, 84%, 70%, 0.3);
        animation: slideDown 0.3s ease-out;
      ">
        <span style="font-size: 16px;">📶</span>
        No Network Connection
      </div>
    `;
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateX(-50%) translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(offlineIndicator);
  }
  
  offlineIndicator.style.display = 'block';
}

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
