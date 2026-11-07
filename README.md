# waldow.design

A small but real design system: three-tier design tokens, accessible React components, Storybook and Chromatic visual regression from the first commit.

## Workspace

| Path | Package | What it is |
| --- | --- | --- |
| `packages/tokens` | `@waldow-design/tokens` | Design tokens, built into CSS variables |
| `packages/ui` | `@waldow-design/ui` | React components (shadcn/ui foundation, see [ADR 001](docs/adr/001-shadcn-ui-component-foundation.md)) |
| `packages/catalog` | `@waldow-design/catalog` | Machine-readable component catalog (Phase 2) |
| `apps/web` | `@waldow-design/web` | The design system app |
| `prototypes` | `@waldow-design/prototypes` | Prototype stories, published by Chromatic; disposable, or kept as showcase examples ([README](prototypes/README.md)) |

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

## Versioning and releases

Packages are versioned with [changesets](https://github.com/changesets/changesets) and kept **source-only**: they aren't published to npm yet. Apps in this repo install them as `workspace:*`.

1. In a PR that changes a package, run `pnpm changeset` and describe the change (patch, minor or major).
2. On merge to `main`, the Release workflow opens a **Version Packages** PR that bumps versions and writes each package's `CHANGELOG.md`.
3. Merging that PR creates git tags and GitHub releases (for example `@waldow-design/ui@0.1.0`).

To publish to npm later: drop `"private": true` from the packages, set `access` in `.changeset/config.json`, add an `NPM_TOKEN` secret, and change the Release workflow's `publish` command to `pnpm changeset publish`.

## Working with Claude

`CLAUDE.md` is the contract for generated UI: design system components and semantic tokens only, the design principles, and accessible by default. `pnpm prototype "<idea>"` scaffolds variant stories in `prototypes/`.

## Decisions

Architecture decisions live in [`docs/adr`](docs/adr).
