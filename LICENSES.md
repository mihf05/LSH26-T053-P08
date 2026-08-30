# Third-Party Material and AI Disclosure

## Third-party frameworks, libraries, starters, templates, UI kits, fonts, icons and assets

| Name | Version or source URL | Licence | Used for |
|---|---|---|---|
| Next.js | 16.3.3 | MIT | React framework (App Router, server components, dynamic routes) |
| React | 19.2.8 | MIT | UI rendering |
| React DOM | 19.2.8 | MIT | DOM rendering target for React |
| TypeScript | ^5 | Apache-2.0 | Static typing throughout the codebase |
| Tailwind CSS | ^4 | MIT | Utility-first CSS — all layout and spacing |
| DaisyUI | ^5.7.22 | MIT | Theme plugin for Tailwind (light/black theme tokens, table base styles) |
| @tailwindcss/postcss | ^4 | MIT | PostCSS integration for Tailwind v4 |
| @neondatabase/serverless | ^1.1.0 | MIT | HTTP-transport PostgreSQL driver for Neon serverless deployments |
| pg (node-postgres) | ^8.23.0 | MIT | TCP PostgreSQL driver for local development |
| Geist Sans | Via `next/font/google` | SIL OFL 1.1 | Primary UI typeface for dashboard screens |
| Geist Mono | Via `next/font/google` | SIL OFL 1.1 | Monospace typeface for labels, data values, and rule citations |
| Source Serif 4 | Via `next/font/google` | SIL OFL 1.1 | Serif display typeface for landing page body prose |
| Radio Canada Big | Via `next/font/google` | SIL OFL 1.1 | Display typeface for landing page headings and navigation |
| Landing page images & icons (hero.jpg, feature.svg, values-bg.png, icon-1/2/3.svg, footer-texture.png, arrow.svg, quotation.svg, sticker.svg) | Exported from Figma file `QMI63rM4YzUCDpN91OtS6Z` (node 1:265 "Desktop") via the Figma MCP asset host | Provided as part of the hackathon problem assets | Landing page visuals, background textures, and value-card icons |

> **Note on Figma assets:** The images and vectors listed above were exported from a Figma design file provided as part of the hackathon problem. They are used solely for the visual presentation of the landing page.

---

## AI tools

| Tool | Used for | How the output was verified |
|---|---|---|
| **Antigravity IDE** | Code generation (component scaffolding, page layouts, CSS design tokens), styling refinement, verification script creation, and documentation (README, DISCLOSURE) | All generated code was tested with `npm run verify` (92 assertions across 10 edge cases), inspected manually during code review, and validated against a full production build (`npm run build`) |
| **Claude Code** | Architectural refactoring, command proxy optimisations for terminal efficiency, and code review | Verified via the Next.js Turbopack compiler, ESLint static analysis, and terminal command execution against the running dev server |

---

## Original-work statement

Everything not declared in this file or `EVENT.md` was created by the registered team (**LSH26-T053**) during the event window.

This includes:

- All application source code under `app/`, `components/`, `lib/`, `db/`, and `scripts/`
- The pure grading engine (`lib/grading.ts`) and its rule implementation (R-10, R-11, R-12, R-13, R-29)
- The database schema (`db/schema.sql`) and seed data (`db/seed.sql`) including the 10 hand-crafted edge cases
- The 92-assertion offline verification suite (`scripts/verify.ts`)
- All prose documentation (`README.md`, `evaluation-manifest.json`, `Event.md`, this file)
