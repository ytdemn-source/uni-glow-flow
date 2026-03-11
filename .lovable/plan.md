

## Google Ads (AdSense) Integration

You can add Google AdSense to your app to earn revenue from ad impressions and clicks. Here's what's involved:

### Prerequisites (outside Lovable)
1. **Sign up for Google AdSense** at [adsense.google.com](https://adsense.google.com)
2. Get your site approved — Google reviews your site content, traffic, and policies
3. Your published URL (`uni-glow-flow.lovable.app`) or a custom domain can be submitted
4. Once approved, you'll get a **Publisher ID** (ca-pub-XXXXXXX) and **Ad Slot IDs**

### What I'd build

**`src/components/AdBanner.tsx`** — Reusable ad component:
- Loads the AdSense script (`pagead2.googlesyndication.com`)
- Renders `<ins class="adsbygoogle">` ad units
- Supports different ad formats: banner, in-feed, in-article
- Responsive sizing for mobile

**Ad placements** (non-intrusive spots):
- Between notice cards (every 5th notice) — in-feed ads
- Below the Hero section — banner ad
- Inside the Bookmarks panel — small banner

**`src/pages/Index.tsx`** — Insert ad components at strategic positions

### Realistic expectations
- College apps typically have low traffic, so earnings will be modest (a few dollars/month initially)
- AdSense requires decent traffic and original content for approval
- Alternative: **Google Ad Manager** or simple affiliate links may be easier to start with

### Would you like to proceed?
I need your AdSense Publisher ID and Ad Slot ID to implement this. If you don't have an AdSense account yet, sign up first and get approved, then come back and I'll wire it up.

