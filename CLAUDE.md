# waldow.design

A small but real design system: tokens → components → Storybook, with Chromatic and CI gates. Read `README.md` for the map; this file is the contract for generating UI and working in the repo.

**Naming:** the public name is **waldow.design**. Use it in UI copy, docs, titles and anything user-facing. `waldow-ds` is only an identifier: the repo slug and the `@waldow-ds/*` package scope.

## The UI contract

Any UI you write here (app screens, component stories, explorations) follows the same contract the runtime agent will (Phase 2, A2UI):

1. **Only design system components.** Import from `@waldow-ds/ui` (list in [`packages/ui/README.md`](packages/ui/README.md#components)). Don't hand-roll a control that exists. If something is missing, say so and propose a component rather than inlining one.
2. **Only semantic tokens.** Style with the token utilities defined in `packages/ui/src/styles.css`: `bg-primary`, `text-muted-foreground`, `border-border-strong`, `rounded-control`, `shadow-raised`, `p-4`, `gap-2`. Never:
   - raw colours (`#fff`, `rgb()`, `oklch()`)
   - arbitrary values (`p-[13px]`, `bg-[#...]`)
   - Tailwind's default palette (`bg-blue-500`; it is removed and silently does nothing)
   - primitive tokens (`var(--ds-color-brand-600)`)

   `pnpm lint` enforces this (`scripts/check-tokens.mjs`).
3. **Follow the design principles.** Start at [`Overview.mdx`](packages/ui/src/docs/principles/Overview.mdx) (Storybook: Principles/Overview); each principle has its own page with examples.
4. **Accessible by default.** Every control has a label. Icon-only buttons have `aria-label`. Dialogs have a `DialogTitle`. Every story must pass axe: the story tests render all of them in CI.

## Prototyping: explorations

When asked to explore or prototype UI, generate **several variants as stories** with `pnpm explore "<idea>"` rather than one finished screen. The rules (one story per variant, same contract as above, Chromatic on PRs into `main` or labelled `visual-test`, nothing ships) live in [`explorations/README.md`](explorations/README.md).

## Working in the repo

```bash
pnpm install          # also builds tokens
pnpm dev              # apps/web
pnpm storybook        # :6006
pnpm check            # lint + tokens check, build, typecheck, tests, size budgets (what CI runs)
pnpm changeset        # in a PR that changes a package (see README "Versioning and releases")
```

- **Tokens:** edit JSON in `packages/tokens/src/`. Change semantic colours in both `light.json` and `dark.json`. The build fails below WCAG AA for the pairs listed in `build.ts`.
- **Components:** `packages/ui/src/components/<name>.tsx`, with `<name>.stories.tsx` (and `<name>.test.tsx` for behaviour). JSDoc on the component holds usage and accessibility notes. Use `cn()` for class merging, and add new token utility names to `lib/cn.ts`.
- **New token utility:** map it in `@theme inline` in `styles.css`. Watch for namespace collisions: Tailwind resolves `max-w-*`, `w-*` and `h-*` against `--spacing-*` before `--container-*`.
- **Decisions:** add an ADR in `docs/adr/` for anything that changes the foundation.

## Conventions

- Branches use the Linear name (`lab-123-short-title`). PR titles start `[LAB-123]`, and bodies say `Closes LAB-123`.
- Phase work lands as **stacked PRs**: each targets the previous branch. Merge bottom-up.
- Commit messages follow Conventional Commits (`feat(ui): …`, `fix(tokens): …`, `docs: …`).
- pnpm 11 blocks dependency build scripts by default. Approve one in `pnpm-workspace.yaml` under `allowBuilds` only when it's needed.
