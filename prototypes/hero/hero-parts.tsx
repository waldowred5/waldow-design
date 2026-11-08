/**
 * Pieces every hero variant shares, so the variants differ only in what they're testing:
 * the frame (backdrop and mode toggle), the title, the actions, and the seed maths.
 */
import { Button, type Mode, ModeToggle } from '@waldow-design/ui'
import * as tokens from '@waldow-design/tokens'
import { defaultKnobs, type Knobs, knobStyle } from '@waldow-design/tokens/knobs'
import { type Role, roles, steps, toHex } from '@waldow-design/tokens/palette'
import { type CSSProperties, type MouseEvent, type ReactNode, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import './hero.css'

const ms = ({ value, unit }: { value: number; unit: string }) => (unit === 's' ? value * 1000 : value)
const easing = (curve: readonly number[]) => `cubic-bezier(${curve.join(', ')})`

/**
 * The palette step variables every knob change rewrites (role × step, from knobStyle), registered
 * as colours. An unregistered custom property can only jump; a registered one interpolates, so a
 * transition on the steps themselves animates every semantic token derived from them, and with
 * them every component on the page, without a transition rule on any component.
 */
const paletteVars = roles.flatMap((role) => steps.map((step) => `--ds-color-${role}-${step}`))
for (const name of paletteVars) {
  try {
    globalThis.CSS?.registerProperty?.({ name, syntax: '<color>', inherits: true, initialValue: 'transparent' })
  } catch {
    // Already registered (hot reload, or another story module): nothing to do.
  }
}

/** Glide between palettes: long enough to read as a sweep, short enough to finish before the next drift tick. */
const paletteTransition: CSSProperties = {
  transitionProperty: paletteVars.join(', '),
  transitionDuration: `${ms(tokens.MotionDurationSlower)}ms`,
  transitionTimingFunction: easing(tokens.MotionEasingStandard),
}

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
/**
 * Switch the mode with a soft circular reveal: the new mode grows out from `origin` (the toggle)
 * as a view transition, through a radial mask with a feathered edge whose radius animates (hero.css `.hero-reveal`).
 * Without view transitions, or with reduced motion, it switches straight away.
 */
function switchMode(next: Mode, origin: { x: number; y: number }) {
  const root = document.documentElement
  const apply = () => {
    root.dataset.theme = next
  }
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (!document.startViewTransition || reduced) return apply()
  root.classList.add('hero-reveal')
  root.style.setProperty('--reveal-x', `${origin.x}px`)
  root.style.setProperty('--reveal-y', `${origin.y}px`)
  const transition = document.startViewTransition(apply)
  // The mask is solid to 80% of its radius, so it must reach past the farthest corner by that margin.
  const corner = Math.hypot(Math.max(origin.x, innerWidth - origin.x), Math.max(origin.y, innerHeight - origin.y))
  void transition.ready.then(() =>
    root.animate(
      { '--reveal-r': ['0px', `${corner / 0.8}px`] },
      {
        duration: ms(tokens.MotionDurationSlower) * 1.5,
        easing: easing(tokens.MotionEasingStandard),
        pseudoElement: '::view-transition-new(root)',
      },
    ),
  )
  void transition.finished.finally(() => {
    root.classList.remove('hero-reveal')
    root.style.removeProperty('--reveal-x')
    root.style.removeProperty('--reveal-y')
  })
}

function useDocumentMode() {
  return useSyncExternalStore(subscribeMode, readMode, () => 'light' as Mode)
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
  const mode = useDocumentMode()
  const reduced = usePrefersReducedMotion()
  // The reveal grows from the toggle's centre, read on the click that switches it.
  const origin = useRef({ x: 0, y: 0 })
  const fromToggle = (event: MouseEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    origin.current = { x: box.left + box.width / 2, y: box.top + box.height / 2 }
  }
  return (
    <section
      aria-label="Waldow.Design"
      data-brand="hero"
      style={reduced ? style : { ...style, ...paletteTransition }}
      className="relative isolate overflow-hidden bg-background px-6 py-16 sm:px-12 sm:py-24"
    >
      <Backdrop />
      {/* Capture runs before the toggle's own click, so the origin is set when the mode changes. */}
      <div className="absolute top-4 right-4 z-10" onClickCapture={fromToggle}>
        <ModeToggle mode={mode} onModeChange={(next) => switchMode(next, origin.current)} variant="outline" className="bg-surface/70 backdrop-blur-sm" />
      </div>
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
 * Text that rains through code glyphs and locks in, one character at a time in a fresh random
 * order, whenever it changes, like the Matrix. Screen readers get the plain text; reduced motion
 * shows it straight away.
 */
export function ScrambleText({ text, className }: { text: string; className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [shown, setShown] = useState(text)

  useEffect(() => {
    if (reduced) return
    // A random lock-in order for this change: rank[i] is when character i settles.
    const order = Array.from(text, (_, index) => index)
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[order[i], order[j]] = [order[j]!, order[i]!]
    }
    const rank = order.reduce<number[]>((ranks, index, position) => ((ranks[index] = position), ranks), [])
    const run = { frame: 0 }
    const timer = setInterval(() => {
      run.frame += 1
      // Two frames of pure noise, then one more character locks in each frame. The leading # stays put.
      const locked = run.frame - 2
      setShown([...text].map((char, index) => (char === '#' || rank[index]! < locked ? char : randomGlyph())).join(''))
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
