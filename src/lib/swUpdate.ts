// Registers the service worker and force-reloads users when a new build ships.
// Strategy:
//   1. Register /sw.js with cache: 'no-store' so the browser always re-checks it.
//   2. When a new worker reaches the "installed" state and there's already a
//      controller, ask it to skipWaiting and reload as soon as it takes over.
//   3. Poll registration.update() every 60s while the tab is visible so users
//      pick up new builds without manually refreshing.

const SW_URL = '/sw.js';
const UPDATE_POLL_MS = 60_000;

let reloading = false;
function reloadOnce() {
  if (reloading) return;
  reloading = true;
  window.location.reload();
}

export function registerSWWithAutoUpdate() {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;

  // Skip in the Lovable editor preview iframe (avoids stale-cache headaches there)
  const isInIframe = (() => {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  })();
  const isPreviewHost =
    window.location.hostname.includes('id-preview--') ||
    window.location.hostname.includes('lovableproject.com');

  if (isPreviewHost || isInIframe) {
    // Clean up any worker that snuck in earlier so the preview stays fresh
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((r) => r.unregister());
    });
    return;
  }

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register(SW_URL, {
        updateViaCache: 'none',
      });

      // When a new SW finishes installing while one is already controlling
      // the page, tell it to take over and then reload.
      const promote = (worker: ServiceWorker | null) => {
        if (!worker) return;
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            worker.postMessage({ type: 'SKIP_WAITING' });
          }
        });
      };

      promote(registration.installing);
      registration.addEventListener('updatefound', () => {
        promote(registration.installing);
      });

      // The new worker has taken control — refresh so users see the new build.
      navigator.serviceWorker.addEventListener('controllerchange', reloadOnce);

      // SW also pings us on activate
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SW_ACTIVATED') {
          reloadOnce();
        }
      });

      // Periodically check for updates while the tab is visible
      const poll = () => {
        if (document.visibilityState === 'visible') {
          registration.update().catch(() => {});
        }
      };
      setInterval(poll, UPDATE_POLL_MS);
      document.addEventListener('visibilitychange', poll);
    } catch (err) {
      console.warn('[SW] registration failed:', err);
    }
  });
}
