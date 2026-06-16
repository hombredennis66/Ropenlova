## Goal

One immersive, scroll-driven website that combines two things:
1. A **3D, scroll-based landing experience** (real depth via Three.js / React Three Fiber) opening with the exact video-background **hero section** you specified.
2. An integrated **Student Spending Prediction dashboard** section showing model results and charts.

Everything is **static front-end** — no backend. The ML "results" (metrics + chart data) ship as a bundled JSON file in the repo (precomputed values), since there's no Python runtime in the browser.

---

## Tech & libraries

- React + TanStack Start (existing stack), Tailwind v4 tokens in `src/styles.css`.
- 3D: `three`, `@react-three/fiber`, `@react-three/drei` (scroll controls, parallax, interactive meshes).
- Scroll/motion: R3F `ScrollControls` + `useScroll`, plus `motion` (Framer Motion) for DOM overlays.
- Charts: `recharts` for the dashboard visualizations (bar = feature importance, line/scatter = predicted vs actual, comparison of models).
- Fonts loaded via `<link>` in `__root.tsx`: Schibsted Grotesk, Inter, Noto Sans, Fustat (400/500/600/700), registered as `--font-*` tokens.

---

## Page structure (single scroll journey)

```text
┌─ Section 0: HERO (video bg + nav + headline + search box)  ← your detailed spec
│
├─ Section 1: 3D depth intro
│     scroll-driven 3D scene (floating data shards / particle field),
│     real parallax depth, camera dolly on scroll, hover-interactive objects
│
├─ Section 2: "The Dataset" — 3D animated stat counters
│     250 records · 23 features, depth-layered cards
│
├─ Section 3: DASHBOARD — Student Spending Prediction
│     • Model comparison (R², RMSE, MAE) across Linear / Ridge / Lasso / RandomForest
│     • Feature importance bar chart (Random Forest)
│     • Predicted vs Actual scatter/line
│     • Feature category breakdown (Financial / Lifestyle / Behavioral / Academic)
│
└─ Section 4: Footer / CTA
```

3D and DOM are layered: a fixed full-screen R3F `<Canvas>` renders the depth scene; HTML sections scroll over it via `ScrollControls`'s HTML layer, so text/UI stay crisp while 3D reacts to scroll.

---

## Hero section (built exactly to your spec)

**VideoBackground component** — custom `requestAnimationFrame` fade system (NO CSS transitions):
- Video at 115% w/h, centered horizontally, anchored top (`object-top`), URL = the CloudFront mp4 you gave.
- 250ms RAF fade-in on load/loop start.
- 250ms fade-out when 0.55s remain (via `timeupdate`), guarded by `fadingOutRef` so it can't re-trigger.
- On `ended`: opacity→0, 100ms delay, reset `currentTime=0`, `play()`, fade back in.
- Each fade cancels prior `requestAnimationFrame` IDs; fades resume from current opacity (no snap).

**Navigation** — "Logoipsum" logo (Schibsted Grotesk SemiBold 24px, -1.44px); menu: Platform, Features (chevron), Projects, Community, Contact (Medium 16px, -0.2px); right: "Sign Up" (transparent, 82px) + "Log In" (black bg/white, 101px). Padding 120px / 16px.

**Hero content** (`-mt-[50px]`): dark badge (star + "New" + "Discover what's possible", Inter 14px); headline "Transform Data Quickly" (Fustat Bold 80px, -4.8px); subtitle (Fustat Medium 20px, -0.4px, #505050, width 542 / max 736px).

**Search box** — backdrop-blur, `rgba(0,0,0,0.24)`, max-w 728px / h 200px / radius 18px:
- Top row: "60/450 credits" + green Upgrade button (`rgba(90,225,76,0.89)`); right "Powered by GPT-4o" + AI icon.
- White input area (radius 12px): placeholder "Type question...", black circular submit (up arrow, 36px).
- Bottom row: Attach / Voice / Prompts gray buttons (radius 6px) + counter "0/3,000".

Icons as inline SVG components (chevron, up-arrow, star, AI sparkle, paperclip, mic, search). Spacing: nav→hero 60px, header→search 44px, intra-header 34px, horizontal 120px.

---

## Color tokens (added to `src/styles.css`)

`#000000`, `#505050`, `#f8f8f8`, green `rgba(90,225,76,0.89)`, dark badge `#0e1311`, white, overlay `rgba(0,0,0,0.24)` — as semantic tokens, referenced via Tailwind classes (no hardcoded hex in components).

---

## ML data handling (static)

- A bundled `src/data/results.json` holding precomputed metrics (R²/RMSE/MAE per model), feature-importance array, and predicted-vs-actual sample points — mirroring what `model_training.py` would output. Dashboard reads this JSON directly (no fetch/CORS, no server).
- If you later want the *real* numbers, you'd run the Python scripts offline and paste the generated `results.json` in; the dashboard will render whatever's in that file.

---

## Files (high level)

- `src/styles.css` — fonts + color tokens.
- `src/routes/__root.tsx` — font `<link>` tags.
- `src/routes/index.tsx` — assembles the scroll experience.
- `src/components/hero/VideoBackground.tsx`, `Navigation.tsx`, `HeroContent.tsx`, `SearchBox.tsx`, `icons.tsx`.
- `src/components/three/DepthScene.tsx` (+ scroll-reactive meshes/particles).
- `src/components/dashboard/*` (model comparison, feature importance, predicted-vs-actual, category breakdown) using recharts.
- `src/data/results.json`.

---

## Verification

- Build passes; preview loads.
- Hero video fades behave per spec (visual check in preview).
- 3D scene reacts to scroll with real depth; no SSR `window` crash (Canvas client-only).
- Dashboard charts render from JSON.

---

## Notes / trade-offs

- Heavy 3D + full-screen video is GPU/bandwidth intensive; I'll keep the particle counts moderate and lazy-mount the Canvas to protect performance.
- R3F runs client-side only — the Canvas will be guarded so SSR/prerender doesn't break.
