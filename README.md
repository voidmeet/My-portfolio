# meetbundela.in v3

Personal portfolio of **Meet Bundela**, DevOps Engineer.

## Stack

- **React 18 + Vite + TypeScript + Tailwind**
- **three.js / @react-three/fiber**: one GPU particle system (11k points, custom GLSL) that follows you down the page and morphs into a different shape for each section: planet core → torus knot → double‑helix pipeline → cluster lattice → galaxy → portal
- **GSAP ScrollTrigger**: pinned horizontal "pipeline" for experience
- **Lenis**: smooth scrolling, whose velocity drives the marquee skew and particle turbulence
- **Framer Motion**: scroll-lit manifesto text, stacking project cards, masked text reveals, magnetic buttons, tilt + holographic cards

Also included: a boot-sequence preloader, a custom cursor, spotlight bento cards and an interactive terminal (`help`, `skills`, `projects`, `sudo hire-meet` …).
Respects `prefers-reduced-motion`; on touch devices the custom cursor is disabled and the particle count drops.

## Editing content

All copy lives in `src/data/portfolio.ts` (experience, projects, skills, certification, socials).
The CV served by the "Download CV" button is `public/Meet_Bundela_CV.pdf`.

## Develop

```sh
npm install
npm run dev      # http://localhost:8080
npm run build
```

### Contact form

The form sends through EmailJS when these are set (e.g. in `.env.local` or your host's env settings):

```
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...
```

Without them it falls back to opening the visitor's mail client.
