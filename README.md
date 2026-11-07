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
pnpm check      # lint, typecheck and build everything
```

## Decisions

Architecture decisions live in [`docs/adr`](docs/adr).
