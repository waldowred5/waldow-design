# Explorations

Throwaway prototypes, written as Storybook stories. Chromatic publishes them on PRs into `main` or labelled `visual-test` (see [`docs/chromatic.md`](../docs/chromatic.md)), so variants can be compared side by side and shared by link. Nothing here ships: once a direction is chosen, build it properly in `apps/web` (or as a component in `packages/ui`) and delete the exploration.

This file is the explorations contract. `CLAUDE.md` and the root README point here.

```bash
pnpm explore "invite member"   # scaffolds explorations/invite-member/invite-member.stories.tsx
pnpm storybook                 # see it under Explorations/
```

## The contract

Explorations follow the same UI contract as production UI and the runtime agent (see `CLAUDE.md`):

- Import components only from `@waldow-design/ui`. No new primitives, no raw HTML controls.
- Style only with token utilities. `pnpm lint` (`scripts/check-tokens.mjs`) rejects raw colours, arbitrary values and primitive tokens here too.
- Lint, typecheck and axe all run on explorations: the story tests in CI render every exploration story.
- One story per variant, named `A: …`, `B: …`, with a one-line JSDoc saying what the variant is betting on.
- Pull shared pieces (fields, copy) into small local components so the variants differ only in what they're testing.

See `invite-member/` for the shape.
