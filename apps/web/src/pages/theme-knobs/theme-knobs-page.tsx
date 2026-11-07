/**
 * A live playground for the theme knobs: three seed colours, the radius and the font.
 * Every change re-derives the tokens for the whole playground, controls included, through the
 * same scale generator the token build uses (@waldow-design/tokens/palette).
 *
 * The knobs are inline CSS variables on a `data-brand` element and don't depend on the mode,
 * so switching light/dark only flips `data-theme` on <html>: this component doesn't re-render,
 * and the knobs and the new mode resolve in the same style recalculation.
 */
import { Button, Field, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Stack } from '@waldow-design/ui'
import { useEffect, useMemo, useState } from 'react'
import { hashParams, replaceHashParams, routes } from '../../hash-route'
import { KnobsGallery } from './gallery'
import {
  brandSeeds,
  defaultKnobs,
  type Font,
  fonts,
  fromParams,
  type Knobs,
  knobStyle,
  loadStoredKnobs,
  radiusRange,
  roles,
  sameSeeds,
  storeKnobs,
  toParams,
} from './knobs'

/** Colour pickers fire on every drag step; save once the knob settles. */
const SAVE_DELAY_MS = 150

function initialKnobs(): Knobs {
  return fromParams(hashParams()) ?? loadStoredKnobs() ?? defaultKnobs
}

export default function ThemeKnobsPage() {
  const [knobs, setKnobs] = useState(initialKnobs)
  const { seeds, radius, font } = knobs
  const style = useMemo(() => knobStyle(knobs), [knobs])
  const query = useMemo(() => toParams(knobs), [knobs])

  // Mirror the knobs into the URL (shareable) and localStorage (restores a bare #/theme-knobs).
  useEffect(() => {
    const timer = setTimeout(() => {
      replaceHashParams(query)
      storeKnobs(knobs)
    }, SAVE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [knobs, query])

  // A pasted link or back/forward changes the hash while the page is open: follow it.
  useEffect(() => {
    const onHashChange = () => {
      const fromUrl = fromParams(hashParams())
      if (fromUrl && toParams(fromUrl).toString() !== query.toString()) setKnobs(fromUrl)
    }
    addEventListener('hashchange', onHashChange)
    return () => removeEventListener('hashchange', onHashChange)
  }, [query])

  const update = (patch: Partial<Knobs>) => setKnobs((current) => ({ ...current, ...patch }))

  return (
    <Stack gap={6}>
      <Stack gap={2} className="max-w-4xl">
        <h2 className="font-display text-2xl font-semibold">Theme knobs</h2>
        <p className="text-muted-foreground">
          A brand is a handful of knobs; everything else derives from them. All three colours start the same, so changing
          one shows exactly what it drives. Your knobs are kept in the link and survive light/dark switches and reloads.
        </p>
      </Stack>

      <div data-brand="knobs-playground" style={style} className="flex flex-col gap-6 lg:flex-row">
        <Stack gap={4} asChild>
          <section aria-labelledby="knobs-heading" className="lg:w-64 lg:shrink-0">
            <h3 id="knobs-heading" className="font-display text-lg font-semibold">
              Knobs
            </h3>
            {roles.map((role) => (
              <Field key={role} label={`${role[0]!.toUpperCase()}${role.slice(1)} colour`} id={`knob-${role}`} description={seeds[role]}>
                <Input
                  type="color"
                  value={seeds[role]}
                  onChange={(e) => update({ seeds: { ...seeds, [role]: e.target.value } })}
                  className="h-input w-full p-1"
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

        <KnobsGallery linkHref={`${routes['theme-knobs']}?${query}`} />
      </div>
    </Stack>
  )
}
