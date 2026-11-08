/**
 * Prototype: the home hero (LAB-193). Three directions for "show the system, don't describe it".
 * Disposable by default: compare in Chromatic, pick one, build it properly in apps/web.
 *
 * The first round found four gaps in the system, now filled in packages/ and used here:
 * `Dial` (and `Slider`) components, display type sizes `5xl`-`7xl`, motion tokens for long and
 * staggered motion plus an overshoot easing, and a brand display face (Bricolage Grotesque).
 */
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Dial,
  Field,
  Input,
  Stack,
} from '@waldow-design/ui'
import { fonts, type Knobs } from '@waldow-design/tokens/knobs'
import { scale, steps, toOklch } from '@waldow-design/tokens/palette'
import { type CSSProperties, type ReactNode, useEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'
import budgets from '../../.size-limit.json'
import {
  BRAND_HUE,
  brandKnobs,
  brandStyle,
  displayFont,
  HeroActions,
  HeroFrame,
  HeroTitle,
  RollingNumber,
  ScrambleText,
  seed,
  TokenTag,
  usePrefersReducedMotion,
} from './hero-parts'

const meta = {
  title: 'Prototypes/Hero',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// A: the hue dial ------------------------------------------------------------------------------

/** Degrees per autoplay tick, and how often it ticks: 12° a second, in steps big enough to read. */
const DRIFT_STEP = 2
const DRIFT_MS = 167

/** One hue in, three seeds out; drifts on its own until the reader takes over (or asks for less motion). */
function useHue() {
  const reduced = usePrefersReducedMotion()
  const [hue, setHue] = useState(BRAND_HUE)
  const [playing, setPlaying] = useState(true)
  const autoplay = playing && !reduced

  useEffect(() => {
    if (!autoplay) return
    const timer = setInterval(() => setHue((h) => (h + DRIFT_STEP) % 360), DRIFT_MS)
    return () => clearInterval(timer)
  }, [autoplay])

  return { hue, setHue, playing: autoplay, setPlaying, reduced }
}

/** Real components, inert, each pinned with the token that styles it. */
function Constellation({ seeds }: { seeds: Knobs['seeds'] }) {
  return (
    <div inert className="relative grid gap-4 sm:grid-cols-2">
      <Card className="shadow-floating sm:col-span-2">
        <CardHeader>
          <CardTitle>Plan a weekend in Lisbon</CardTitle>
          <CardDescription>Three friends, two nights.</CardDescription>
        </CardHeader>
        <CardContent>
          <Stack gap={4}>
            <Field label="Trip name">
              <Input defaultValue="Lisbon long weekend" />
            </Field>
            <Field label="Share the itinerary with everyone" orientation="horizontal">
              <Checkbox defaultChecked />
            </Field>
          </Stack>
        </CardContent>
        <CardFooter>
          <TokenTag>action.primary</TokenTag>
          <Button variant="ghost">Save draft</Button>
          <Button>Book trip</Button>
        </CardFooter>
      </Card>
      <Card className="shadow-raised">
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Stack gap={3}>
            <Stack direction="horizontal" gap={2} wrap>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="highlight">Highlight</Badge>
            </Stack>
            <TokenTag>emphasis.highlight</TokenTag>
          </Stack>
        </CardContent>
      </Card>
      <Card className="shadow-raised">
        <CardHeader>
          <CardTitle>Seeds</CardTitle>
        </CardHeader>
        <CardContent>
          <Stack gap={2}>
            {Object.entries(seeds).map(([role, colour]) => (
              <span key={role} className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <span className="size-3 shrink-0 rounded-pill" style={{ backgroundColor: colour }} />
                <span className="w-16">{role}</span>
                <ScrambleText text={colour} className="text-foreground" />
              </span>
            ))}
            <TokenTag>radius.surface</TokenTag>
          </Stack>
        </CardContent>
      </Card>
    </div>
  )
}

/** Every hue the dial can reach, as a ring around it. It counter-turns, so the current hue sits under the index mark. */
const ringStops = Array.from({ length: 13 }, (_, index) => seed(0.7, 0.15, index * 30)).join(', ')
function HueRing({ hue, children }: { hue: number; children: ReactNode }) {
  return (
    <div className="rounded-pill p-2 shadow-floating" style={{ background: `conic-gradient(from ${-hue}deg, ${ringStops})` }}>
      {children}
    </div>
  )
}

function HueDialHero() {
  const { hue, setHue, playing, setPlaying, reduced } = useHue()
  const knobs = useMemo(() => brandKnobs(hue), [hue])
  return (
    <HeroFrame style={brandStyle(knobs)}>
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Stack gap={8}>
          <Badge variant="highlight">12 components · 40 contrast pairs at AA</Badge>
          <HeroTitle />
          <div className="flex flex-wrap items-center gap-6">
            <HueRing hue={hue}>
              <Dial
                aria-label="Brand hue"
                size="lg"
                value={hue}
                onValueChange={(next) => {
                  setPlaying(false)
                  setHue(next)
                }}
              >
                <span className="font-mono text-xs tracking-widest text-muted-foreground">HUE</span>
                <span className="font-display text-5xl font-semibold text-foreground">
                  <RollingNumber value={hue} suffix="°" />
                </span>
              </Dial>
            </HueRing>
            <Stack gap={2} className="max-w-56">
              <p className="font-display text-xl font-semibold text-foreground">Change one value. Everything follows.</p>
              <p className="text-sm text-muted-foreground">Turn the dial: every colour token in this hero is re-derived from it.</p>
              {!reduced && (
                <Button variant="ghost" size="sm" className="w-fit" aria-pressed={!playing} onClick={() => setPlaying(!playing)}>
                  {playing ? 'Pause colour drift' : 'Resume colour drift'}
                </Button>
              )}
            </Stack>
          </div>
          <HeroActions />
        </Stack>
        <Constellation seeds={knobs.seeds} />
      </div>
    </HeroFrame>
  )
}

/** A: the thesis as a toy. One hue dial re-derives every token in the hero, and real components follow. */
export const A_HueDial: Story = {
  name: 'A: hue dial',
  render: () => <HueDialHero />,
}

// B: one system, four products ---------------------------------------------------------------

type Brand = {
  name: string
  product: string
  knobs: Knobs
  display: string
  theme?: 'dark'
  screen: { title: string; description: string; field: string; value: string; check: string; badges: string[]; primary: string }
}

/** ADR 002's four brands, written as knobs only. */
const brands: Brand[] = [
  {
    name: 'Modern',
    product: 'Travel planner',
    knobs: { seeds: { primary: seed(0.55, 0.16, 250), secondary: seed(0.62, 0.11, 190), highlight: seed(0.72, 0.15, 60) }, radius: 0.75, font: 'Sans' },
    display: fonts.Sans,
    screen: { title: 'Lisbon long weekend', description: 'Three friends, two nights.', field: 'Trip name', value: 'Lisbon in May', check: 'Share with everyone', badges: ['Booked', 'Flights', 'Vote open'], primary: 'Book trip' },
  },
  {
    name: 'Synthwave',
    product: 'Music crate',
    knobs: { seeds: { primary: seed(0.62, 0.26, 340), secondary: seed(0.78, 0.14, 200), highlight: seed(0.75, 0.18, 300) }, radius: 0.25, font: 'Sans' },
    display: displayFont,
    theme: 'dark',
    screen: { title: 'Night drive', description: '24 tracks, 1 h 32 min.', field: 'Crate name', value: 'Night drive', check: 'Crossfade between tracks', badges: ['Now playing', 'Synth', '120 BPM'], primary: 'Play crate' },
  },
  {
    name: 'Oatmeal & Ink',
    product: 'Recipe box',
    knobs: { seeds: { primary: seed(0.42, 0.06, 40), secondary: seed(0.55, 0.06, 140), highlight: seed(0.68, 0.12, 70) }, radius: 1.25, font: 'Serif' },
    display: fonts.Serif,
    screen: { title: 'Sunday ragù', description: 'Serves six. Three hours, mostly waiting.', field: 'Servings', value: '6', check: 'Add to this week’s plan', badges: ['Slow cook', 'Freezes well', 'Vegetarian option'], primary: 'Start cooking' },
  },
  {
    name: 'Dark analytics',
    product: 'SaaS dashboard',
    knobs: { seeds: { primary: seed(0.6, 0.2, 285), secondary: seed(0.75, 0.14, 210), highlight: seed(0.68, 0.24, 335) }, radius: 1, font: 'Sans' },
    display: fonts.Sans,
    theme: 'dark',
    screen: { title: 'Weekly revenue', description: 'Up 12% on last week.', field: 'Compare with', value: 'Previous week', check: 'Show forecast', badges: ['Live', '+12%', 'Q4'], primary: 'Open report' },
  },
]

function ProductWindow({ brand }: { brand: Brand }) {
  const { screen } = brand
  return (
    <div
      data-brand={brand.name}
      data-theme={brand.theme}
      style={brandStyle(brand.knobs, brand.display)}
      className="hero-window rounded-surface bg-background p-3 shadow-overlay"
    >
      {/* Keyed by brand, so the uncontrolled field shows each product's own value. */}
      <div key={brand.name} inert>
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-2xl">{screen.title}</CardTitle>
            <CardDescription>{screen.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Stack gap={4}>
              <Stack direction="horizontal" gap={2} wrap>
                <Badge variant="primary">{screen.badges[0]}</Badge>
                <Badge variant="secondary">{screen.badges[1]}</Badge>
                <Badge variant="highlight">{screen.badges[2]}</Badge>
              </Stack>
              <Field label={screen.field}>
                <Input defaultValue={screen.value} />
              </Field>
              <Field label={screen.check} orientation="horizontal">
                <Checkbox defaultChecked />
              </Field>
            </Stack>
          </CardContent>
          <CardFooter>
            <Button variant="outline">Later</Button>
            <Button>{screen.primary}</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

function FourProductsHero() {
  const [index, setIndex] = useState(0)
  const brand = brands[index]!
  const choose = (next: number) => {
    // Morph the window between brands where the browser can; jump straight there where it can't.
    if (!document.startViewTransition) return setIndex(next)
    document.startViewTransition(() => flushSync(() => setIndex(next)))
  }
  return (
    // The whole hero takes the brand's seeds and radius (the aurora and the actions follow it), but keeps its own display face.
    <HeroFrame style={brandStyle(brand.knobs)}>
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Stack gap={8}>
          <HeroTitle />
          <Stack gap={3}>
            <fieldset className="flex flex-col gap-3">
              <legend className="mb-3 text-sm font-medium text-foreground">One system, four products. Only the knobs change.</legend>
              <div className="flex flex-wrap gap-2">
                {brands.map((b, i) => (
                  <Button key={b.name} variant={i === index ? 'primary' : 'outline'} size="sm" aria-pressed={i === index} onClick={() => choose(i)}>
                    {b.name}
                  </Button>
                ))}
              </div>
            </fieldset>
            <p className="hero-brand-caption font-mono text-xs text-muted-foreground">
              {brand.product} · radius {brand.knobs.radius}rem · {brand.knobs.font.toLowerCase()} · {brand.theme ?? 'light'}
            </p>
          </Stack>
          <HeroActions />
        </Stack>
        <ProductWindow brand={brand} />
      </div>
    </HeroFrame>
  )
}

/** B: range over cleverness. The same ten components become four unrelated products (ADR 002), morphing between them. */
export const B_FourProducts: Story = {
  name: 'B: one system, four products',
  render: () => <FourProductsHero />,
}

// C: the pipeline, with proof ----------------------------------------------------------------

const budget = (name: string) => budgets.find((b) => b.name === name)?.limit ?? ''
const kb = (limit: string) => Number.parseFloat(limit)

/** A number that counts up in CSS. Screen readers get the plain number; the counter is visual only. */
function Count({ to, i, suffix }: { to: number; i: number; suffix?: string }) {
  return (
    <span className="font-display text-4xl font-bold text-foreground">
      <span className="sr-only">
        {to}
        {suffix}
      </span>
      <span aria-hidden className="hero-count" style={{ '--to': to, '--i': i } as CSSProperties} />
      {suffix && <span aria-hidden>{suffix}</span>}
    </span>
  )
}

function PipelineStep({ i, label, children }: { i: number; label: string; children: ReactNode }) {
  return (
    <li className="hero-reveal flex flex-col gap-3" style={{ '--i': i } as CSSProperties}>
      <span className="font-mono text-xs text-muted-foreground">
        {i + 1}. {label}
      </span>
      {children}
    </li>
  )
}

function PipelineHero() {
  const knobs = brandKnobs(BRAND_HUE)
  const ramp = scale(knobs.seeds.primary)
  const proof = [
    { to: 40, label: 'text and background pairs checked at WCAG AA on every build' },
    { to: kb(budget('ui: all components')), suffix: ' kB', label: 'budget for every component, enforced in CI' },
    { to: kb(budget('ui: Button only (tree-shaking)')), suffix: ' kB', label: 'for a single button, so tree-shaking stays honest' },
  ]
  return (
    <HeroFrame style={brandStyle(knobs)}>
      <Stack gap={12}>
        <Stack gap={8} align="center">
          <HeroTitle align="center" />
          <HeroActions />
        </Stack>

        <ol aria-label="How one seed becomes a component" className="grid gap-6 rounded-surface border border-border bg-surface/70 p-6 shadow-floating backdrop-blur-md md:grid-cols-4">
          <PipelineStep i={0} label="One seed">
            <span className="flex items-center gap-2 font-mono text-sm text-foreground">
              <span className="size-8 rounded-control" style={{ backgroundColor: knobs.seeds.primary }} />
              {knobs.seeds.primary}
            </span>
          </PipelineStep>
          <PipelineStep i={1} label="Eleven steps, in OKLCH">
            <span className="flex h-8 overflow-hidden rounded-control">
              {steps.map((step) => (
                <span key={step} className="flex-1" style={{ backgroundColor: toOklch(ramp[step]) }} />
              ))}
            </span>
          </PipelineStep>
          <PipelineStep i={2} label="Semantic roles">
            <Stack direction="horizontal" gap={1} wrap>
              <TokenTag>action.primary</TokenTag>
              <TokenTag>text.link</TokenTag>
              <TokenTag>border.focus</TokenTag>
            </Stack>
          </PipelineStep>
          <PipelineStep i={3} label="Components">
            <Stack direction="horizontal" gap={2} align="center" wrap inert>
              <Badge variant="primary">New</Badge>
              <Button size="sm">Save</Button>
            </Stack>
          </PipelineStep>
        </ol>

        <dl className="grid gap-8 sm:grid-cols-3">
          {proof.map((item, i) => (
            <div key={item.label} className="flex flex-col gap-1">
              <dt className="order-2 text-sm text-muted-foreground">{item.label}</dt>
              <dd className="order-1">
                <Count to={item.to} i={i} suffix={item.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </Stack>
    </HeroFrame>
  )
}

/** C: credibility first. The token pipeline drawn in four steps, then the numbers CI enforces, counting up. */
export const C_Pipeline: Story = {
  name: 'C: pipeline and proof',
  render: () => <PipelineHero />,
}
