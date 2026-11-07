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

A brand is three knobs in `tokens/brand/<name>.json`. Every other token derives from them, so a new brand never touches a component.

| Knob | Tokens | Derived |
| --- | --- | --- |
| Palette | `color.brand.*`, `color.neutral.*` | Every semantic colour, in light and dark mode |
| Radius | `theme.radius` | `radius.surface` (×1), `radius.control` (×0.75), `radius.inner` (×0.5) |
| Font | `theme.font.body`, `theme.font.display`, `theme.font.mono` | `font.body`, `font.display`, `font.code` |

Brand and mode are separate: any brand works in light or dark mode. Every block in `tokens.css` is also declared on `[data-brand]`, so overriding a knob on any element re-derives the tokens for that subtree. The Storybook page *Foundations / Theme knobs* lets you try it.

## Three tiers

| Tier | Source | Answers | Example | Who may use it |
| --- | --- | --- | --- | --- |
| **Primitive** | `tokens/brand/*.json` (palette), `tokens/primitive/*.json` | What values exist? | `color.brand.600` → `#4c46dc` | Semantic tokens only |
| **Semantic** | `tokens/semantic/{base,light,dark}.json` | What is this value *for*? | `color.action.primary.default` → `{color.brand.600}` | Components, app code, Tailwind theme |
| **Component** | `tokens/component/*.json` | What does this component decide? | `button.height.md` → `{size.9}` | That component |

Rules:

1. **Primitives are never used directly** outside the token files. They exist to be referenced.
2. **Semantic tokens carry intent and mode.** Only `light.json` and `dark.json` differ between modes; `base.json` holds mode-independent intent (radius and fonts derived from the knobs, elevation, motion).
3. **Component tokens reference semantic tokens** (or primitives for pure sizing), never raw values. Because they're emitted as `var()` references, they follow the active theme without being redeclared.

## Naming convention

Token paths are dot-separated, lowercase, kebab-case within a segment. CSS variables are the path joined with `-` and prefixed with `--ds-`.

| Tier | Shape | Examples |
| --- | --- | --- |
| Primitive colour | `color.<hue>.<step>` | `color.neutral.200`, `color.red.600` |
| Primitive scale | `<scale>.<step>` | `space.4`, `radius.md`, `font-size.sm`, `size.9` |
| Semantic colour | `color.<role>.<variant>[.<state>]` | `color.text.muted`, `color.action.primary.hover`, `color.status.danger.background` |
| Semantic other | `<concept>.<intent>` | `radius.control`, `elevation.overlay`, `motion.duration.fast` |
| Component | `<component>.<property>[.<variant>]` | `button.height.md`, `input.border`, `dialog.shadow` |

Semantic colour roles:

- `background`: page-level fills (`default`, `subtle`, `muted`, `inverse`)
- `surface`: things that sit on the page (`default` for cards, `raised` for dialogs, `overlay` for scrims)
- `text`: `default`, `muted`, `disabled`, `inverse`, `link`
- `border`: `default` (decorative), `strong` (input boundaries, meets 3:1), `focus`
- `action`: `primary`, `secondary`, `danger`, each with `default`, `hover`, `text`
- `status`: `success`, `warning`, `danger`, `info`, each with `background`, `text`, `border`

## Themes

`tokens.css` declares:

- `:root, [data-brand]`: knobs, primitives, mode-independent semantics, the light mode and component tokens
- `[data-theme="dark"]` (and `[data-brand]` inside it): dark overrides
- `@media (prefers-color-scheme: dark) :root:not([data-theme="light"])`: the same overrides, so the OS preference applies unless a theme is forced

Set `data-theme="light"` or `data-theme="dark"` on `<html>` to force a theme.

## Contrast gate

The build fails if any key text/background pair (for example `text.muted` on `surface.default`, or `action.primary.text` on `action.primary.default`) drops below WCAG AA in either theme: 4.5:1 for text, 3:1 for focus and input borders. The pairs are listed in `build.ts`.

## Adding a token

1. Add a primitive only if no existing step works.
2. Add or change the semantic token in **both** `light.json` and `dark.json`.
3. If the pair carries text, add it to the contrast list in `build.ts`.
4. Run `pnpm --filter @waldow-design/tokens build`.
