# Prototypes

Disposable feature variants, written as Storybook stories. Chromatic publishes them on PRs into `main` or labelled `visual-test` (see [`docs/chromatic.md`](../docs/chromatic.md)), so variants can be compared side by side and shared by link. Nothing here ships to the app: once a direction is chosen, build it properly in `apps/web` (or as a component in `packages/ui`).

This file is the prototypes contract. `CLAUDE.md` and the root README point here.

```bash
pnpm prototype "invite member"   # scaffolds prototypes/invite-member/invite-member.stories.tsx
pnpm storybook                   # see it under Prototypes/
```

## Keep or delete

Prototypes are disposable by default: delete one once its direction is built. Keep it when it's a good example of the workflow (variants side by side, then a decision) for the showcase:

- add `tags: ['showcase']` to the story meta
- say in the top JSDoc which variant won and why

Kept prototypes stay under the same contract and CI checks as everything else.

## The contract

Prototypes follow the same UI contract as production UI and the runtime agent (see `CLAUDE.md`):

- Import components only from `@waldow-design/ui`. No new primitives, no raw HTML controls.
- Style only with token utilities. `pnpm lint` (`scripts/check-tokens.mjs`) rejects raw colours, arbitrary values and primitive tokens here too.
- Lint, typecheck and axe all run on prototypes: the story tests in CI render every prototype story.
- One story per variant, named `A: …`, `B: …`, with a one-line JSDoc saying what the variant is betting on.
- Pull shared pieces (fields, copy) into small local components so the variants differ only in what they're testing.

See `invite-member/` for the shape (a showcase example).
