# Explorations

Throwaway prototypes, written as Storybook stories. Chromatic publishes them on every PR, so variants can be compared side by side and shared by link. Nothing here ships: once a direction is chosen, build it properly in `apps/web` (or as a component in `packages/ui`) and delete the exploration.

```bash
pnpm explore "invite member"   # scaffolds explorations/invite-member/invite-member.stories.tsx
pnpm storybook                 # see it under Explorations/
```

## The contract

Explorations follow the same rules as production UI and as the runtime agent (see `CLAUDE.md`):

- Import components only from `@waldow-ds/ui`. No new primitives, no raw HTML controls.
- Style only with token utilities. `pnpm lint` rejects raw colours, arbitrary values and primitive tokens here too.
- Every story must pass axe: the story tests in CI render explorations as well.
- One story per variant, named `A: …`, `B: …`, with a one-line JSDoc saying what the variant is betting on.
