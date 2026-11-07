# @waldow-design/tokens

Design tokens for waldow.design, written in the [W3C Design Tokens (DTCG)](https://www.designtokens.org/tr/drafts/format/) format and built with [Style Dictionary](https://styledictionary.com/) into CSS variables, a typed JS module and nested JSON.

```bash
pnpm --filter @waldow-design/tokens build   # also runs on install (prepare)
```

```css
@import "@waldow-design/tokens/tokens.css";

.thing { color: var(--ds-color-text-default); }
```

## Brand knobs

A brand is a handful of knobs in `src/brand/<name>.json`. Every other token derives from them, so a new brand never touches a component.

| Knob | Tokens | Derived |
| --- | --- | --- |
| Primary, secondary, highlight | `theme.color.{primary,secondary,highlight}` seeds → `color.{primary,secondary,highlight}.50–950` | Primary: primary actions, focus, links (`color.action.primary.*`). Secondary: secondary actions and badges (`color.action.secondary.*`). Highlight: badges, markers, progress, chart emphasis (`color.emphasis.highlight.*`) |
| Neutrals | `color.neutral.*` | Backgrounds, surfaces, text, borders |
| Radius | `theme.radius` | `radius.surface` (×1), `radius.control` (×0.75), `radius.inner` (×0.5) |
| Font | `theme.font.body`, `theme.font.display`, `theme.font.mono` | `font.body`, `font.display`, `font.code` |

Each seed colour becomes an 11-step scale in `palette.ts`. Steps are placed by OKLCH lightness, so a step has about the same contrast whatever the hue: 600 carries white text and 400 carries near-black text. The build and the web app's Theme knobs playground (`apps/web`, `#/theme-knobs`) use the same generator.

Brand and mode are separate: any brand works in light or dark mode. Every block in `tokens.css` is also declared on `[data-brand]`, so overriding a knob on any element re-derives the tokens for that subtree. The Theme knobs page in the web app lets you try it live; Storybook's *Foundations / Theme knobs* explains the knobs with fixed examples.

## Two tiers

| Tier | Source | Answers | Example | Who may use it |
| --- | --- | --- | --- | --- |
| **Primitive** | `src/brand/*.json` (seeds, neutrals), generated scales, `src/primitive/*.json` | What values exist? | `color.primary.600`, `size.9` | Semantic tokens only |
| **Semantic** | `src/semantic/{base,light,dark}.json` | What is this value *for*? | `color.action.primary.default` → `{color.primary.600}`, `size.control.md` → `{size.9}` | Components, app code, Tailwind theme |

There is no component tier ([ADR 003](../../docs/adr/003-two-token-tiers.md)). Component tokens only earn their keep when a brand overrides individual components; ours route theming through the brand knobs instead, so components use semantic tokens directly.

Rules:

1. **Primitives are never used directly** outside the token files. They exist to be referenced.
2. **Semantic tokens carry intent and mode.** Only `light.json` and `dark.json` differ between modes; `base.json` holds mode-independent intent (radius and fonts derived from the knobs, control sizes and insets, motion). Elevation is per mode: dark mode needs stronger shadows, plus a faint light edge, for depth to read on dark surfaces.
3. **Name sizes and insets for the shape, not the component.** `space.surface-inset` serves cards and dialogs; there is no `card.padding`. Reuse a shape before adding a token, and never add a per-component token.
4. **Semantic tokens reference primitives or knobs**, never raw values (constants such as `radius.pill` excepted). Because they're emitted as `var()` references, they follow the active brand and theme without being redeclared.

## Naming convention

Token paths are dot-separated, lowercase, kebab-case within a segment. CSS variables are the path joined with `-` and prefixed with `--ds-`.

| Tier | Shape | Examples |
| --- | --- | --- |
| Primitive colour | `color.<hue>.<step>` | `color.neutral.200`, `color.red.600` |
| Primitive scale | `<scale>.<step>` | `space.4`, `font-size.sm`, `size.9` |
| Semantic colour | `color.<role>.<variant>[.<state>]` | `color.text.muted`, `color.action.primary.hover`, `color.status.danger.background` |
| Semantic other | `<concept>.<intent>` | `radius.control`, `elevation.overlay`, `motion.duration.fast` |
| Semantic size / space | `size.<shape>[.<size>]`, `space.<shape>-<axis>[.<size>]`, `space.<shape>-inset` | `size.control.md`, `space.control-x.sm`, `space.surface-inset` |

Sizes and insets use the same shape names as the radii, so a shape's tokens sit together:

| Shape | Radius | Size | Space | Used by |
| --- | --- | --- | --- | --- |
| `control` | `radius.control` | `size.control.{sm,md,lg}` | `space.control-x.{sm,md,lg}` | Buttons, inputs, selects (inputs and selects use height md, padding sm) |
| `control-inner` / `inner` | `radius.inner` | `size.control-inner` | | Checkboxes |
| `pill` | `radius.pill` | | `space.pill-x` | Badges |
| `surface` | `radius.surface` | `size.dialog` (max width) | `space.surface-inset` | Cards, dialogs |
| `cell` | | | `space.cell-x`, `space.cell-y` | Table cells |

In Tailwind these are `h-control-md`, `px-control-x-md`, `size-control-inner`, `px-pill-x`, `p-surface-inset`, `px-cell-x`, `py-cell-y` and `max-w-dialog` (see `packages/ui/src/styles.css`).

Semantic colour roles:

- `background`: page-level fills (`default`, `subtle`, `muted`, `inverse`)
- `surface`: things that sit on the page (`default` for cards, `raised` for dialogs, `overlay` for scrims)
- `text`: `default`, `muted`, `disabled`, `inverse`, `link`
- `border`: `default` (decorative), `strong` (input boundaries, meets 3:1), `focus`
- `action`: `primary`, `secondary`, `danger`, each with `default`, `hover`, `text`
- `status`: `success`, `warning`, `danger`, `info`, each with `background`, `text`, `border`

## Themes

`tokens.css` declares:

- `:root, [data-brand]`: knobs, primitives, mode-independent semantics and the light mode
- `[data-theme="dark"]` (and `[data-brand]` inside it): dark overrides
- `@media (prefers-color-scheme: dark) :root:not([data-theme="light"])`: the same overrides, so the OS preference applies unless a theme is forced

Set `data-theme="light"` or `data-theme="dark"` on `<html>` to force a theme.

## Why OKLCH (and where hex remains)

`tokens.css`, and so everything the site renders, writes colours as `oklch()`, to six significant figures (far below a visible difference, without float noise).

- **Perceptually uniform lightness.** OKLCH's L tracks how light a colour looks, whatever its hue. A palette step therefore has consistent contrast across hues: 600 carries white text whether the seed is violet, green or orange. That is what makes the colour knobs and the generated scales safe: a brand can pick any seed and the contrast gate still holds.
- **Modern CSS colour.** `oklch()` is supported in every current browser, can describe colours outside sRGB, and interpolates predictably.
- **Same space as Tailwind.** Tailwind v4 defines its own palette in OKLCH, so values sit naturally beside it.

`tokens.js` and `tokens.json` keep **hex**, only for compatibility with tools that can't parse `oklch()`. The one that matters today is Storybook's manager theming (`create()` from `storybook/theming`, used in `packages/ui/.storybook/themes.ts`). Hex is the exception, not the source of truth: don't add new hex consumers, and prefer the CSS variables wherever CSS is available.

## Contrast gate

The build fails if any key text/background pair (for example `text.muted` on `surface.default`, or `action.primary.text` on `action.primary.default`) drops below WCAG AA in either theme: 4.5:1 for text, 3:1 for focus and input borders. The pairs are listed in `build.ts`.

## Adding a token

1. Add a primitive only if no existing step works.
2. Add or change the semantic token in **both** `light.json` and `dark.json`.
3. If the pair carries text, add it to the contrast list in `build.ts`.
4. Run `pnpm --filter @waldow-design/tokens build`.
