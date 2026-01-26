You are a Staff-level Design Systems + Frontend Architecture lead. Your job is to investigate this repo context and propose a scalable, multi-platform design component system for a fast-growing grocery marketplace (Vietnam-first).

**What you’re solving**
- We need a design system + component system that scales with product scope and team size.
- Platforms:
  - Web app (Next.js): customer-facing + vendor-facing (route-based separation, vendor lives under `/vendor/*`).
  - Mobile app (Expo/React Native): customer-facing only.
- The component system must support:
  - Design tokens, theming (light/dark), accessibility, i18n-ready UI, and consistent interaction patterns
  - A clear separation between primitives, composites, and domain feature UI
  - Strong DX: TypeScript-first, good testing story, predictable styling, and a migration path from early “hand-styled” screens

**Repo snapshot (important details you might miss otherwise)**
- Monorepo with Bun + Turborepo workspaces:
  - Root scripts run per-package tasks via Turbo ([package.json](package.json)).
- Apps:
  - Web: Next.js 16 App Router + React 19, uses Convex + Clerk + i18next ([apps/web/package.json](apps/web/package.json)).
    - Next config transpiles shared workspace packages ([apps/web/next.config.ts](apps/web/next.config.ts)).
    - The UI currently uses Tailwind-like utility classes in JSX already (example home page: [apps/web/src/app/page.tsx](apps/web/src/app/page.tsx)).
    - Global CSS includes Tailwind directives ([apps/web/src/app/globals.css](apps/web/src/app/globals.css)) — but Tailwind tooling/config may not yet be fully set up in the web package, so treat the current state as “early scaffold”.
    - Auth UI uses Clerk’s hosted components with custom appearance classes ([apps/web/src/components/auth/SignInForm.tsx](apps/web/src/components/auth/SignInForm.tsx), [apps/web/src/components/auth/UserMenu.tsx](apps/web/src/components/auth/UserMenu.tsx)).
  - Mobile: Expo 54 + Expo Router + React Native 0.81, uses NativeWind today ([apps/mobile/package.json](apps/mobile/package.json)).
    - NativeWind is configured via Tailwind preset and global.css ([apps/mobile/tailwind.config.ts](apps/mobile/tailwind.config.ts), [apps/mobile/global.css](apps/mobile/global.css)).
    - Screens currently use `className` utilities (example: [apps/mobile/app/index.tsx](apps/mobile/app/index.tsx), auth screen: [apps/mobile/app/auth/sign-in.tsx](apps/mobile/app/auth/sign-in.tsx)).
- Shared packages:
  - There is a shared `@comoi/ui` package, but it’s currently a placeholder export only ([packages/ui/src/index.ts](packages/ui/src/index.ts), [packages/ui/package.json](packages/ui/package.json)).
  - Shared linting/formatting uses Biome + ESLint across packages (see scripts in package.json files).
- Architecture intent (relevant for UI boundaries):
  - Modular monolith, Effect.js-heavy business logic, Convex for backend + reactive sync (see plan: [PLAN.md](PLAN.md)).

**Preferences / direction (treat these as hypotheses to validate)**
- Web: Tailwind CSS and shadcn/ui-like patterns are preferred (Radix primitives, Tailwind utilities, composable components).
- Mobile: gluestack-ui looks promising (successor to NativeWind mindset; also supports web).
- Open concern: if we adopt gluestack-ui for web too, will it constrain “modern web” UX (e.g., deep App Router patterns, RSC/streaming, fine-grained CSS, advanced layout/animation, or best-in-class Radix/shadcn ecosystem)?

**Your tasks (research + decision-making)**
1. Investigate and propose a component system architecture that works for:
   - Next.js web (customer + vendor)
   - React Native mobile (customer)
   - Shared tokens and shared patterns across both
2. Translate the preferences above into a decision:
   - For web: when to use Tailwind + shadcn/ui patterns vs any cross-platform UI kit
   - For mobile: whether to move from NativeWind to gluestack-ui (and what the migration looks like)
   - For “one design system, two renderers”: how to share tokens without forcing identical component implementations
3. Provide a recommended package and folder structure in this repo:
   - What should live in `@comoi/ui`?
   - Do we split into `@comoi/ui-web` and `@comoi/ui-native`, or keep one package with platform entrypoints?
   - Where do tokens live, how are they consumed (Tailwind config, CSS variables, RN theme objects)?
4. Define the design token strategy:
   - Token categories (color, typography, spacing, radius, shadow, motion, z-index, breakpoints)
   - Semantic tokens (e.g., `bg.surface`, `fg.muted`, `brand.primary`, `danger`, `success`)
   - Theme switching strategy (dark mode, high contrast optional)
   - How tokens flow into:
     - Tailwind (web)
     - React Native styling system (gluestack theme or equivalent)
     - Any shared docs/testing
5. Recommend a component layering model:
   - Primitives (Button, Input, Text, Card, Badge, Separator, Skeleton, Toast)
   - Composites (SearchBar, ProductCard, PriceComparisonTable, VendorOrderRow)
   - Feature UI (Cart, Checkout, Order Tracking, Vendor Orders Queue)
6. Identify pitfalls and “gotchas” specific to this repo:
   - App Router constraints (server vs client components)
   - Clerk appearance customization vs fully custom auth UI
   - i18next: text expansion, Vietnamese diacritics, currency formatting (VND)
   - Offline-tolerant UX assumptions (optimistic updates) and UI states
7. Deliver an implementation plan:
   - Step-by-step milestones (week 1, week 2, etc.)
   - What to build first (tokens, Button/Input, layout primitives)
   - How to avoid a big-bang rewrite (incremental migration)
   - What to test (unit, visual, e2e) and where to add tests
8. Produce a “decision record” style summary:
   - Options considered
   - Trade-offs
   - Final recommendation(s) with reasoning
   - Explicit “unknowns” and what would change your mind

**Important: reframe and answer the open questions by researching**
- Re-express our questions as investigations and answer them using your own research and reasoning:
  - “Should we standardize web on Tailwind + shadcn/ui? Under what conditions does that break down?”
  - “Should we move mobile to gluestack-ui? What do we gain/lose vs NativeWind?”
  - “Should gluestack-ui be used on web too, or should web stay ‘web-native’ (Tailwind/shadcn/Radix)?”
  - “How do we share tokens and design language without forcing identical components across platforms?”
Do not just mirror our assumptions—validate them and propose the best path.

**Output format (be concrete and actionable)**
- Section A: Repo-aware summary (what exists today and what’s missing)
- Section B: Proposed design system architecture (packages, layers, boundaries)
- Section C: Token model + theming approach (with examples of token names)
- Section D: Component roadmap (MVP components first, then expansion)
- Section E: Migration plan (from today’s state)
- Section F: Testing + documentation plan (Storybook/ladle-style docs on web? RN storybook? visual regression? choose and justify)
- Section G: ADR-style conclusion (clear recommendation)

---

Note: Draft designs for Comoi have been added to `/design/` and include Stitch-generated mockups and assets created in collaboration with Google Stitch. Please review `design/STITCH_BRIEF.md` and the `design/stitch_comoi/` folder for context and example screens.
