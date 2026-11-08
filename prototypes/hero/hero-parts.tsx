/**
 * Pieces every hero variant shares, so the variants differ only in what they're testing:
 * the title, the actions, the aurora backdrop, and the seed maths.
 */
import { Button } from '@waldow-design/ui'
import { defaultKnobs, type Knobs, knobStyle } from '@waldow-design/tokens/knobs'
import { type Role, toHex } from '@waldow-design/tokens/palette'
import { type CSSProperties, type ReactNode, useEffect, useState } from 'react'
import './hero.css'

/** The prototype's display face. A candidate for the brand's `theme.font.display` knob. */
export const displayFont = '"Bricolage Grotesque Variable", ui-sans-serif, system-ui, sans-serif'

/** A seed colour from OKLCH parts, so brands are written in the space the palette is built in. */
export const seed = (l: number, c: number, h: number) => toHex({ mode: 'oklch', l, c, h })

/**
 * Three seeds from one hue. The offsets are the brand's own (indigo → teal → amber), so the
 * dial's starting hue reproduces the waldow.design colours and every other hue keeps their harmony.
 */
export const BRAND_HUE = 277
export function seedsFromHue(hue: number): Record<Role, string> {
  const at = (offset: number) => (((hue + offset) % 360) + 360) % 360
  return {
    primary: seed(0.52, 0.22, at(0)),
    secondary: seed(0.6, 0.12, at(-92)),
    highlight: seed(0.7, 0.17, at(-207)),
  }
}

/** The CSS variables for a knob set, plus the prototype's display face. */
export function brandStyle(knobs: Knobs, display = displayFont): CSSProperties {
  return { ...knobStyle(knobs), '--ds-theme-font-display': display } as CSSProperties
}

export const brandKnobs = (hue: number): Knobs => ({ ...defaultKnobs, seeds: seedsFromHue(hue) })

/** True when the reader asked for less motion (false where matchMedia doesn't exist, as in tests). */
export function usePrefersReducedMotion() {
  const query = '(prefers-reduced-motion: reduce)'
  const [reduced, setReduced] = useState(() => globalThis.matchMedia?.(query).matches ?? false)
  useEffect(() => {
    const list = globalThis.matchMedia?.(query)
    if (!list) return
    const onChange = () => setReduced(list.matches)
    list.addEventListener('change', onChange)
    return () => list.removeEventListener('change', onChange)
  }, [])
  return reduced
}

export function HeroTitle({ align = 'start' }: { align?: 'start' | 'center' }) {
  return (
    <div className={align === 'center' ? '@container flex w-full flex-col items-center gap-5 text-center' : '@container flex w-full flex-col gap-5'}>
      <h1 className="hero-display font-display font-bold text-foreground">
        Waldow
        <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">.Design</span>
      </h1>
      <p className="max-w-xl text-lg text-muted-foreground sm:text-xl">An exploration into design systems in the age of agents</p>
    </div>
  )
}

export function HeroActions() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="lg" asChild>
        <a href="/tools/theme-knobs">Try the theme knobs</a>
      </Button>
      <Button size="lg" asChild>
        <a href="/getting-started/installation">Get started</a>
      </Button>
    </div>
  )
}

/** Seed-colour aurora, a fading grid and grain. Decorative, so hidden from assistive technology. */
export function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="hero-grid absolute inset-0" />
      <div className="absolute inset-0">
        <div className="hero-blob absolute -top-1/4 -left-1/6 size-2/3 rounded-pill bg-primary/40 blur-3xl" />
        <div className="hero-blob absolute top-1/4 -right-1/6 size-1/2 rounded-pill bg-secondary/30 blur-3xl" />
        <div className="hero-blob absolute -bottom-1/3 left-1/4 size-1/2 rounded-pill bg-highlight/25 blur-3xl" />
      </div>
      <div className="hero-grain absolute inset-0" />
    </div>
  )
}

/** The hero's frame: a full-bleed, branded section the backdrop sits behind. */
export function HeroFrame({ style, theme, children }: { style: CSSProperties; theme?: 'dark'; children: ReactNode }) {
  return (
    <section
      aria-label="Waldow.Design"
      data-brand="hero"
      data-theme={theme}
      style={style}
      className="relative isolate overflow-hidden bg-background px-6 py-16 sm:px-12 sm:py-24"
    >
      <Backdrop />
      <div className="relative mx-auto max-w-6xl">{children}</div>
    </section>
  )
}

/** A token name pinned to the element it styles, like a design tool's inspect panel. */
export function TokenTag({ children }: { children: ReactNode }) {
  return (
    <span className="w-fit rounded-inner border border-dashed border-border-strong bg-surface/80 px-1.5 py-0.5 font-mono text-xs text-muted-foreground backdrop-blur-sm">
      {children}
    </span>
  )
}
