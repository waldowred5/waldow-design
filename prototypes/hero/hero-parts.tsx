/**
 * Pieces every hero variant shares, so the variants differ only in what they're testing:
 * the frame (backdrop and mode toggle), the title, the actions, and the seed maths.
 */
import { Button, type Mode, ModeToggle } from '@waldow-design/ui'
import { defaultKnobs, type Knobs, knobStyle } from '@waldow-design/tokens/knobs'
import { type Role, toHex } from '@waldow-design/tokens/palette'
import { type CSSProperties, type ReactNode, useEffect, useState, useSyncExternalStore } from 'react'
import './hero.css'

/**
 * The brand's display face. `knobStyle` points the display font at the font knob (Sans by
 * default), so the hero puts the brand's display face back.
 */
export const displayFont = 'var(--ds-font-family-display)'

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

/** The CSS variables for a knob set, plus a display face. */
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

// Mode: the same contract as the site. `data-theme` on <html> wins; without it, the OS decides.
// Watching the attribute keeps the toggle in step with Storybook's theme toolbar too.

function readMode(): Mode {
  const theme = document.documentElement.dataset.theme
  if (theme === 'light' || theme === 'dark') return theme
  return globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
function subscribeMode(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributeFilter: ['data-theme'] })
  return () => observer.disconnect()
}
function useDocumentMode() {
  const mode = useSyncExternalStore(subscribeMode, readMode, () => 'light' as Mode)
  const setMode = (next: Mode) => {
    document.documentElement.dataset.theme = next
  }
  return [mode, setMode] as const
}

export function HeroTitle({ align = 'start' }: { align?: 'start' | 'center' }) {
  return (
    <div className={align === 'center' ? '@container flex w-full flex-col items-center gap-5 text-center' : '@container flex w-full flex-col gap-5'}>
      <h1 className="hero-display font-display text-4xl font-bold text-foreground @sm:text-5xl @md:text-6xl @xl:text-7xl">
        Waldow
        <span className="hero-outline bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">.Design</span>
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

/** Seed-colour aurora over graph paper that turns into a dot canvas, plus grain. Decorative. */
export function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0">
        <div className="hero-blob absolute -top-1/4 -left-1/6 size-2/3 rounded-pill bg-primary/40 blur-3xl" />
        <div className="hero-blob absolute top-1/4 -right-1/6 size-1/2 rounded-pill bg-secondary/30 blur-3xl" />
        <div className="hero-blob absolute -bottom-1/3 left-1/4 size-1/2 rounded-pill bg-highlight/25 blur-3xl" />
      </div>
      <div className="hero-lines absolute inset-0" />
      <div className="hero-dots absolute inset-0" />
      <div className="hero-grain absolute inset-0" />
    </div>
  )
}

/** The hero's frame: a full-bleed, branded section with the backdrop behind and a mode toggle. */
export function HeroFrame({ style, children }: { style: CSSProperties; children: ReactNode }) {
  const [mode, setMode] = useDocumentMode()
  return (
    <section
      aria-label="Waldow.Design"
      data-brand="hero"
      style={style}
      className="relative isolate overflow-hidden bg-background px-6 py-16 sm:px-12 sm:py-24"
    >
      <Backdrop />
      <ModeToggle mode={mode} onModeChange={setMode} variant="outline" className="absolute top-4 right-4 z-10 bg-surface/70 backdrop-blur-sm" />
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

/**
 * A number whose changed digits drop in from above with a small bounce (hero.css `.hero-digit`).
 * Digits are keyed by place and value, so a digit that didn't change doesn't move.
 */
export function RollingNumber({ value, suffix }: { value: number; suffix?: string }) {
  const digits = String(value).split('')
  return (
    <span className="inline-flex overflow-hidden tabular-nums">
      {digits.map((digit, index) => (
        <span key={`${digits.length - index}-${digit}`} className="hero-digit">
          {digit}
        </span>
      ))}
      {suffix}
    </span>
  )
}

const glyphs = '0123456789abcdefｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ'
const randomGlyph = () => glyphs[Math.floor(Math.random() * glyphs.length)]!

/**
 * Text that rains through code glyphs and locks in left to right whenever it changes, like the
 * Matrix. Screen readers get the plain text; reduced motion shows it straight away.
 */
export function ScrambleText({ text, className }: { text: string; className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [shown, setShown] = useState(text)

  useEffect(() => {
    if (reduced) return
    const run = { frame: 0 }
    const timer = setInterval(() => {
      run.frame += 1
      // Two frames of pure noise, then one more character locks in each frame. The leading # stays put.
      const locked = run.frame - 2
      setShown([...text].map((char, index) => (char === '#' || index < locked ? char : randomGlyph())).join(''))
      if (locked >= text.length) clearInterval(timer)
    }, 20)
    return () => clearInterval(timer)
  }, [text, reduced])

  const display = reduced ? text : shown
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="inline-flex">
        {[...display].map((char, index) => (
          <span key={index} className={char === text[index] ? undefined : 'text-primary'} style={{ width: '1ch', textAlign: 'center' }}>
            {char}
          </span>
        ))}
      </span>
    </span>
  )
}
