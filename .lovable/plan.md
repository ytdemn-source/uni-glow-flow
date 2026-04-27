## Polish, Speed, Logo Fix, Admin Password & Force-Update

### 1. Admin password (info)

The admin code for the hidden Admin Panel (gear icon, bottom-right of the site) is:

**`jakir03`**

Tap the gear icon → enter `jakir03` → Unlock to access "Send notification", "History" and "Subscriptions" tabs. (No file changes — just a reminder. If you'd like a different password, tell me what to set it to.)

---

### 2. Fix the app logo

The current logo file (`public/logo.png` and `src/assets/logo.png`) is **1472 × 704 px and 382 KB**. Problems this causes:

- It's loaded on every page paint as the header logo (rendered at ~64–80 px) — wasted bandwidth and slow first paint, especially on mobile.
- It's also used as the **PWA install icon** (`/logo.png`, declared as 512×512). Because the real image is rectangular 1472×704, the installed app icon on the home screen looks stretched / has empty space — it doesn't look like a proper app icon.
- The same oversize file is used as the favicon and apple-touch-icon.

Fixes:

- Generate three properly-sized, optimized PNGs from the existing logo:
  - `public/logo-192.png` — 192 × 192, square, padded transparent background, ~10–20 KB
  - `public/logo-512.png` — 512 × 512, square, padded transparent background, with a maskable safe area, ~30–50 KB
  - `public/logo-header.png` — ~240 × 120 (or kept rectangular at 2× header size), optimized, ~15–30 KB
  - `public/favicon.png` — 64 × 64, ~3–5 KB
- Replace the import in `src/components/Header.tsx` so the header uses the small `logo-header.png` instead of the 382 KB asset (still served via Vite as `@/assets/...` after copying a smaller version into `src/assets/`).
- Update `vite.config.ts` PWA `manifest.icons` to point to `logo-192.png` and `logo-512.png` (with proper `purpose: "any maskable"`).
- Update `index.html` `<link rel="apple-touch-icon">` and `<link rel="icon">` to the new optimized files.
- Delete the legacy 382 KB `public/logo.png` and `public/favicon.ico` (browsers will fall back to the new declared favicon).

Result: the home-screen / install icon will look correct (square, properly framed), and ~750 KB of duplicate logo payload is removed from initial load.

---

### 3. Make the app smoother and faster to load

**A. Remove blocking Google Fonts CSS @imports**
`src/index.css` does three `@import url('fonts.googleapis.com/...')` at the top. These are render-blocking and serialized after the CSS file downloads. Move them to `index.html` as `<link rel="preconnect">` (already there) plus a single combined `<link rel="stylesheet">` tag — and limit weights to only what's used (Inter 400/500/600/700, drop Lora and Space Mono unless actually used). Saves ~150–300 ms on first paint.

**B. Lazy-load below-the-fold sections**
In `src/pages/Index.tsx`, only `Hero` + `NoticesSection` are visible on first screen. Convert the rest to `React.lazy` with `Suspense`:
- `DepartmentsSection`, `QuickLinksSection`, `ServicesSection`, `ContactSection`, `Footer`, `BackgroundImage` (background can be lazy with a CSS gradient placeholder), `AdminNotificationTest`, `PWAInstallBanner`.

Cuts initial JS bundle significantly → faster Time-to-Interactive on mobile.

**C. Defer heavy work**
- `AdminNotificationTest` and `PWAInstallBanner`: render only after `requestIdleCallback` (or 2 s timeout) so they never block first paint.
- `BackgroundImage`: keep image but add `loading="lazy"` for the actual bitmap and start with the gradient overlay only — swap in the photo once idle.

**D. Reduce animation cost on mobile**
- In `src/index.css`, gate the heavy `backdrop-filter: blur(60px) saturate(1.5)` on `.bg-campus::after` and `glass-card` behind `@media (min-width: 768px)`. On phones, fall back to a flat translucent color (huge GPU win on the 393×683 viewport you're viewing on).
- Add `@media (prefers-reduced-motion: reduce)` to disable `reveal`, `stagger-children`, and `hover-lift` transforms.
- Add `content-visibility: auto` on each `<section>` so off-screen sections don't paint until scrolled near.

**E. React Query + caching**
- `NoticesSection` already caches in `localStorage` — also seed React Query's `initialData` from that cache so users see notices instantly on reload (no skeleton flash).
- Lower `refetchInterval` impact: keep 5 min but disable refetch when tab hidden (already done).

---

### 4. Force-update the web app for existing users

Currently `public/sw.js` caches with `gs-hub-cache-v1` and uses `skipWaiting()` on install — but old clients that already have a previous SW won't pick up the new HTML/JS until they close every tab. Users are stuck on stale versions.

Plan:

- **Bump the cache name** to `gs-hub-cache-v2` and add an `activate` handler that **deletes all old caches** (`gs-hub-cache-*` except current). This guarantees old cached HTML / JS / CSS is wiped the moment the new SW activates.
- Keep `self.skipWaiting()` in `install` and `clients.claim()` in `activate` (already present).
- Add a small `src/lib/swUpdate.ts` helper, called from `src/main.tsx`, that:
  1. Registers `/sw.js`.
  2. On `updatefound`, when the new worker becomes `installed` and there's an existing controller, calls `registration.waiting.postMessage({ type: 'SKIP_WAITING' })` and triggers `window.location.reload()` once the new worker takes control (`controllerchange` event).
  3. Polls `registration.update()` every 60 s while the tab is visible so users get fresh builds without manual refresh.
- Add a matching message listener in `public/sw.js` to handle `SKIP_WAITING`.
- Add a one-time `<meta http-equiv="Cache-Control" content="no-cache">` and a `?v=<build>` query string on the SW registration call so the browser actually re-fetches `sw.js` and notices the version bump.

After this ships once, every existing installed user will auto-reload to the latest build the next time they open the app — no app-store-style update prompt needed.

---

### Files to change

| File | Change |
|---|---|
| `public/logo-192.png`, `public/logo-512.png`, `public/logo-header.png`, `public/favicon.png` | New optimized images generated from current logo |
| `public/logo.png`, `public/favicon.ico` | Delete (legacy oversized) |
| `src/assets/logo.png` | Replace with smaller header version |
| `src/components/Header.tsx` | Use new small logo |
| `index.html` | New favicon + apple-touch-icon paths; combined Google Fonts `<link>`; drop unused font families |
| `src/index.css` | Remove `@import` font lines; gate heavy `backdrop-filter` behind `min-width:768px`; add `prefers-reduced-motion`; `content-visibility: auto` for sections |
| `vite.config.ts` | Update PWA `manifest.icons` to the new 192/512 PNGs |
| `src/pages/Index.tsx` | `React.lazy` + `Suspense` for below-fold sections; idle-defer Admin panel & PWA banner |
| `src/components/BackgroundImage.tsx` | Idle-load the photo; gradient placeholder first |
| `src/components/NoticesSection.tsx` | Seed React Query `initialData` from `localStorage` cache |
| `public/sw.js` | Bump cache to `v2`; delete old caches on activate; handle `SKIP_WAITING` |
| `src/lib/swUpdate.ts` | New helper: register SW, auto-reload on update, periodic `update()` poll |
| `src/main.tsx` | Call `registerSWWithAutoUpdate()` |
