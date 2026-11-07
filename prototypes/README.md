# Prototypes

Disposable feature variants, written as Storybook stories. Chromatic publishes them on every PR, so variants can be compared side by side and shared by link. Nothing here ships to the app: once a direction is chosen, build it properly in `apps/web` (or as a component in `packages/ui`).

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

Prototypes follow the same rules as production UI and as the runtime agent (see `CLAUDE.md`):

- Import components only from `@waldow-design/ui`. No new primitives, no raw HTML controls.
- Style only with token utilities. `pnpm lint` rejects raw colours, arbitrary values and primitive tokens here too.
- Every story must pass axe: the story tests in CI render prototypes as well.
- One story per variant, named `A: …`, `B: …`, with a one-line JSDoc saying what the variant is betting on.
