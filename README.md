# HeavyTech website

Marketing site for HeavyTech, Inc.: hybrid and electric off-highway machines built in Fort Wayne, Indiana.

Built with Next.js (App Router) + React + TypeScript + Tailwind CSS, exported as a static site for Cloudflare Pages. The home page and each machine page include an interactive 3D Gaussian-splat model of the machine, rendered with [Spark](https://sparkjs.dev) on three.js.

## Run it locally

```powershell
npm install
npm run dev        # http://localhost:3000
```

Before committing:

```powershell
npm run lint
npm run build      # writes the static site to out/
```

## Deploy (Cloudflare Pages)

| Setting | Value |
| --- | --- |
| Framework preset | Next.js (Static HTML Export) |
| Build command | `npm run build` |
| Build output directory | `out` |
| Node version | 20 or newer |

`public/_headers` sets long cache lifetimes for the 3D models and static assets.

## Where things live

```
src/
  app/                 routes: / (single page: Home, Machines, Technology, Service, News, Company), /machines/[slug], /reserve
    globals.css        design tokens (colors, type, grain) and base styles
    components.css     component styles
  components/          Nav (vertical section nav), Footer, SplatViewer (3D), NewsCarousel, PowertrainTabs, ReserveForm, shared blocks
  data/site.ts         all machine, powertrain and news content in one place
public/
  images/              optimized renders and photos (WebP)
  models/              3D Gaussian splats (.splat)
  textures/            film-grain tiles (dark and light)
```

To edit copy, change `src/data/site.ts` or the page files. To add a machine, add an entry to `machines` in `src/data/site.ts`; its page is generated automatically.

## Design system

- Dark-first: near-black charcoal `#0D0D0C` with a fine film grain behind the content; light mode is warm paper `#F3EEE8`. Visitors can switch with the toggle in the header; the choice is remembered.
- Headlines: Tomorrow, uppercase, tight tracking, kept to two to four words.
- Body and labels: Martian Mono.
- One accent: safety yellow `#F2B20D`.

## 3D models

The splats in `public/models/` were generated with [TripoSplat](https://github.com/VAST-AI-Research/TripoSplat) (MIT) from a single HeavyTech studio render each. Sides the render doesn’t show are inferred by the model and are approximate. For production, export the models from HeavyTech’s CAD / KeyShot scenes instead.

To add a model to a machine, put the `.splat` file in `public/models/` and set `model` on that machine in `src/data/site.ts`:

```ts
model: { src: "/models/arlo.splat", rotX: Math.PI, rotY: Math.PI, scale: 1.25, y: 0 }
```

`rotX: Math.PI` flips TripoSplat output upright; adjust `rotY` to choose which side faces the camera first.

## Not wired up yet

- The reservation and newsletter forms validate and confirm in the browser but don’t send anywhere. Connect them to a form service or a Cloudflare Pages Function before launch.
- News items link to the existing posts on heavytech.ai.
