## Goal

Rank GS Hub for these searches:
- galsi mahavidyalaya
- galsi college
- galsi college notice / result / syllabus
- galsi college student hub
- galsi college jakir

The site is a single-page app (`/`), so ranking depends on (a) target keywords appearing in crawlable HTML, (b) structured data telling Google what the site is, and (c) Google actually knowing the page exists.

## Changes

### 1. Rewrite `index.html` head for keyword coverage
- **Title** (~60 chars): `Galsi College Student Hub - Notices, Results & Syllabus | GS Hub`
- **Meta description** (~155 chars): rewrite to include "Galsi Mahavidyalaya", "Galsi College", "notices", "results", "syllabus", and "student hub" naturally.
- **Keywords**: add the exact target phrases (galsi mahavidyalaya, galsi college, galsi college notice, galsi college result, galsi college syllabus, galsi college student hub, galsi college jakir).
- **Author**: keep "Jakir" (already there — supports "galsi college jakir" query).
- **og:title / og:description / twitter:* **: mirror the new title/description.

### 2. Add JSON-LD structured data in `index.html`
Two `<script type="application/ld+json">` blocks:
- **CollegeOrSchool** schema for Galsi Mahavidyalaya — name, alternateName ("Galsi College", "গলসী মহাবিদ্যালয়"), url, logo, address (Galsi, Purba Bardhaman, WB), parentOrganization (University of Burdwan).
- **WebSite** schema with `name: "GS Hub - Galsi College Student Hub"` and a `SearchAction` so Google can show a sitelinks search box.

This directly tells Google the page IS about Galsi Mahavidyalaya / Galsi College, which is the single biggest lever for these brand-style queries.

### 3. Add a crawlable, keyword-rich content block to `src/components/Hero.tsx`
The Hero currently shows "GS Hub" + "গলসী মহাবিদ্যালয়" + a one-line tagline. Add a visually-styled paragraph (not hidden, not display:none — Google ignores hidden text) under the hero that reads naturally and uses the target phrases once each, e.g.:

> "GS Hub is the unofficial student hub for **Galsi Mahavidyalaya** (Galsi College), Purba Bardhaman. Find the latest **Galsi College notices**, **results**, **syllabus**, admission updates, and department info — all in one place. Built by **Jakir** for students of Galsi College."

Kept short (2–3 lines), styled with existing muted-foreground tokens so it fits the design.

### 4. Add semantic section IDs and headings naming the keywords
- `NoticesSection` H2 → "Galsi College Notices" (currently generic).
- Add an H2 like "Galsi College Results & Syllabus" near the Quick Links / Services area, or rename existing headings so the words "Galsi College" + "result" + "syllabus" appear as real headings in the DOM.

### 5. Update `public/sitemap.xml` and `public/llms.txt`
- Add `<lastmod>` to the sitemap entry (today's date) so Google re-crawls.
- `llms.txt`: tweak the H1 and summary to lead with "Galsi College / Galsi Mahavidyalaya" so AI search engines (ChatGPT, Perplexity) surface the site for those queries too.

### 6. Tell Google Search Console to re-crawl
Reuse the existing `gsc-setup` edge function pattern: add a one-shot action that re-submits `sitemap.xml` and requests indexing for `/`. The site is already verified, so this is just an extra `PUT` on the sitemap endpoint to nudge a fresh crawl after the content changes ship.

## What this does NOT do

- No new routes / no `/notices`, `/results`, `/syllabus` pages. The app is single-page; splitting it would be a much bigger refactor. We get the keyword coverage by putting the words on the one page that exists.
- No backlink building, no Google Ads — those are outside what code changes can do. Ranking for "galsi college" against the official `galsimahavidyalaya.ac.in` domain will take weeks even with perfect on-page SEO, because they have years of authority. For "galsi college student hub" and "galsi college jakir" we should rank quickly because there's almost no competition for those exact phrases.

## Honest expectation

- **"galsi college student hub" / "galsi college jakir"** — should rank #1 within days once Google recrawls; near-zero competition.
- **"galsi mahavidyalaya" / "galsi college"** — the official college site will keep position #1. We're realistically targeting positions #2–#5 over a few weeks.
- **"galsi college notice / result / syllabus"** — competing with the official site's notice/result pages. Achievable top-5 over weeks if the notices section is kept fresh (which it already is via scraping).

After implementation, the user should click "Rescan" in the SEO tab and request indexing in Search Console.
