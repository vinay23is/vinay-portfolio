# Vinay Dodla — Portfolio

Personal portfolio site for software, data, and ML/AI engineering roles.

**Live:** [vinay-portfolio-dusky.vercel.app](https://vinay-portfolio-dusky.vercel.app)

## What this is

A resume can't show working software or how a system fits together. This site
links straight to deployed projects so a reviewer can click through to something
real. It's built as an actual React SPA (routing, page transitions, a Three.js
particle background) rather than a static template — the site itself is a small
demonstration of frontend ability alongside the backend, data, and ML/AI work it
links to.

## Tech stack

- **Frontend:** React 19, React Router 7, Vite, Tailwind CSS 4
- **Animation / 3D:** Framer Motion (page transitions), Three.js (particle background, lazy-loaded)
- **Hosting:** Vercel — static SPA build plus one serverless function (`/api/duolingo`)

## Architecture

Single-page app with three routed views — `Work` (landing/default route),
`Personal`, and `Contact` — rendered inside an `AnimatePresence`-wrapped router
so navigating between them animates instead of hard-cutting. A custom `Cursor`
and the `ParticleBackground` run globally. `vercel.json` rewrites all paths to
`index.html` so React Router handles routing client-side on a static host.

The `Work` page leads with featured projects — PulseOps (API monitoring),
the fraud-detection pipeline, an AWS→Snowflake ingestion pipeline, a distributed
chat backend, and StockSense AI (full-stack + applied AI) — with additional
projects kept discoverable below. Experience is split into *Relevant / Technical*
and *Additional* so the engineering signal reads first.

## Duolingo streak (optional live integration)

The Personal page shows a Japanese Duolingo streak. It has **one source of
truth** (`useDuolingoStreak`) and works whether or not the live integration is
configured.

- **Serverless proxy:** `api/duolingo.js` calls Duolingo's public, read-only
  profile endpoint server-side, extracts and validates the streak, and returns
  `{ streak, source, updatedAt }`. It uses `AbortController` for a timeout,
  handles non-200s and malformed JSON, and never sends or exposes any password,
  JWT, or auth secret. Responses are CDN-cached (~6h) since a streak changes at
  most once a day.
- **Hook:** `useDuolingoStreak` initialises to the static fallback (**238**),
  fetches `/api/duolingo` once, and swaps in the real value only when the proxy
  reports `source === "duolingo"`. On any failure it keeps the fallback and
  never renders `0`. A small "Live from Duolingo" badge appears **only** when
  the value genuinely came from Duolingo.

### Enabling it

Set an environment variable in **Vercel → Project → Settings → Environment
Variables**, then redeploy:

| Variable | Required | Notes |
| --- | --- | --- |
| `DUOLINGO_USERNAME` | recommended | Your public Duolingo username. |
| `DUOLINGO_USER_ID` | optional | Numeric user id; used instead of the username if set. |

If **neither** is set, the endpoint returns the static fallback (238) and the
site works exactly the same, just without the live badge.

> **Limitation:** Duolingo's endpoint is undocumented and unofficial. If it
> changes shape, rate-limits, or goes away, the proxy falls back to 238 rather
> than breaking the page. It is read-only profile data only.

## Local development

```bash
npm install
npm run dev      # start Vite dev server
npm run lint     # ESLint
npm run build    # production build to dist/
npm run preview  # preview the production build
```

The `/api/duolingo` function runs on Vercel; in plain `vite dev` the hook simply
falls back to 238 (use `vercel dev` if you want to exercise the function locally).
