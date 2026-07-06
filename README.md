# Vinay Dodla — Portfolio

My personal portfolio site, built for backend, data engineering, and ML engineering roles.

**Live Demo:** [vinay-portfolio-dusky.vercel.app](https://vinay-portfolio-dusky.vercel.app)

## What problem does this solve?

A resume and LinkedIn profile can't show working software or how a system fits together — this site exists to link straight to the deployed projects and let a reviewer click through to something real instead of taking a bullet point's word for it. It's built as an actual React SPA (routing, page transitions, a 3D particle background) rather than a static template, partly because the site itself is a small demonstration of frontend ability alongside the backend/ML/data work it links to.

## Tech Stack

- **Frontend:** React 19, React Router 7, Vite, Tailwind CSS 4
- **Animation/3D:** Framer Motion (page transitions), Three.js (particle background)
- **Infra/Deployment:** Vercel (static SPA build), with a rewrite rule so client-side routes resolve correctly on refresh

## Architecture

Single-page app with three routed views — `Work` (landing/default route), `Personal`, and `Contact` — rendered inside an `AnimatePresence`-wrapped router so navigating between them animates the outgoing/incoming page rather than hard-cutting. A custom `Cursor` component and a `ParticleBackground` (Three.js) run globally above/behind every route. `vercel.json` rewrites all paths to `index.html` so React Router can handle routing client-side on a static host.

## Key Features

- Animated route transitions (fade + vertical slide) via Framer Motion, keyed off the current pathname
- Custom cursor and a Three.js particle background rendered behind the content on every page
- A `Work` page summarizing featured engineering projects (PulseOps, the fraud detection pipeline, the distributed chat system, and a fintech analytics project) with the role signal and stack each one demonstrates
- Separate `Personal` and `Contact` pages, kept out of the main work-focused landing view

## Interesting Engineering Decisions

- **Keyed `AnimatePresence` on `location.pathname`.** Without the `key` prop tied to the route, React Router swaps the outgoing/incoming components instantly and Framer Motion's exit animation never gets a chance to run — this is what makes route changes animate instead of snapping.
- **Client-side routing on a static host required an explicit rewrite rule.** `vercel.json` maps every path back to `index.html`; without it, a direct visit or refresh on `/personal` or `/contact` would 404 at the CDN before React Router ever loads.

## Running Locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```
