## Goal
Get GS Hub (uni-glow-flow.lovable.app) indexed and appearing in Google search results.

## Why it isn't showing yet
Google has to (1) know the URL exists, (2) be allowed to crawl it, and (3) decide it's worth indexing. The site already has solid on-page SEO (title, description, JSON-LD, sitemap, robots.txt, GSC verification meta tag). The missing pieces are mostly *submission and freshness signals*, plus a couple of small fixes.

## Steps

### 1. Verify ownership in Google Search Console and submit the sitemap
The project already has a `gsc-setup` edge function and the verification meta tag in `index.html`. Call:
- `GET /functions/v1/gsc-setup?action=verify` — runs Google's verification, adds the site to the user's GSC property list, and submits `sitemap.xml`.

This is the single biggest lever — without GSC, Google has no reliable signal that a brand-new low-traffic domain exists.

### 2. Refresh `public/sitemap.xml`
Update `<lastmod>` to today's date (currently `2026-05-23`). A recent lastmod nudges Google to recrawl.

### 3. Ping IndexNow / Bing
Add a one-shot call from the same `gsc-setup` function (or a tiny new helper) that POSTs the homepage URL to IndexNow so Bing/Yandex pick it up immediately. Google doesn't support IndexNow, but Bing traffic is a real bonus and the call is free.

### 4. Tell the user the manual step only they can do
Some things require the user's own Google account in the Search Console UI — the agent can't do them:
- Open Search Console → URL Inspection → paste `https://uni-glow-flow.lovable.app/` → click **Request Indexing**.
- Same for `https://uni-glow-flow.lovable.app/sitemap.xml` under Sitemaps.

I'll surface a clear, copy-pasteable checklist after the code changes.

### 5. Honest expectations
- Indexing typically takes **3–14 days** for a brand-new domain even after submission. No code change makes it instant.
- "galsi college student hub" and "galsi college jakir" should rank quickly (near-zero competition).
- "galsi college" / "galsi mahavidyalaya" will sit behind the official `galsimahavidyalaya.ac.in` for weeks/months — that's an authority gap, not an on-page gap.

## What this does NOT do
- Doesn't build backlinks (the real long-term ranking lever).
- Doesn't guarantee a position — only Google decides that.
- Doesn't add new routes; the SEO plan in `.lovable/plan.md` already covers single-page keyword coverage and it's mostly implemented.

## Files touched
- `public/sitemap.xml` — bump `<lastmod>` to today.
- `supabase/functions/gsc-setup/index.ts` — optionally add an `action=indexnow` branch.

After this lands, I'll ask you to (a) click the GSC verify action, and (b) do the one-click "Request Indexing" in Search Console UI yourself.
