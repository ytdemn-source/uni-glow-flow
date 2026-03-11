

## Performance & UI Polish

After reviewing the codebase, here are the main sources of lag and UI roughness, with fixes:

### Performance Fixes

**1. `useParallax.ts` — eliminate scroll-driven re-renders**
The parallax hook calls `setState` on every scroll event, re-rendering the entire component tree. Replace with `useRef` + direct DOM manipulation via `requestAnimationFrame` to bypass React rendering entirely.

**2. `src/index.css` — reduce expensive `backdrop-filter` and `filter: blur`**
- `.glass-card` uses `backdrop-filter: blur(24px) saturate(1.8)` — extremely heavy on mobile GPUs. Reduce to `blur(12px) saturate(1.2)` and use a more opaque background to compensate.
- `.reveal` and `.stagger-children` animate `filter: blur(4px)` on every card — remove the blur from scroll animations entirely (keep opacity + translateY only). This alone will significantly reduce jank.

**3. `BackgroundImage.tsx` — optimize background rendering**
- Remove parallax from background image (it causes constant repaints of a large blurred image). Use a static `background-position: center` with CSS `will-change: auto`.
- The `h-[150%]` oversized image forces large compositing layers. Change to `h-full object-cover`.

**4. `Header.tsx` — throttle scroll listener**
Add passive listener and only update state when the threshold actually changes (debounce the boolean flip).

### UI Polish (Mobile-First)

**5. Tighter mobile spacing across all sections**
- Reduce section padding from `py-24` to `py-12` on mobile (keep desktop as-is)
- Reduce section header margins from `mb-16` to `mb-8` on mobile
- Files affected: `QuickLinksSection`, `DepartmentsSection`, `ServicesSection`, `ContactSection`

**6. Smoother mobile menu transition**
Replace the instant show/hide in `Header.tsx` with a slide-down animation using `max-height` transition instead of conditional rendering.

**7. Cleaner notice cards**
- Reduce glass-card-elevated shadow intensity for a flatter, modern look
- Tighten padding on mobile cards

### Files to modify

| File | Change |
|---|---|
| `src/hooks/useParallax.ts` | Ref-based DOM update, no re-renders |
| `src/index.css` | Reduce backdrop-filter blur, remove filter:blur from animations |
| `src/components/BackgroundImage.tsx` | Remove parallax, simplify to static bg |
| `src/components/Header.tsx` | Throttle scroll, animate mobile menu |
| `src/components/QuickLinksSection.tsx` | Mobile spacing |
| `src/components/DepartmentsSection.tsx` | Mobile spacing |
| `src/components/ServicesSection.tsx` | Mobile spacing |
| `src/components/ContactSection.tsx` | Mobile spacing |
| `src/components/NoticesSection.tsx` | Mobile spacing |

