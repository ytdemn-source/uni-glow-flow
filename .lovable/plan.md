# Give A Help Deck real character

The site reads flat because everything is the same soft teal glass card. The chosen direction — "Tactical command hub" — turns the home page into a bento command center: deep emerald blocks, gold accents, cream paper background, and confident Space Grotesk headings.

## Look and feel

- Palette: deep emerald `#064e3b`, mid green `#0d7a5f`, gold `#c9a84c`, cream `#f5f0e0`.
- Type: Space Grotesk for headings and labels, DM Sans for body.
- Solid color blocks replace glass cards. Chunky 3xl radius, gold bottom rule on the hero, subtle dot-grid texture on accent tiles.
- Dark mode keeps the same hues, inverted onto a near-black emerald base.

## Home page structure (bento)

```text
+--------------------------------+-------------+
|  HERO (emerald, gold rule)     | LATEST      |
|  A Help Deck.                  | NOTICES     |
|  CTAs: Notices / Notes         | live feed   |
+---------+----------------------+-------------+
| STATUS  |  NOTES & HELP LIBRARY              |
| tile    |  two entry tiles                   |
+---------+------------------+-----------------+
| remaining sections: notices board, departments,
| quick links, services, contact (restyled)     |
+-----------------------------------------------+
```

- Hero: emerald block, eyebrow label, oversized italic wordmark, cream inset paragraph, gold pill CTA to notices + outline CTA to notes.
- Latest notices tile: white card, hard emerald border, live pulse dot, colored left rules per source (Admin / College / University), "View all updates" footer link. Keeps the existing live data.
- Status tile: green block with resource count and department chips.
- Library tile: white card with emerald icon block and two cream sub-tiles.
- Services tile: gold block with dot-grid texture and contact line.

Existing sections below (full notices board with the source toggle, departments, quick links, services, contact, footer) get the same token treatment so the page reads as one design, not two.

## Motion

Staggered tile reveal on scroll, gentle lift on hover, gold underline sweep on links. Respects reduced-motion.

## Technical notes

- Rewrite the palette in `src/index.css` (light + dark), swap `--font-sans`/heading font to Space Grotesk + DM Sans, add `.tile`, `.tile-emerald`, `.tile-gold`, `.dot-grid` component classes; retire the glass-card look.
- Load Space Grotesk + DM Sans via `<link>` in `index.html`.
- Rebuild `src/components/Hero.tsx` as the bento block (hero + notices + status + library + services tiles), keeping the current React Query data hooks for college notices and broadcasts.
- Restyle `NoticesSection`, `NoticeCard`, `DepartmentsSection`, `QuickLinksSection`, `ServicesSection`, `ContactSection`, `Footer`, `Header` to the new tokens.
- `BackgroundImage.tsx` becomes a flat cream/deep-emerald base instead of the teal gradient.
- Only presentation changes — no data, auth, or backend logic touched.
