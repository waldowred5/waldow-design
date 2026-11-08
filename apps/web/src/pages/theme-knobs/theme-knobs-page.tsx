/**
 * A live playground for the theme knobs: three seed colours, the radius and the font.
 * Every change re-derives the tokens for the whole playground, controls included
 * (`knobStyle` from @waldow-design/tokens/knobs).
 *
 * The knobs are inline CSS variables on a `data-brand` element and don't depend on the mode,
 * so switching light/dark only flips `data-theme` on <html>: this component doesn't re-render,
 * and the knobs and the new mode resolve in the same style recalculation.
 */
import { Button, Field, Input, Prose, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Stack } from '@waldow-design/ui'
import { brandSeeds, defaultKnobs, type Font, fonts, type Knobs, knobStyle, radiusRange, sameSeeds } from '@waldow-design/tokens/knobs'
import { roles } from '@waldow-design/tokens/palette'
import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react'
import { normalisePath, replaceSearchParams, subscribe } from '../../router'
import { KnobsGallery } from './gallery'
import { fromParams, loadStoredKnobs, storeKnobs, toParams } from './knobs'

/** Colour pickers fire on every drag step; save once the knob settles. */
const SAVE_DELAY_MS = 150

const THEME_KNOBS_PATH = '/tools/theme-knobs'
const searchParams = () => new URLSearchParams(location.search)

function initialKnobs(): Knobs {
  // A link may set only some knobs: the rest come from the last look, not the brand defaults.
  const stored = loadStoredKnobs() ?? defaultKnobs
  return fromParams(searchParams(), stored) ?? stored
}

export default function ThemeKnobsPage() {
  const [knobs, setKnobs] = useState(initialKnobs)
  const { seeds, radius, font } = knobs
  const style = useMemo(() => knobStyle(knobs) as CSSProperties, [knobs])
  const query = useMemo(() => toParams(knobs), [knobs])

  // Mirror the knobs into the URL (shareable) and localStorage (restores a bare /tools/theme-knobs).
  const latest = useRef(knobs)
  useEffect(() => {
    latest.current = knobs
    const timer = setTimeout(() => {
      replaceSearchParams(query)
      storeKnobs(knobs)
    }, SAVE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [knobs, query])
  // Leaving the page cancels the pending save above, so save the last edit on the way out.
  useEffect(() => () => storeKnobs(latest.current), [])

  // Back/forward or a link changes the query while the page is open: follow it. A bare
  // `/tools/theme-knobs` (the sidebar link) gets the current knobs written back, so the URL stays shareable.
  useEffect(
    () =>
      subscribe(() => {
        if (normalisePath(location.pathname) !== THEME_KNOBS_PATH) return
        const params = searchParams()
        if (!params.toString()) return replaceSearchParams(query)
        const fromUrl = fromParams(params, knobs)
        if (fromUrl && toParams(fromUrl).toString() !== query.toString()) setKnobs(fromUrl)
      }),
    [knobs, query],
  )

  const update = (patch: Partial<Knobs>) => setKnobs((current) => ({ ...current, ...patch }))

  return (
    <Stack gap={6}>
      <Prose className="max-w-3xl">
        <h1>Theme knobs</h1>
        <p className="lead">
          A brand is a handful of knobs; everything else derives from them. All three colours start the same, so changing
          one shows exactly what it drives. Your knobs are kept in the link and survive light/dark switches and reloads.
        </p>
      </Prose>

      <div data-brand="knobs-playground" style={style} className="flex flex-col gap-6 lg:flex-row">
        <Stack gap={4} asChild>
          <section aria-labelledby="knobs-heading" className="lg:w-64 lg:shrink-0">
            <h2 id="knobs-heading" className="font-display text-lg font-semibold">
              Knobs
            </h2>
            {roles.map((role) => (
              <Field key={role} label={`${role[0]!.toUpperCase()}${role.slice(1)} colour`} id={`knob-${role}`} description={seeds[role]}>
                <Input
                  type="color"
                  value={seeds[role]}
                  onChange={(e) => update({ seeds: { ...seeds, [role]: e.target.value } })}
                  className="h-control-md w-full p-1"
                />
              </Field>
            ))}
            <Field label="Radius" id="knob-radius" description={`${radius}rem`}>
              <input
                id="knob-radius"
                type="range"
                min={radiusRange.min}
                max={radiusRange.max}
                step={radiusRange.step}
                value={radius}
                onChange={(e) => update({ radius: Number(e.target.value) })}
                className="w-full accent-primary"
              />
            </Field>
            <Field label="Font" id="knob-font">
              <Select value={font} onValueChange={(value) => update({ font: value as Font })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(fonts).map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Stack gap={2}>
              <Button variant="secondary" onClick={() => update({ seeds: sameSeeds })}>
                One colour for all
              </Button>
              <Button variant="outline" onClick={() => update({ seeds: brandSeeds })}>
                waldow.design colours
              </Button>
              <Button variant="ghost" onClick={() => setKnobs(defaultKnobs)}>
                Reset all knobs
              </Button>
            </Stack>
          </section>
        </Stack>

        <KnobsGallery linkHref={`${THEME_KNOBS_PATH}?${query}`} />
      </div>
    </Stack>
  )
}
