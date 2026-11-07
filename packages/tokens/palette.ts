/**
 * Turns one seed colour into an 11-step scale (50–950).
 *
 * Steps are placed by OKLCH lightness, which tracks perceived lightness across hues, so a
 * step has roughly the same contrast whatever the seed's hue: step 600 carries white text
 * and step 400 carries near-black text for any seed. The seed sets hue and chroma; chroma
 * tapers towards the light and dark ends, and is clamped to what sRGB can show. The seed's own
 * lightness is ignored: the table below sets every step, so an achromatic seed (#000, #fff,
 * #808080) gives the same neutral grey scale.
 *
 * Used by the token build (brand seeds → color.primary/secondary/highlight.*) and by the
 * theme knobs (knobs.ts: the web app's Theme knobs page and Storybook's examples), so all produce identical scales.
 */
import { type Color, clampChroma, converter, formatHex, modeLrgb, modeOklab, modeOklch, modeRgb, type Oklch, useMode as registerMode } from 'culori/fn'

// The tree-shakeable build of culori: register only the colour spaces used here, so the web
// app's Theme knobs page ships a few kB of colour maths instead of every colour space.
// rgb parses hex and named colours; oklch, oklab and lrgb are what the conversions route through.
registerMode(modeRgb)
registerMode(modeLrgb)
registerMode(modeOklab)
registerMode(modeOklch)
const oklch = converter('oklch')

export const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const
export type Step = (typeof steps)[number]
export type Scale = Record<Step, Oklch>

/** The seed colours a brand sets; each becomes `color.<role>.50–950`. */
export const roles = ['primary', 'secondary', 'highlight'] as const
export type Role = (typeof roles)[number]

const lightness: Record<Step, number> = {
  50: 0.97, 100: 0.94, 200: 0.88, 300: 0.8, 400: 0.71, 500: 0.62,
  600: 0.54, 700: 0.47, 800: 0.4, 900: 0.33, 950: 0.25,
}

const chromaShare: Record<Step, number> = {
  50: 0.15, 100: 0.25, 200: 0.45, 300: 0.65, 400: 0.85, 500: 1,
  600: 1, 700: 0.92, 800: 0.82, 900: 0.7, 950: 0.55,
}

/**
 * An 11-step scale from any CSS colour string, as unrounded OKLCH colours. Format them with
 * `toOklch` (CSS) or `toHex` (where a tool needs hex); never round-trip through hex first, or
 * every step picks up 8-bit sRGB rounding (step 50 would land at 96.88% rather than 97%).
 */
export function scale(seed: string): Scale {
  const base = oklch(seed)
  if (!base) throw new Error(`Not a colour: ${seed}`)
  const chroma = base.c ?? 0
  const hue = base.h ?? 0
  return Object.fromEntries(
    steps.map((step) => {
      const colour = clampChroma({ mode: 'oklch', l: lightness[step], c: chroma * chromaShare[step], h: hue }, 'oklch') as Oklch
      return [step, colour]
    }),
  ) as Scale
}

/** Every role's scale from the brand's seeds: role → step → colour (`color.<role>.<step>`). */
export function paletteTokens(seeds: Record<Role, string>): Record<Role, Scale> {
  return Object.fromEntries(roles.map((role) => [role, scale(seeds[role])])) as Record<Role, Scale>
}

/** Six significant figures: far below a visible difference, without float noise like 100.00000000000003. */
const sig = (n: number) => Number(n.toPrecision(6))

/**
 * Any colour (a CSS string or a culori colour) as an `oklch()` string to six significant figures,
 * e.g. `oklch(54% 0.219804 276.673)` or `oklch(17.6746% 0.0114376 260.635 / 5.88235%)`.
 */
export function toOklch(colour: string | Color): string {
  const c = oklch(colour)
  if (!c) throw new Error(`Not a colour: ${String(colour)}`)
  const alpha = c.alpha !== undefined && c.alpha < 1 ? ` / ${sig(c.alpha * 100)}%` : ''
  return `oklch(${sig(c.l * 100)}% ${sig(c.c ?? 0)} ${sig(c.h ?? 0)}${alpha})`
}

/** Any colour as sRGB hex, for the few consumers that can't read `oklch()` (see the tokens README). */
export function toHex(colour: string | Color): string {
  const hex = formatHex(colour)
  if (!hex) throw new Error(`Not a colour: ${String(colour)}`)
  return hex
}
