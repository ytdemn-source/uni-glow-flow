# Rebrand to "A Help Deck" — Generic Student Helper

Strip all Galsi Mahavidyalaya / Galsi College branding, names, logo association, and structured-data claims. Keep current visual styling. Keep notes library, admin broadcasts + notifications, department info (generic), quick links & services.

## Rename & metadata

- `index.html`: title → "A Help Deck — Student Helper for Notes, Notices & Study Tools"; description, keywords, og/twitter tags rewritten with no college references, no Bengali college name, no Jakir personal credit.
- Remove `google-site-verification` (tied to old identity) and Galsi JSON-LD (`CollegeOrUniversity` block).
- Replace `WebSite` JSON-LD: name "A Help Deck", generic description, no author.
- `public/llms.txt`, `public/robots.txt`, `public/sitemap.xml`: rewrite as generic student helper content.
- `public/manifest.webmanifest`: name/short_name → "A Help Deck".
- App title in `Admin.tsx` (`document.title`) and any other page titles → "A Help Deck".

## Remove college-branded UI

- **Header / Hero** (`Header.tsx`, `Hero.tsx`): remove "Galsi", "Galsi Mahavidyalaya", Bengali college name, college tagline. New name "A Help Deck" with generic tagline "Your study companion".
- **Logo**: replace `src/assets/logo.png` reference with a neutral generated mark (simple book/deck icon). Update favicon, apple-touch-icon, logo-192, logo.png with the new mark.
- **Footer** (`Footer.tsx`): remove official website link to galsimahavidyalaya.ac.in, RSS link (feed is college-scraped), disclaimer paragraph mentioning the college, "by Jakir" credit → generic "Made for students".
- **NoticesSection**: drop the "College Notices" toggle and scraped-notice branch entirely. Section becomes just "Announcements" fed by admin broadcasts. Remove `NoticeCard`, `NoticeSearch`, `NoticeCategoryFilter` from the section (files kept only if reused elsewhere — otherwise delete).
- **DepartmentsSection / departmentsData**: strip college-specific department descriptions, faculty names, Burdwan University references. Keep as a neutral subject/department directory (Bengali, English, Math, Physics, etc.) with generic descriptions only.
- **QuickLinksSection**: remove Burdwan University, WBCHSE, WBCAP, UGC, Banglar Uchchashiksha as college-official links. Keep only genuinely generic student utilities (e.g., DigiLocker, NPTEL, SWAYAM, generic calculators/timers) — user can prune later.
- **ServicesSection / ContactSection**: remove college contact info, address, principal, phone numbers. Replace Contact with a generic "Feedback" mailto or drop entirely.
- **NotesPromoCard**: keep, reword copy to be college-agnostic.

## Remove college-scraper backend surface (frontend-only stripping)

- Delete usage of `scrape-notices` and `rss-feed` from the UI (`src/lib/api/notices.ts` calls, RSS link in Footer, RSS alternate link in `index.html`). Leave the edge functions in place (backend not being modified per user scope — they simply become unused).
- Delete `BroadcastsPreview.tsx` if still unreferenced.

## Files to edit

- `index.html`
- `public/llms.txt`, `public/robots.txt`, `public/sitemap.xml`, `public/manifest.webmanifest`
- `src/components/Header.tsx`, `Hero.tsx`, `Footer.tsx`, `NoticesSection.tsx`, `DepartmentsSection.tsx`, `QuickLinksSection.tsx`, `ServicesSection.tsx`, `ContactSection.tsx`, `NotesPromoCard.tsx`
- `src/lib/departmentsData.ts`
- `src/pages/Index.tsx`, `Admin.tsx`, `Notes.tsx`, `Notifications.tsx`, `NoteDetail.tsx` — page titles
- Replace `src/assets/logo.png` and `public/favicon.png` / `logo-192.png` / `apple-touch-icon.png` with a new neutral logo (generated).

## Files to delete

- `src/components/BroadcastsPreview.tsx` (unused after merge)
- Optionally `NoticeCard.tsx`, `NoticeSearch.tsx`, `NoticeCategoryFilter.tsx`, `src/lib/api/notices.ts` if no other consumer remains after the NoticesSection rewrite (will confirm during edit).

## Kept as-is

- Visual design system (colors, tokens, glass cards, typography) — no palette/font changes.
- AdSense integration (user chose only the branding scope).
- Notes library, admin dashboard, broadcasts + push notifications, PWA behavior.

## Out of scope

- No database schema changes.
- No edge-function deletion.
- No new features.
