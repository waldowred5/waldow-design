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
pnpm check      # every CI gate: lint, build, typecheck, test, size
```

## Quality gates

| Gate | Where | Blocks on |
| --- | --- | --- |
| `pnpm check`: lint and tokens-only check, build, typecheck, unit tests and axe on every story, bundle-size budget (`.size-limit.json`) | `ci.yml` | Any failure, axe violation or bundle over its limit |
| Token contrast | token build | A key text/background pair below WCAG AA |
| Visual regression | `chromatic.yml` (Chromatic "UI Tests" status) | Unreviewed visual changes |

Storybook is published to Chromatic; [`docs/chromatic.md`](docs/chromatic.md) covers when a real build runs. The workflow needs a `CHROMATIC_PROJECT_TOKEN` repo secret.

## Versioning and releases

Packages are versioned with [changesets](https://github.com/changesets/changesets) and kept **source-only**: they aren't published to npm yet. Apps in this repo install them as `workspace:*`.

1. In a PR that changes a package, run `pnpm changeset` and describe the change (patch, minor or major).
2. On merge to `main`, the Release workflow opens a **Version Packages** PR that bumps versions and writes each package's `CHANGELOG.md`.
3. Merging that PR creates git tags and GitHub releases (for example `@waldow-ds/ui@0.1.0`).

To publish to npm later: drop `"private": true` from the packages, set `access` in `.changeset/config.json`, add an `NPM_TOKEN` secret, and change the Release workflow's `publish` command to `pnpm changeset publish`.

## Decisions

Architecture decisions live in [`docs/adr`](docs/adr).
