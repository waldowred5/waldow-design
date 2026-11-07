# waldow.design

A small but real design system: tokens → components → Storybook, with Chromatic and CI gates. Read `README.md` for the map; this file is the contract for generating UI and working in the repo.

**Naming:** the public name is **waldow.design**. Use it in UI copy, docs, titles and anything user-facing. `waldow-design` is the identifier form of the name: the repo slug and the `@waldow-design/*` package scope.

## The UI contract

Any UI you write here (app screens, component stories, prototypes) follows the same contract the runtime agent will (Phase 2, A2UI):

1. **Only design system components.** Import from `@waldow-design/ui`. Don't hand-roll a control that exists (ActionBar, Button, Input, Field, Select, Checkbox, Card, Stack, Badge, Dialog, Table). If something is missing, say so and propose a component rather than inlining one.
2. **Only semantic tokens.** Style with the token utilities defined in `packages/ui/src/styles.css`: `bg-primary`, `text-muted-foreground`, `border-border-strong`, `rounded-control`, `shadow-raised`, `p-4`, `gap-2`. Never:
   - raw colours (`#fff`, `rgb()`, `oklch()`)
   - arbitrary values (`p-[13px]`, `bg-[#...]`)
   - Tailwind's default palette (`bg-blue-500`; it is removed and silently does nothing)
   - primitive tokens (`var(--ds-color-brand-600)`)

   `pnpm lint` enforces this (`scripts/check-tokens.mjs`).
3. **Follow the principles** in `packages/ui/src/docs/principles/`: one primary action per surface, primary actions at the trailing edge (last in `CardFooter`, `DialogFooter` or `ActionBar`), visible labels via `Field`, status in words (not colour alone), spacing from `Stack` gaps, destructive actions that name the object and the action, keyboard first.
4. **Accessible by default.** Every control has a label. Icon-only buttons have `aria-label`. Dialogs have a `DialogTitle`. Every story must pass axe: the story tests render all of them in CI.

## Prototypes

When asked to explore or prototype UI, generate **several variants as stories** rather than one finished screen:

```bash
pnpm prototype "invite member"   # scaffolds prototypes/invite-member/invite-member.stories.tsx
```

- One story per variant (`A: …`, `B: …`, `C: …`), each with a one-line JSDoc stating what it bets on.
- Same contract as above. Prototypes are linted, typechecked and axe-tested.
- Chromatic publishes them on the PR so variants can be compared by link. Nothing in `prototypes/` ships to the app; when a direction is picked, build it properly in `apps/web` or `packages/ui`.
- **Disposable by default, kept as showcase examples when useful.** Delete a prototype once its direction is built, unless it's a good example of the workflow. Then keep it committed: add `tags: ['showcase']` to its meta and note in the top JSDoc which variant won and why.

See `prototypes/invite-member/` for the shape (a showcase example).

## Working in the repo

```bash
pnpm install          # also builds tokens
pnpm dev              # apps/web
pnpm storybook        # :6006
pnpm check            # lint + tokens check, build, typecheck, tests, size budgets (what CI runs)
pnpm changeset        # describe a package change (needed on PRs to main)
```

- **Tokens:** edit JSON in `packages/tokens/src/`. A brand is a few knobs in `src/brand/`: primary, secondary and highlight seed colours (`theme.color.*`, expanded into scales by `palette.ts`), neutrals, `theme.radius` and `theme.font.*`; derive from them rather than adding raw values. Change semantic colours in both `light.json` and `dark.json`. The build fails below WCAG AA for the pairs listed in `build.ts`.
- **Components:** `packages/ui/src/components/<name>.tsx`, with `<name>.stories.tsx` (and `<name>.test.tsx` for behaviour). JSDoc on the component holds usage and accessibility notes. Use `cn()` for class merging, and add new token utility names to `lib/cn.ts`.
- **New token utility:** map it in `@theme inline` in `styles.css`. Watch for namespace collisions: Tailwind resolves `max-w-*`, `w-*` and `h-*` against `--spacing-*` before `--container-*`.
- **Decisions:** add an ADR in `docs/adr/` for anything that changes the foundation.

## Conventions

- Branches use the Linear name (`lab-123-short-title`). PR titles start `[LAB-123]`, and bodies say `Closes LAB-123`.
- Phase work lands as **stacked PRs**: each targets the previous branch. Merge bottom-up.
- Commit messages follow Conventional Commits (`feat(ui): …`, `fix(tokens): …`, `docs: …`).
- pnpm 11 blocks dependency build scripts by default. Approve one in `pnpm-workspace.yaml` under `allowBuilds` only when it's needed.
