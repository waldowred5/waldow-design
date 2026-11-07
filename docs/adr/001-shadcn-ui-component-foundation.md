# ADR 001: shadcn/ui as the component foundation

- **Status:** Accepted
- **Date:** 2026-11-06
- **Linear:** LAB-106

## Context

Phase 1 needs a small but real design system: ten accessible components, a token pipeline with light and dark themes, Storybook and visual regression from the first commit. We need a component foundation that:

- gives us accessible behaviour (focus management, keyboard support, ARIA) without writing it from scratch,
- lets us own and change the markup and styles, because the system is the product,
- can be styled entirely from our design tokens, with no hard-coded values,
- gets us to a working set of components quickly.

Options considered:

| Option | Ownership | Accessibility | Styling from tokens | Speed |
| --- | --- | --- | --- | --- |
| **shadcn/ui** (Radix + Tailwind, source copied in) | Full: code lives in our repo | Radix primitives | Tailwind theme mapped to tokens | Fast |
| Radix primitives only | Full | Radix primitives | Any | Slower: every style written by hand |
| MUI / Chakra / Mantine | Low: styling through library APIs | Good | Through the library's theme object | Fast, but the library's look leaks through |
| React Aria Components | Full | Excellent | Any | Medium |

## Decision

Use **shadcn/ui** as the starting point for components.

shadcn/ui is not a dependency: its CLI (or its published source) copies component code into our repo. Components are built on [Radix](https://www.radix-ui.com/primitives) primitives and styled with Tailwind CSS. Once copied, the code is ours to edit.

## Why it fits

- **Owned code.** Components live in `packages/ui`. We can rename props, change markup and add variants without forking a library or waiting on upstream.
- **Accessible primitives.** Radix handles the hard parts (Dialog focus trapping, Select keyboard navigation, Checkbox states), and is tested across assistive technology.
- **Fast start.** The ten Phase 1 components exist upstream in a usable form, so effort goes into tokens, docs and quality gates rather than re-implementing behaviour.
- **Token-friendly styling.** Tailwind v4 reads its theme from CSS variables, which is exactly what our token pipeline outputs.

## How tokens map into the Tailwind theme

Tokens are built in two tiers (primitive → semantic; see [ADR 003](./003-two-token-tiers.md)) into CSS variables. The Tailwind theme only references **semantic** variables, never primitives or raw values:

```css
@import "tailwindcss";
@import "@waldow-design/tokens/tokens.css";

@theme inline {
  /* Drop Tailwind's default palette so only token colours exist. */
  --color-*: initial;

  --color-background: var(--ds-color-background-default);
  --color-foreground: var(--ds-color-text-default);
  --color-primary: var(--ds-color-action-primary-default);
  --color-primary-foreground: var(--ds-color-action-primary-text);
  /* … */
  --radius-md: var(--ds-radius-control);
}
```

Consequences:

- `bg-primary` resolves to a semantic token, so switching `data-theme="dark"` re-themes every component without touching component code.
- Because the default palette is cleared, `bg-blue-500` does not exist. Raw colours cannot sneak into components.
- Arbitrary values (`bg-[#3b82f6]`, `p-[13px]`) are blocked by a lint check rather than by convention alone.

## Consequences

- We take on maintenance of copied code. Upstream fixes are not automatic; we pull them in deliberately.
- Tailwind becomes a build requirement for consumers of `@waldow-design/ui` (they import our stylesheet).
- Radix is a runtime dependency (through the `radix-ui` package).

## When to revisit

Revisit this decision if any of these become true:

- We need to support a non-React renderer (for example, a native or web-components target for A2UI output).
- Tailwind's runtime or build cost shows up as a bundle-size budget failure we cannot fix within Tailwind.
- Radix stops being maintained or falls behind on accessibility issues we need fixed.
- More than about a third of a component's code diverges from upstream, at which point "starting from shadcn" stops buying anything and the component is simply ours.
