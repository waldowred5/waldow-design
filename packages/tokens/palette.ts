/**
 * Turns one seed colour into an 11-step scale (50–950).
 *
 * Steps are placed by OKLCH lightness, which tracks perceived lightness across hues, so a
 * step has roughly the same contrast whatever the seed's hue: step 600 carries white text
 * and step 400 carries near-black text for any seed. The seed sets hue and chroma; chroma
 * tapers towards the light and dark ends, and is clamped to what sRGB can show.
 *
 * Used by the token build (brand seeds → color.primary/secondary/highlight.*) and by the
 * Theme knobs demo, so both produce identical scales.
 */
import { clampChroma, formatHex, oklch } from 'culori'

export const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const
export type Step = (typeof steps)[number]
export type Scale = Record<Step, string>

const lightness: Record<Step, number> = {
  50: 0.97, 100: 0.935, 200: 0.88, 300: 0.8, 400: 0.71, 500: 0.62,
  600: 0.54, 700: 0.47, 800: 0.4, 900: 0.33, 950: 0.25,
}

const chromaShare: Record<Step, number> = {
  50: 0.15, 100: 0.25, 200: 0.45, 300: 0.65, 400: 0.85, 500: 1,
  600: 1, 700: 0.92, 800: 0.82, 900: 0.7, 950: 0.55,
}

/** An 11-step hex scale from any CSS colour string. */
export function scale(seed: string): Scale {
  const base = oklch(seed)
  if (!base) throw new Error(`Not a colour: ${seed}`)
  const chroma = base.c ?? 0
  const hue = base.h ?? 0
  return Object.fromEntries(
    steps.map((step) => {
      const colour = clampChroma({ mode: 'oklch', l: lightness[step], c: chroma * chromaShare[step], h: hue }, 'oklch')
      return [step, formatHex(colour)]
    }),
  ) as Scale
}

/**
 * Any CSS colour as an `oklch()` string at full precision, e.g. `oklch(50.12% 0.2201 276.73)`
 * or `oklch(17.7% 0.011 260.6 / 6%)`. Nothing is rounded, so converting back to sRGB lands on
 * the same colour the generator produced.
 */
export function toOklch(colour: string): string {
  const c = oklch(colour)
  if (!c) throw new Error(`Not a colour: ${colour}`)
  const alpha = c.alpha !== undefined && c.alpha < 1 ? ` / ${c.alpha * 100}%` : ''
  return `oklch(${c.l * 100}% ${c.c ?? 0} ${c.h ?? 0}${alpha})`
}
