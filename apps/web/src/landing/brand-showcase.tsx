/**
 * The theme knobs at work on the landing page: pick a brand and the gallery below re-derives
 * every token from that brand's seeds, radius and font. The colour maths (culori, via
 * @waldow-design/tokens/knobs) loads on the first pick, so the page itself stays light.
 */
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
  Field,
  Input,
  Stack,
} from '@waldow-design/ui'
import type { Knobs } from '@waldow-design/tokens/knobs'
import { type CSSProperties, useState } from 'react'
import { setMode, useMode } from '../theme-mode'

type Brand = { name: string; knobs?: Knobs }

// Seed colours are knob inputs, like the brand JSON: the palette maths turns them into tokens.
const brands: Brand[] = [
  { name: 'waldow.design' },
  { name: 'Forest', knobs: { seeds: { primary: '#2f6f4e', secondary: '#7a5c3a', highlight: '#c58b1b' }, radius: 0.25, font: 'Serif' } }, // tokens-ok: knob seeds
  { name: 'Sunset', knobs: { seeds: { primary: '#c2410c', secondary: '#6d28d9', highlight: '#db2777' }, radius: 1.25, font: 'Sans' } }, // tokens-ok: knob seeds
  { name: 'Terminal', knobs: { seeds: { primary: '#0f766e', secondary: '#334155', highlight: '#65a30d' }, radius: 0, font: 'Mono' } }, // tokens-ok: knob seeds
]

const loadKnobs = () => import('@waldow-design/tokens/knobs')

export function BrandShowcase() {
  const [brand, setBrand] = useState(brands[0]!.name)
  const [style, setStyle] = useState<CSSProperties>()
  const mode = useMode()

  const pick = async ({ name, knobs }: Brand) => {
    setBrand(name)
    if (!knobs) return setStyle(undefined)
    const { knobStyle } = await loadKnobs()
    setStyle(knobStyle(knobs) as CSSProperties)
  }

  return (
    <Stack gap={6}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <fieldset className="flex flex-wrap gap-2">
          <legend className="sr-only">Brand</legend>
          {brands.map((option) => (
            <Button
              key={option.name}
              size="sm"
              variant={brand === option.name ? 'primary' : 'outline'}
              aria-pressed={brand === option.name}
              onClick={() => void pick(option)}
              onPointerEnter={option.knobs ? loadKnobs : undefined}
              onFocus={option.knobs ? loadKnobs : undefined}
            >
              {option.name}
            </Button>
          ))}
        </fieldset>
        <fieldset className="flex gap-2">
          <legend className="sr-only">Mode</legend>
          {(['light', 'dark'] as const).map((option) => (
            <Button
              key={option}
              size="sm"
              variant={mode === option ? 'secondary' : 'ghost'}
              aria-pressed={mode === option}
              onClick={() => setMode(option)}
            >
              {option === 'light' ? 'Light' : 'Dark'}
            </Button>
          ))}
        </fieldset>
      </div>

      <div
        data-brand="landing-showcase"
        style={style}
        className="grid gap-4 rounded-surface border border-border bg-background p-4 md:grid-cols-2"
      >
        <Card>
          <CardHeader>
            <CardTitle>Plan a weekend in Lisbon</CardTitle>
            <CardDescription>Three friends, two nights.</CardDescription>
          </CardHeader>
          <CardContent>
            <Stack gap={4}>
              <Field label="Trip name">
                <Input defaultValue="Lisbon long weekend" />
              </Field>
              <Field label="Share the itinerary" orientation="horizontal">
                <Checkbox defaultChecked />
              </Field>
            </Stack>
          </CardContent>
          <CardFooter>
            <Button variant="secondary">Save draft</Button>
            <Button>Book trip</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Itinerary</CardTitle>
            <CardDescription>Every colour here comes from three seeds.</CardDescription>
          </CardHeader>
          <Stack gap={3} asChild>
            <ul>
              {[
                ['Fri 18:40', 'Land at LIS', 'primary'],
                ['Sat 10:00', 'Tram 28 and Alfama', 'highlight'],
                ['Sun 13:00', 'Lunch in Belém', 'secondary'],
              ].map(([time, what, variant]) => (
                <li key={time} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex flex-col">
                    <span className="font-medium">{what}</span>
                    <span className="text-muted-foreground">{time}</span>
                  </span>
                  <Badge variant={variant as 'primary' | 'highlight' | 'secondary'}>{variant === 'primary' ? 'Booked' : variant === 'highlight' ? 'Saved' : 'Idea'}</Badge>
                </li>
              ))}
            </ul>
          </Stack>
        </Card>
      </div>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Showing the {brand} brand in {mode} mode.
      </p>
    </Stack>
  )
}
