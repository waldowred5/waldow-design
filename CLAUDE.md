# waldow.design

A small but real design system: tokens → components → Storybook, with Chromatic and CI gates. Read `README.md` for the map; this file is the contract for generating UI and working in the repo.

**Naming:** the public name is **waldow.design**. Use it in UI copy, docs, titles and anything user-facing. `waldow-design` is the identifier form of the name: the repo slug and the `@waldow-design/*` package scope.

## The showcase app (`apps/web`)

The web app is the public face of the project. It should read like a SaaS developer docs site (think tailwindcss.com): a persistent sidebar grouped by section, an "on this page" outline, search, clean typography, live examples next to copyable code, and light/dark mode. Pages explain and demonstrate the system (foundations, components, theme knobs, token pipeline, quality and bundle budgets, workflow); they aren't marketing pages.

The home page hero reads:

> **Waldow.Design**
> An exploration into design systems in the age of agents

The generic shell and its pages come first (Phase 2). Domain-specific demo apps (ADR 002) come later and live inside that shell.

## The UI contract

Any UI you write here (app screens, component stories, prototypes) follows the same contract the runtime agent will (Phase 3, A2UI):

1. **Only design system components.** Import from `@waldow-design/ui` (list in [`packages/ui/README.md`](packages/ui/README.md#components)). Don't hand-roll a control that exists. If something is missing, say so and propose a component rather than inlining one.
2. **Only semantic tokens.** Style with the token utilities defined in `packages/ui/src/styles.css`: `bg-primary`, `text-muted-foreground`, `border-border-strong`, `rounded-control`, `shadow-raised`, `h-control-md`, `p-surface-inset`, `p-4`, `gap-2`. There are two token tiers, primitive and semantic, and no component tokens ([ADR 003](docs/adr/003-two-token-tiers.md)). Never:
   - raw colours (`#fff`, `rgb()`, `oklch()`)
   - arbitrary values (`p-[13px]`, `bg-[#...]`)
   - Tailwind's default palette (`bg-blue-500`; it is removed and silently does nothing)
   - primitive tokens (`var(--ds-color-primary-600)`)

   `pnpm lint` enforces this (`scripts/check-tokens.mjs`).
3. **Follow the design principles.** Start at [`Overview.mdx`](packages/ui/src/docs/principles/Overview.mdx) (Storybook: Principles/Overview); each principle has its own page with examples.
4. **Accessible by default.** Every control has a label. Icon-only buttons have `aria-label`. Dialogs have a `DialogTitle`. Every story must pass axe: the story tests render all of them in CI.

## Prototypes

When asked to explore or prototype UI, generate **several variants as stories** with `pnpm prototype "<idea>"` rather than one finished screen. The rules (one story per variant, same contract as above, Chromatic builds as described in [`docs/chromatic.md`](docs/chromatic.md), nothing ships to the app, when to keep one as a showcase example) live in [`prototypes/README.md`](prototypes/README.md).

## Working in the repo

```bash
pnpm install          # also builds tokens
pnpm dev              # apps/web
pnpm storybook        # :6006
pnpm check            # lint + tokens check, build, typecheck, tests, size budgets (what CI runs)
pnpm changeset        # in a PR that changes a package (see README "Versioning and releases")
```

- **Tokens:** edit JSON in `packages/tokens/src/`. A brand is a few knobs in `src/brand/`: primary, secondary and highlight seed colours (`theme.color.*`, expanded into scales by `palette.ts`), neutrals, `theme.radius` and `theme.font.*` (what each one drives: [`packages/tokens/README.md`](packages/tokens/README.md#brand-knobs)); derive from them rather than adding raw values. Change semantic colours in both `light.json` and `dark.json`. Component sizes and insets are semantic tokens named for the shape they serve ([shapes and utilities](packages/tokens/README.md#shapes)); reuse one before adding one, and never add a per-component token. The build fails below WCAG AA for the pairs listed in `build.ts`.
- **Colour format:** `tokens.css` is OKLCH; `tokens.js`/`tokens.json` keep hex for tools that can't parse `oklch()`. Don't add new hex consumers ([why](packages/tokens/README.md#why-oklch-and-where-hex-remains)).
- **Components:** `packages/ui/src/components/<name>.tsx`, with `<name>.stories.tsx` (and `<name>.test.tsx` for behaviour). JSDoc on the component holds usage and accessibility notes. Use `cn()` for class merging; it learns the token utility names from the token build (`@waldow-design/tokens/utilities`).
- **New token utility:** map it in `@theme inline` in `styles.css`, named for the token path without its first segment (`size.control.md` → `--spacing-control-md`); that's how `cn()` learns it. Watch for namespace collisions: Tailwind resolves `max-w-*`, `w-*` and `h-*` against `--spacing-*` before `--container-*`.
- **Decisions:** add an ADR in `docs/adr/` for anything that changes the foundation.

## Conventions

- Branches use the Linear name (`lab-123-short-title`). PR titles start `[LAB-123]`, and bodies say `Closes LAB-123`.
- New work: short-lived branches off main, one PR per ticket; merge with a merge commit.
- Commit messages follow Conventional Commits (`feat(ui): …`, `fix(tokens): …`, `docs: …`).
- pnpm 11 blocks dependency build scripts by default. Approve one in `pnpm-workspace.yaml` under `allowBuilds` only when it's needed.
