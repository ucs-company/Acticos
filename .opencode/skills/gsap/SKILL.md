---
name: gsap
description: Use when adding scroll-driven or timeline animations with GSAP and ScrollTrigger in this React/Vite site (headline reveals, parallax, pinned sections, counters, staggered grids). Trigger keywords: gsap, ScrollTrigger, timeline, parallax, pin, scroll animation, tween, stagger, split text.
---

# GSAP animations

This repo already ships `gsap` (^3.12) and uses it in `apps/web/src/animations/Counter.jsx` and `ProcessSteps.jsx`. Use GSAP for **scroll-driven, timeline, and performance-critical canvas-adjacent** motion. Keep Framer Motion for React enter/exit, `whileHover`, layout, and `AnimatePresence` page transitions. **Do not animate the same element with both libraries** — pick one per element.

## Imports and registration

```js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
```

Register once per module (registering repeatedly is idempotent but wasteful).

## React lifecycle pattern (required)

Always scope tweens with `gsap.context()` and revert on cleanup. Use `useLayoutEffect` so `from` states are applied before paint.

```jsx
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

export default function RevealOnScroll({ children }) {
  const root = useRef(null);
  const reduce = useReducedMotion();

  useLayoutEffect(() => {
    if (reduce || !root.current) return undefined;
    const ctx = gsap.context(() => {
      gsap.from('.gsap-item', {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
      });
    }, root);
    return () => ctx.revert();
  }, [reduce]);

  return <div ref={root}>{children}</div>;
}
```

Rules:
- `useLayoutEffect` + `gsap.context(scope)` for DOM tweens; return `ctx.revert()`.
- Respect `useReducedMotion()` — return early and render the final state.
- Never leave tweens running on unmount; `ctx.revert()` kills them and ScrollTriggers created inside.
- Prefer `gsap.from(...)` over CSS initial states to avoid a flash of wrong position.

## ScrollTrigger

- `start: 'top 80%'`, `end`, `scrub: true` for scrubbed effects, `once: true` for one-shot reveals.
- Call `ScrollTrigger.refresh()` after async data renders or layout height changes (lazy lists, images, filters). Debounce via `requestAnimationFrame`.
- In a `useEffect` cleanup on route change, revert the context (already handled by `ctx.revert()`).
- Pin sections with care in an SPA: `pin: true` changes scroll length; keep the pinned element inside a stable container and revert on unmount.

## Common recipes

Stagger grid:
```js
gsap.from('.card', { opacity: 0, y: 30, stagger: 0.06, duration: 0.6, ease: 'power2.out',
  scrollTrigger: { trigger: grid, start: 'top 80%', once: true } });
```

Parallax decorative layer:
```js
gsap.to('.parallax', { yPercent: -18, ease: 'none',
  scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true } });
```

Timeline sequence:
```js
const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.7 },
  scrollTrigger: { trigger: el, start: 'top 75%', once: true } });
tl.from('.eyebrow', { opacity: 0, y: 12 })
  .from('.title', { opacity: 0, y: 24 }, '-=0.45')
  .from('.body', { opacity: 0, y: 18 }, '-=0.4');
```

Counter (see existing `Counter.jsx`): tween a plain object and write `textContent` in `onUpdate`.

## Performance

- Animate only `transform` (`x`, `y`, `scale`, `rotate`) and `opacity`.
- Avoid animating layout properties (`top`, `height`, `width`) unless you need them; use `yPercent`/`scale`.
- Batch with ScrollTrigger `batch()` for large lists.
- Don't create tweens inside render or on every state change; key effects on stable deps.
- Canvas scenes live in `apps/web/src/animations/engine.js` and use raw `requestAnimationFrame` — leave them alone unless the task is about the canvas engine.

## Repo conventions

- Put helpers under `apps/web/src/animations/` (e.g. `Counter.jsx`, `ProcessSteps.jsx`).
- Import with the `@/` alias (points at `apps/web/src`).
- Match existing style: small focused components, `useReducedMotion`, no comments unless necessary.
- Verify with `npm run build:web` from the repo root.
