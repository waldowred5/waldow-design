# waldow-ds

A small but real design system: three-tier design tokens, accessible React components, Storybook and Chromatic visual regression from the first commit.

## Workspace

| Path | Package | What it is |
| --- | --- | --- |
| `packages/tokens` | `@waldow-ds/tokens` | Design tokens, built into CSS variables |
| `packages/ui` | `@waldow-ds/ui` | React components (shadcn/ui foundation, see [ADR 001](docs/adr/001-shadcn-ui-component-foundation.md)) |
| `packages/catalog` | `@waldow-ds/catalog` | Machine-readable component catalog (Phase 2) |
| `apps/web` | `@waldow-ds/web` | The design system app |

## Getting started

Requires Node 22+ (see `.nvmrc`) and pnpm (pinned via `packageManager`, so `corepack enable` is enough).

```bash
pnpm install
pnpm dev        # run the app
pnpm storybook  # component workbench on :6006
pnpm check      # lint, typecheck and build everything
```

## Quality gates

| Gate | Where | Blocks on |
| --- | --- | --- |
| Lint, tokens-only check, typecheck, build | `ci.yml` | Any failure |
| Unit tests and axe on every story | `ci.yml` (`pnpm test`) | A failing test or any axe violation |
| Bundle-size budget | `ci.yml` (`pnpm size`, `.size-limit.json`) | A bundle over its limit |
| Token contrast | token build | A key text/background pair below WCAG AA |
| Visual regression | `chromatic.yml` (Chromatic "UI Tests" status) | Unreviewed visual changes |

Storybook is published to Chromatic on every PR and on every merge to `main`. The workflow needs a `CHROMATIC_PROJECT_TOKEN` repo secret.

## Decisions

Architecture decisions live in [`docs/adr`](docs/adr).
