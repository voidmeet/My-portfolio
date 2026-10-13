# meetbundela.in — next-gen portfolio

Portfolio for **Meet Bundela, Cloud & DevOps Engineer**: a continuous 3D scroll experience built like a CI/CD pipeline.

A holographic 4×4×4 "container" made of 64 voxels is the thread through the whole page:

1. **Hero** — it sits at the core of a particle cluster globe with orbiting satellites and data-flow arcs.
2. **Stack** — scrolling shatters the container; each vertical slice flies into the power port of a skill card and "boots" it.
3. **Pipeline** — the voxels reassemble into a gyroscope data packet riding the head of a pinned horizontal timeline. Stages move `queued → running → passed` as the packet crosses them.
4. **Contact** — the container docks over Rajkot on the ops map, next to a working terminal (`sudo contact --email … --msg "…"`).

## Stack

| Concern | Tooling |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack, Cache Components) · React 19 · TypeScript |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) |
| 3D | three.js · @react-three/fiber · @react-three/drei (`Preload`, `PerformanceMonitor`) |
| Scroll & motion | GSAP ScrollTrigger (pinning / scrub) · Lenis smooth scroll · Framer Motion (micro-interactions) |
| Contact delivery | EmailJS, with a `mailto:` fallback |

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build && npm start
```

Copy `.env.example` to `.env.local` and fill in your EmailJS keys so the terminal can deliver messages. The template receives `from_name`, `from_email`, `message` and `to_email`. Without keys, `contact` opens the visitor's mail client with a pre-filled draft.

## Architecture

```
app/                    layout (fonts, metadata), page, icon, robots, sitemap
components/
  3d-canvas/            the single fixed WebGL layer
    Scene.tsx             Canvas, adaptive DPR, Preload
    Director.tsx          reads DOM once per frame → scroll stages + world-space anchors
    CameraRig.tsx         responsive FOV (wider on portrait) + pointer parallax
    ParticleGlobe.tsx     hero cluster (custom point / arc shaders)
    DataThread.tsx        64 instanced voxels morphing between 4 formations
    DataField.tsx         depth particles + perspective grid floor
    shaders/              GLSL
  scroll/SmoothScroll    Lenis ↔ GSAP ticker ↔ ScrollTrigger, MotionConfig
  hero/                  typing boot line, decrypt title, magnetic Deploy button, HUD
  cards/                 tilt cards with masked power ports, toolchain marquee
  experience/            pinned horizontal pipeline + SVG network cable
  contact/               terminal (parser, commands, wizard), Gujarat ops map
  layout/ ui/            navbar, footer, overlays, shared primitives
lib/                     content (data.ts), scene bridge, geo projection, contact delivery
```

**How the DOM and 3D stay in sync:** components register empty *anchor* elements (`anchorRef("hero")`, `anchorRef("stack-0")`, …). Each frame the `Director` projects every anchor's on-screen box onto the z = 0 plane, so the 3D layer follows the responsive CSS layout automatically, with no hard-coded positions per breakpoint. Scroll progress is never stored in React state; everything is read inside `useFrame`.

All portfolio copy lives in `lib/data.ts`.

## Performance notes

- One canvas for the whole page; instanced voxels, GPU-animated particles, zero per-frame allocations in the frame loop.
- `PerformanceMonitor` steps the DPR down on slow devices; touch, narrow or low-core devices get a lighter quality tier (fewer particles, no MSAA).
- Glow is done with additive shaders and halo sprites instead of a bloom pass, and the UI avoids `backdrop-filter` over the live canvas.
- The canvas loads client-only after first paint (`next/dynamic`, `ssr: false`) and fades in. Without WebGL the page still works and the cards power on as they scroll into view.
- `prefers-reduced-motion` disables smooth scroll, typing/decrypt effects and CSS loops, and slows the 3D motion.
