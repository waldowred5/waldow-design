/**
 * The theme knobs as data: the brand's defaults and the CSS variables that override them on a
 * `data-brand` subtree. Shared by the web app's Theme knobs page and Storybook's fixed examples.
 */
import * as t from './dist/tokens.js'
import { paletteTokens, type Role, roles, toOklch } from './palette.ts'

export const fonts = {
  Sans: t.FontFamilySans.join(', '),
  Serif: '"Iowan Old Style", "Palatino Linotype", Georgia, ui-serif, serif',
  Mono: t.FontFamilyMono.join(', '),
} as const
export type Font = keyof typeof fonts

export const radiusRange = { min: 0, max: 1.5, step: 0.125 } as const

export type Knobs = { seeds: Record<Role, string>; radius: number; font: Font }

/** The waldow.design brand's own seeds. */
export const brandSeeds: Record<Role, string> = {
  primary: t.ThemeColorPrimary,
  secondary: t.ThemeColorSecondary,
  highlight: t.ThemeColorHighlight,
}
/** One colour for all three, so changing each one shows exactly what it drives. */
export const sameSeeds: Record<Role, string> = Object.fromEntries(roles.map((role) => [role, t.ThemeColorPrimary])) as Record<Role, string>

export const defaultKnobs: Knobs = { seeds: sameSeeds, radius: Number.parseFloat(t.ThemeRadius), font: 'Sans' }

/** The CSS variables that override the knobs for a `data-brand` subtree (a React `style`, once cast). */
export function knobStyle({ seeds, radius, font }: Knobs): Record<string, string> {
  const vars: Record<string, string> = {
    '--ds-theme-radius': `${radius}rem`,
    '--ds-theme-font-body': fonts[font],
    '--ds-theme-font-display': fonts[font],
  }
  for (const [role, scale] of Object.entries(paletteTokens(seeds))) {
    for (const [step, colour] of Object.entries(scale)) vars[`--ds-color-${role}-${step}`] = toOklch(colour)
  }
  return vars
}
