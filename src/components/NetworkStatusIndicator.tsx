
import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

const NetworkStatusIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      console.log('Browser: Back online');
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.log('Browser: Gone offline');
      setIsOnline(false);
    };

    // Listen for browser online/offline events (these are more reliable)
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for service worker messages about network status (but don't override browser events)
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'NETWORK_STATUS') {
        console.log('Service worker network status:', event.data.isOnline);
        
        // Only trust service worker if it says we're offline AND browser also says offline
        // Don't let service worker override browser's online status
        if (!event.data.isOnline && !navigator.onLine) {
          setIsOnline(false);
        }
        // If browser says we're online, trust the browser over service worker
        else if (navigator.onLine) {
          setIsOnline(true);
        }
      }
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    }

    // Debug: log current status
    console.log('NetworkStatusIndicator initialized - navigator.onLine:', navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      }
    };
  }, []);

  // Debug: log render state
  console.log('NetworkStatusIndicator render - isOnline:', isOnline, 'navigator.onLine:', navigator.onLine);

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top duration-300">
      <WifiOff className="h-4 w-4" />
      <span className="text-sm font-medium">No Network Connection</span>
    </div>
  );
};

export default NetworkStatusIndicator;
