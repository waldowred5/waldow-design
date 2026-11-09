/**
 * How the theme knobs are saved. The knobs themselves (defaults, fonts, their CSS variables)
 * are in @waldow-design/tokens/knobs, shared with Storybook.
 *
 * State lives in the query (`/tools/theme-knobs?primary=4c46dc&radius=0.75&font=serif`) so a
 * look can be shared as a link, and in localStorage so coming back to the page without a query
 * restores the last look. The URL wins when both exist.
 */
import { defaultKnobs, type Font, fonts, type Knobs, radiusRange } from '@waldow-design/tokens/knobs'
import { roles } from '@waldow-design/tokens/palette'

// Serialisation. Colours drop the leading hash and fonts are lower case, so links stay readable.

const hex = /^[0-9a-f]{6}$/i

export function toParams({ seeds, radius, font }: Knobs): URLSearchParams {
  const params = new URLSearchParams()
  for (const role of roles) params.set(role, seeds[role].replace(/^#/, '').toLowerCase())
  params.set('radius', String(radius))
  params.set('font', font.toLowerCase())
  return params
}

/**
 * Read whatever valid knobs the params carry, on top of `base` (so a link that sets only the font
 * keeps the other knobs); returns undefined when they carry none.
 */
export function fromParams(params: URLSearchParams, base: Knobs = defaultKnobs): Knobs | undefined {
  const knobs: Knobs = { ...base, seeds: { ...base.seeds } }
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
