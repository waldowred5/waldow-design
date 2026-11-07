/**
 * The theme knobs as plain data: defaults, their CSS variables, and how they are saved.
 *
 * State lives in the hash query (`#/theme-knobs?primary=4c46dc&radius=0.75&font=serif`) so a
 * look can be shared as a link, and in localStorage so coming back to the page without a query
 * restores the last look. The URL wins when both exist.
 */
import * as t from '@waldow-design/tokens'
import { scale, steps, toOklch } from '@waldow-design/tokens/palette'
import type { CSSProperties } from 'react'

export type Role = 'primary' | 'secondary' | 'highlight'
export const roles: Role[] = ['primary', 'secondary', 'highlight']

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
/** Start with one colour for all three, so changing each one shows exactly what it drives. */
export const sameSeeds: Record<Role, string> = {
  primary: t.ThemeColorPrimary,
  secondary: t.ThemeColorPrimary,
  highlight: t.ThemeColorPrimary,
}

export const defaultKnobs: Knobs = { seeds: sameSeeds, radius: Number.parseFloat(t.ThemeRadius), font: 'Sans' }

/** The CSS variables that override the knobs for a `data-brand` subtree. */
export function knobStyle({ seeds, radius, font }: Knobs): CSSProperties {
  const vars: Record<string, string> = { '--ds-theme-radius': `${radius}rem` }
  for (const role of roles) {
    const generated = scale(seeds[role])
    for (const step of steps) vars[`--ds-color-${role}-${step}`] = toOklch(generated[step])
  }
  vars['--ds-theme-font-body'] = fonts[font]
  vars['--ds-theme-font-display'] = fonts[font]
  return vars as CSSProperties
}

// Serialisation. Colours drop the leading hash and fonts are lower case, so links stay readable.

const hex = /^[0-9a-f]{6}$/i

export function toParams({ seeds, radius, font }: Knobs): URLSearchParams {
  const params = new URLSearchParams()
  for (const role of roles) params.set(role, seeds[role].replace(/^#/, '').toLowerCase())
  params.set('radius', String(radius))
  params.set('font', font.toLowerCase())
  return params
}

/** Read whatever valid knobs the params carry; returns undefined when they carry none. */
export function fromParams(params: URLSearchParams): Knobs | undefined {
  const knobs: Knobs = { ...defaultKnobs, seeds: { ...defaultKnobs.seeds } }
  let found = false
  for (const role of roles) {
    const value = params.get(role)
    if (value && hex.test(value)) {
      knobs.seeds[role] = `#${value.toLowerCase()}`
      found = true
    }
  }
  const radius = Number.parseFloat(params.get('radius') ?? '')
  if (Number.isFinite(radius)) {
    const { min, max, step } = radiusRange
    knobs.radius = Math.min(max, Math.max(min, Math.round(radius / step) * step))
    found = true
  }
  const font = (Object.keys(fonts) as Font[]).find((name) => name.toLowerCase() === params.get('font')?.toLowerCase())
  if (font) {
    knobs.font = font
    found = true
  }
  return found ? knobs : undefined
}

export const KNOBS_STORAGE_KEY = 'waldow-design:theme-knobs'

export function loadStoredKnobs(): Knobs | undefined {
  try {
    const stored = localStorage.getItem(KNOBS_STORAGE_KEY)
    return stored ? fromParams(new URLSearchParams(stored)) : undefined
  } catch {
    return undefined
  }
}

export function storeKnobs(knobs: Knobs) {
  try {
    localStorage.setItem(KNOBS_STORAGE_KEY, toParams(knobs).toString())
  } catch {
    // Storage can be unavailable; the URL still carries the state.
  }
}
