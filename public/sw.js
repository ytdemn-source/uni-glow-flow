// Service Worker for Push Notifications + Auto-Update — A Help Deck
// IMPORTANT: bump CACHE_VERSION whenever you ship breaking SW changes.
const CACHE_VERSION = 'v3';
const CACHE_NAME = `gs-hub-cache-${CACHE_VERSION}`;

self.addEventListener('install', function (event) {
  console.log('[SW] Installing', CACHE_VERSION);
  // Activate the new worker immediately, replacing the old one
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  console.log('[SW] Activated', CACHE_VERSION);
  event.waitUntil(
    (async () => {
      // Nuke all old caches so users instantly get the new build
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.startsWith('gs-hub-cache-') && k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
      // Tell every open tab the new worker is in charge — they'll reload
      const clientsList = await self.clients.matchAll({ type: 'window' });
      for (const client of clientsList) {
        client.postMessage({ type: 'SW_ACTIVATED', version: CACHE_VERSION });
      }
    })()
  );
});

// Allow the page to force the waiting worker to take over immediately
self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ---------- Push notifications ----------
self.addEventListener('push', function (event) {
  let data = {
    title: 'A Help Deck',
    body: 'New announcement posted!',

    icon: '/logo-192.png',
    badge: '/logo-192.png',
    url: '/#notices',
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      data = { ...data, ...payload };
    } catch (e) {
      console.error('[SW] Error parsing push data:', e);
    }
  }

  const isExternalUrl = data.url && data.url.startsWith('http');
  const actionTitle = isExternalUrl ? 'View on Website' : 'View Notice';

  const options = {
    body: data.body,
    icon: data.icon || '/logo-192.png',
    badge: data.badge || '/logo-192.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/', dateOfArrival: Date.now() },
    actions: [
      { action: 'open', title: actionTitle },
      { action: 'close', title: 'Dismiss' },
    ],
    tag: 'ahd-notice-' + Date.now(),
    renotify: true,
    requireInteraction: true,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  if (event.action === 'close') return;

  const notificationData = event.notification.data || {};
  const urlToOpen = notificationData.url || '/';
  const isExternalUrl = urlToOpen.startsWith('http');

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(function (clientList) {
        if (isExternalUrl) {
          if (clients.openWindow) return clients.openWindow(urlToOpen);
          return;
        }
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(urlToOpen);
            return client.focus();
          }
        }
        if (clients.openWindow) return clients.openWindow(urlToOpen);
      })
  );
});

// ---------- Network-first fetch with safe caching ----------
// Never cache the SW itself or the HTML shell — we want fresh code on every load.
self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;

  const url = new URL(event.request.url);
  const isHTML =
    event.request.mode === 'navigate' ||
    event.request.destination === 'document' ||
    event.request.headers.get('accept')?.includes('text/html');
  const isSW = url.pathname === '/sw.js' || url.pathname === '/manifest.webmanifest';

  // Always go to network for HTML and the SW so updates land immediately
  if (isHTML || isSW) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' }).catch(() =>
        caches.match(event.request)
      )
    );
    return;
  }

  // Network-first for everything else, fall back to cache when offline
  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(function () {
        return caches.match(event.request);
      })
  );
});
