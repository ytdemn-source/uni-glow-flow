

## Fix: Push Notifications Not Working After PWA Install

### Root Cause

The `vite-plugin-pwa` with `registerType: "autoUpdate"` generates its own Workbox service worker that **replaces** the custom `public/sw.js` (which contains the push notification handlers). When the PWA is installed, the Workbox SW takes over and has no `push` or `notificationclick` event listeners, so notifications silently fail.

### Solution

Configure `vite-plugin-pwa` to only generate the manifest (for installability) without generating or registering its own service worker. The existing `public/sw.js` already handles push notifications and is registered manually in `usePushNotifications.ts`.

### Changes

**`vite.config.ts`** — Update VitePWA config:
- Set `injectRegister: false` — prevents the plugin from auto-registering a generated SW
- Set `strategies: 'injectManifest'` with `injectManifest.injectionPoint: undefined` — tells the plugin to skip SW generation entirely
- Keep the `manifest` config as-is (still generates `manifest.webmanifest` for installability)
- Remove the `workbox` config (no longer needed since we're not generating a Workbox SW)

**`public/sw.js`** — Add basic cache support to the existing push notification SW:
- Add a `fetch` event listener with a simple network-first strategy for API calls
- This gives the custom SW minimal offline support without conflicting with push notifications

This way the app remains installable (manifest is still generated) and push notifications continue working through the custom service worker.

