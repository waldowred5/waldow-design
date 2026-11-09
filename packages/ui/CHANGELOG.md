# @waldow-design/ui

## 0.1.0

### Minor Changes

- [#22](https://github.com/waldowred5/waldow-design/pull/22) [`8d35a1d`](https://github.com/waldowred5/waldow-design/commit/8d35a1da177e763c3a374345978d60ed7c38d30a) Thanks [@waldowred5](https://github.com/waldowred5)! - Add `Drawer` and `ModeToggle` components, and the docs-site patterns `DocsLayout`, `Navbar`, `Sidebar`, `Outline`, `Search`, `Hero` and `Prose` (Storybook: *Patterns*).

- [#22](https://github.com/waldowred5/waldow-design/pull/22) [`3c7a8d7`](https://github.com/waldowred5/waldow-design/commit/3c7a8d76d602ddf27d698df3d7b55823ac3475e6) Thanks [@waldowred5](https://github.com/waldowred5)! - Add landing-page patterns: `FeatureSection`, `FeatureGrid` and `FeatureGridItem`, `StatGroup` and `Stat`, and `CallToAction`; `NavbarNav` and `NavbarLink` for a navbar's top-level links, and a `contained` Navbar; and a `variant="landing"` Hero. `DocsLayout`'s sidebar is narrower (14rem at `md`, 16rem from `lg`) and stays beside the page from `md`, with the drawer only at phone width.

- [#7](https://github.com/waldowred5/waldow-design/pull/7) [`5547d8b`](https://github.com/waldowred5/waldow-design/commit/5547d8be7600d76cbad6bc01cc5fa84e64db1918) Thanks [@waldowred5](https://github.com/waldowred5)! - Phase 1 foundations. `@waldow-design/tokens` adds two-tier (primitive, semantic) DTCG tokens with light and dark themes and a WCAG AA contrast gate. `@waldow-design/ui` adds Button, Input, Field, Select, Checkbox, Card, Stack, Badge, Dialog and Table on shadcn/ui and Radix, styled only with tokens. `@waldow-design/catalog` is reserved for the Phase 3 component catalog.

- [#22](https://github.com/waldowred5/waldow-design/pull/22) [`0709973`](https://github.com/waldowred5/waldow-design/commit/0709973d09a5393172ab3fc10eef62cd6268d4dc) Thanks [@waldowred5](https://github.com/waldowred5)! - Rename `ModeToggle` to `ThemeToggle` (`ThemeToggleProps`, type `Theme`, props `theme` and `onThemeChange`; Storybook: *Components/ThemeToggle*). Add `defaultQuery` to `Search`, for visual tests.

### Patch Changes

- Updated dependencies [[`5547d8b`](https://github.com/waldowred5/waldow-design/commit/5547d8be7600d76cbad6bc01cc5fa84e64db1918)]:
  - @waldow-design/tokens@0.1.0
