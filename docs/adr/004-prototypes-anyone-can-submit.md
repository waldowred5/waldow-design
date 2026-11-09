# ADR 004: Prototypes anyone can submit

- **Status:** Proposed
- **Date:** 2026-11-08
- **Linear:** LAB-194

## Context

A good design system should let **any non-technical professional** submit an idea for design review and engineering. That includes a product manager, a customer success lead or a founder. What they submit should be a working prototype, not a mockup: it uses the real components and follows the system's principles. Then a designer reviews the actual UI that would ship, and engineering starts from code that already meets the contract.

Most of the machinery already exists, but only engineers can use it:

- The UI contract in `CLAUDE.md`: only `@waldow-design/ui` components, only semantic tokens, the [design principles](../../packages/ui/src/docs/principles/Overview.mdx), accessible by default.
- `pnpm prototype "<idea>"` scaffolds variants as stories under `prototypes/` ([prototypes contract](../../prototypes/README.md)).
- `pnpm lint` (`scripts/check-tokens.mjs`) rejects raw colours, arbitrary values and primitive tokens. The story tests run axe on every story. `apps/web` can't import from `prototypes/`.
- Chromatic publishes a hosted Storybook on PRs ([`docs/chromatic.md`](../chromatic.md)), and a reviewer can comment on it.

Today a non-engineer gets stuck at four points:

1. **Setup.** They need a terminal, Node, pnpm and a clone.
2. **Knowing the system.** An agent writing on their behalf learns the components by reading source. When it can't find something, it builds its own. The PM can't tell the difference.
3. **Composition.** PMs think in screens: a filtered table, a settings page, a review step. The system offers buttons and cards, so the agent fills the space between them with custom layout.
4. **Submitting.** Branches, PRs and Chromatic labels are unfamiliar to them.

## Decision

A prototype is something an **agent writes for a person**, inside a sandbox that only allows the design system. Its output is stories that the existing CI gates check and that designers review in Chromatic. The person describes the idea, checks it on their machine and presses submit. They never need to read the code.

### 1. The system is readable by agents

- **Component manifest** in `@waldow-design/catalog`, generated from the `@waldow-design/ui` types, JSDoc and stories. For each component it lists props, variants, slots, usage and accessibility notes, and links to example stories. Phase 3 (A2UI) needs this same catalog for the runtime agent, so it gets built once and serves both.
- **MCP server** over the catalog, tokens, principles and recipes (`list_components`, `get_component`, `get_recipe`, `get_principle`). It works with any agent client, not only one editor.
- **Pattern recipes** above the base components: page shells and compositions such as a filtered table, a detail drawer, a settings form and a multi-step flow. A recipe is a story plus a short note on when to use it. Recipes are the biggest lever. With them, the agent assembles screens from approved parts instead of laying them out from scratch.
- **Principles stay where they are** (Storybook: Principles/*) and are exposed through the manifest. They aren't copied into prompts.

### 2. Guardrails are checks, not trust

- The existing contract and `pnpm lint` apply unchanged.
- **Gap protocol.** When the system lacks something, the agent uses a labelled `Gap` placeholder component and records what it needed in the brief. It doesn't build its own. Every gap becomes a candidate ticket for the system, so missing pieces show up as product signal and don't turn into drift.
- **Compliance score** on each submission: how much of the rendered UI comes from system components and recipes, and how much is local layout and gaps. The reviewer reads it. It doesn't block.
- **Pre-review check.** An agent checks the submission against the principles before a person sees it and leaves a comment. A designer still decides. The check filters out the obvious misses.

### 3. Shape of a prototype

The existing folder layout gets two more parts:

```
prototypes/<slug>/
  brief.md               # problem, who it's for, success signal, open questions, gaps
  <slug>.stories.tsx     # variants (A:, B:, …) and states: populated, empty, loading, error
  fixtures.ts            # realistic data, including edge cases (long names, 0 rows, many rows)
```

- `brief.md` is required for a submission. It's what the reviewer reads first.
- Every variant has the states that matter. A prototype that only shows the happy path isn't ready for review.
- Fixtures come from the demo domains ([ADR 002](./002-demo-domains.md)) or, in a product, from its API schema. There's no backend and no network.
- Play functions can script a flow when the idea is a journey, not a single screen.

### 4. Flow

| Step | What the person does | What happens |
| --- | --- | --- |
| Start | Opens a link or runs `/new-prototype` | A zero-setup environment (devcontainer, Codespaces or a cloud agent session) starts with the repo installed |
| Describe | Explains the idea in plain words | The agent writes `brief.md` and asks about anything missing |
| Build | Reacts to what they see | The agent writes stories from the manifest and recipes, and Storybook opens filtered to the prototype |
| Self-check | Nothing | The agent runs lint, typecheck and axe, screenshots each story and fixes failures before showing the person |
| Submit | Presses submit | The agent opens a PR from a template (brief, screenshots, compliance score, gaps) and labels it `visual-test` and `design-review` |
| Review | Reads comments, asks the agent to address them | A designer reviews in Chromatic. The agent pushes fixes |
| Hand off | Nothing | An approved prototype is labelled `eng-ready`. Engineering builds it in `apps/web` or `packages/ui`, as the prototypes contract already says |

After handoff the prototype follows the existing keep-or-delete rule. Recipes that keep coming up in approved prototypes are candidates for `packages/ui`.

## Consequences

- One contract for every author: engineers, agents in the repo, the runtime agent (A2UI) and now non-engineers. Nothing gets a looser rule.
- The catalog moves forward from Phase 3. Building it earlier is extra work up front, but A2UI then starts on a tested manifest.
- Recipes become a maintained part of the system with their own stories, tests and principles review. More surface to keep up.
- Each submission costs Chromatic snapshots (`visual-test` label). With the free tier this limits how many submissions can be open at once.
- Designers review more, earlier and in the real medium. The brief, the pre-review check and the compliance score keep that manageable.
- Prototypes break when components change. They're still disposable: an approved one is built properly, and an abandoned one is deleted.
- Not in scope: real data, auth, backend calls and anything that ships to users from `prototypes/`.

## When to revisit

- The compliance score keeps coming back low because of local layout, not gaps. Then the recipes are the problem: add or reshape them before tightening the lint.
- Snapshot cost limits submissions. Move prototype review to a separate Storybook deploy (for example, a Vercel preview) and keep Chromatic for component baselines.
- A2UI needs a catalog shape that doesn't fit authoring. Split the generated manifest into a runtime view and an authoring view.
- People who don't write code don't use it. If the zero-setup environment is still too much friction, replace it with a hosted builder that commits stories on their behalf.
