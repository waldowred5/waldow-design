# ADR 003: Two token tiers

- **Status:** Accepted
- **Date:** 2026-11-07
- **Linear:** LAB-182

## Context

Tokens were built in three tiers: primitive → semantic → component. The component tier (`src/component/components.json`) held tokens like `card.radius`, `card.background`, `dialog.shadow` and `button.height.md`.

Almost all of them were 1:1 aliases. `card.radius` was `{radius.surface}`, `card.background` was `{color.surface.default}`, `dialog.shadow` was `{elevation.overlay}`. They reached components only through a second set of Tailwind utilities (`rounded-card`, `bg-card`, `shadow-dialog`) that duplicated the semantic ones. The rest were sizing decisions (button heights, card padding) that pointed straight at primitives.

The extra tier cost two names for every value, a longer `@theme` block and `cn()` list, and a question on every change: which tier does this go in?

Component tokens earn their keep when a brand overrides **individual components**: "in this brand, cards are square but buttons are round". Material 3 is the counter-example that does need them: its reference → system → component tiers (`ref` → `sys` → `comp`) exist because Material products customise components one by one.

Our brands don't. [ADR 002](./002-demo-domains.md) routes all theming through a few brand knobs (seed colours, neutrals, `theme.radius`, fonts). A brand never sets `card.radius`; it sets `theme.radius`, and every surface follows.

## Decision

Two tiers: **primitive** and **semantic**. Components use semantic tokens directly.

- Colour, radius and shadow aliases are gone. Components use the semantic utilities: `bg-surface`, `rounded-surface`, `shadow-raised` for cards; `bg-surface-raised`, `shadow-overlay` for dialogs; `rounded-control`, `border-border-strong` for inputs.
- Sizing and spacing decisions become semantic tokens in `src/semantic/base.json`, named for the **shape they serve** rather than the component, using the same names as the radii:

| Token | Utility | Used by |
| --- | --- | --- |
| `size.control.{sm,md,lg}` | `h-control-md` | Buttons, inputs, selects |
| `space.control-x.{sm,md,lg}` | `px-control-x-md` | Buttons, inputs, selects |
| `size.control-inner` | `size-control-inner` | Checkboxes |
| `space.pill-x` | `px-pill-x` | Badges |
| `space.surface-inset` | `p-surface-inset` | Cards, dialogs |
| `space.cell-x`, `space.cell-y` | `px-cell-x`, `py-cell-y` | Table cells |
| `size.dialog` | `max-w-dialog` | Dialogs |

Visual output is unchanged: every new token resolves to the value the component token held.

## Consequences

- One name per value. A new component reuses a shape (`control`, `surface`, `pill`) rather than minting tokens.
- Inputs and md buttons now share `size.control.md` by construction, not by coincidence.
- A brand can no longer override one component in isolation through tokens. That is intended: it would have to go through a knob or a semantic token, which keeps brands coherent.

## When to revisit

- A brand needs a component to diverge from its shape family (for example, square cards with round buttons that the radius knob can't express). Add a component token for that one property then, rather than restoring the whole tier.
- We adopt a token format or tool that expects a component tier (for example, syncing with a Figma library built on Material 3's structure).
