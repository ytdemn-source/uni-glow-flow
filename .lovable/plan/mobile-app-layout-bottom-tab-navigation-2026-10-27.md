# Mobile app layout: bottom tab navigation

Make the site feel like a native mobile app on phones: fixed bottom tab bar with 5 tabs, each tab a real route so the active tab is highlighted. Desktop keeps the current long-page design exactly as it is.

## Tabs

1. **Home** (`/`) — compact mobile home: hero, live notices preview, quick cards.
2. **Notices** (`/notices`) — the full notices section (college / university / admin toggle).
3. **Subjects** (`/subjects`) — subject cards with syllabus / routine / results / notices tabs.
4. **Notes** (`/notes`) — existing notes library page (add the tab bar to it).
5. **More** (`/more`) — study tools, quick links, announcements page, student login, feedback/contact, install-app prompt, admin link.

## Changes

- **`src/components/BottomTabBar.tsx` (new)** — fixed bottom bar, visible only below `md` (`useIsMobile`), hidden on `/admin*` routes. Emerald/gold tile styling to match the current design, active tab highlighted in gold, safe-area padding for notched phones.
- **`src/pages/NoticesPage.tsx`, `src/pages/SubjectsPage.tsx`, `src/pages/MorePage.tsx` (new)** — thin pages that reuse the existing sections (`NoticesSection`, `DepartmentsSection`, `ServicesSection`, `QuickLinksSection`, `ContactSection`) with mobile-tuned spacing and page padding so the tab bar never covers content.
- **`src/App.tsx`** — add routes `/notices`, `/subjects`, `/more`.
- **`src/pages/Index.tsx`** — mobile home variant: hero + notices preview shown; on mobile hide the quick-links / tools / contact sections (they move to the More tab) so Home stays light and fast. Desktop rendering unchanged.
- **`src/pages/Notes.tsx` and `NoteDetail.tsx`** — include the tab bar on mobile.
- **`src/components/Header.tsx`** — on mobile: logo + theme toggle only (hamburger menu removed since the tab bar navigates); desktop nav untouched.
- **In-page `#anchor` links** in hero/services/footer become router links on mobile so tab switching works from any tab.
- Add bottom padding (`pb-24`) on mobile so content clears the fixed bar.

## Not changing

- Desktop layout, admin pages, backend, notices scraping — untouched.

## Verification

- Playwright on a 384px viewport: tab bar visible with 5 tabs, each tab navigates and highlights, content not hidden behind the bar, admin routes have no tab bar.
- Desktop screenshot: current design unchanged.
