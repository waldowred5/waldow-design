# @waldow-design/ui

Accessible React components for waldow.design. Built from [shadcn/ui](https://ui.shadcn.com) source on [Radix](https://www.radix-ui.com/primitives) primitives, styled with Tailwind CSS mapped to `@waldow-design/tokens` (see [ADR 001](../../docs/adr/001-shadcn-ui-component-foundation.md)).

## Use

```css
/* your app's CSS entry, processed by Tailwind v4 */
@import "@waldow-design/ui/styles.css";
```

```tsx
import { Button, Field, Input } from '@waldow-design/ui'

<Field label="Email" error={error}>
  <Input type="email" />
</Field>
<Button>Save</Button>
```

Theme with `data-theme="light" | "dark"` on `<html>`, or leave it unset to follow the OS.

## Components

| Component | Built on | Notes |
| --- | --- | --- |
| `Button` | `<button>` / Radix Slot | `primary`, `secondary`, `outline`, `ghost`, `danger`; `sm`, `md`, `lg`, `icon` |
| `Input` | `<input>` | Picks up id and error state from `Field` |
| `Field` | Radix Label | Label, description, error; wires `aria-describedby`, `aria-invalid` and `aria-required` |
| `Select` | Radix Select | Trigger, content, item, group, label, separator |
| `Checkbox` | Radix Checkbox | Checked, unchecked and indeterminate |
| `Card` | `<div>` | Header, title, description, content, footer |
| `Stack` | flexbox | Gap from the token space scale; `asChild` for semantic elements |
| `Badge` | `<span>` | `neutral`, `primary`, `success`, `warning`, `danger`, `info` |
| `Dialog` | Radix Dialog | Modal with focus trap, overlay and close button |
| `Table` | `<table>` | Scrollable, keyboard-focusable wrapper |

Each component's JSDoc has usage examples and accessibility notes, which surface in your editor and in Storybook.

## Rules

- **Tokens only.** Components use Tailwind utilities that map to semantic or component tokens (`bg-primary`, `h-input`, `rounded-card`). Tailwind's default palette, radii and shadows are removed, and `pnpm lint` runs a tokens-only check that rejects raw colours, raw arbitrary values (`p-[13px]`) and primitive token variables.
- **Typed props.** Every component extends the props of the element or Radix part it renders, so native attributes and `ref` pass through.
- **`data-slot`.** Every part sets `data-slot="<name>"` so consumers can target it in tests and styles without relying on class names.
