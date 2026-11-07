/**
 * A live playground for the theme knobs: three seed colours, the radius and the font.
 * Every change re-derives the tokens for the whole demo, controls included, through the same
 * scale generator the token build uses (@waldow-design/tokens/palette).
 */
import * as t from '@waldow-design/tokens'
import { scale, steps, toOklch } from '@waldow-design/tokens/palette'
import { type CSSProperties, type ReactNode, useState } from 'react'
import { ActionBar } from '../../components/action-bar'
import { Badge } from '../../components/badge'
import { Button } from '../../components/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/card'
import { Checkbox } from '../../components/checkbox'
import { Field } from '../../components/field'
import { Input } from '../../components/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/select'
import { Stack } from '../../components/stack'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/table'

type Role = 'primary' | 'secondary' | 'highlight'
const roles: Role[] = ['primary', 'secondary', 'highlight']

const fonts = {
  Sans: t.FontFamilySans.join(', '),
  Serif: '"Iowan Old Style", "Palatino Linotype", Georgia, ui-serif, serif',
  Mono: t.FontFamilyMono.join(', '),
} as const
type Font = keyof typeof fonts

const brandSeeds: Record<Role, string> = {
  primary: t.ThemeColorPrimary,
  secondary: t.ThemeColorSecondary,
  highlight: t.ThemeColorHighlight,
}
/** Start with one colour for all three, so changing each one shows exactly what it drives. */
const sameSeeds: Record<Role, string> = { primary: t.ThemeColorPrimary, secondary: t.ThemeColorPrimary, highlight: t.ThemeColorPrimary }

function knobStyle(seeds: Record<Role, string>, radius: number, font: Font): CSSProperties {
  const vars: Record<string, string> = { '--ds-theme-radius': `${radius}rem` }
  for (const role of roles) {
    const generated = scale(seeds[role])
    for (const step of steps) vars[`--ds-color-${role}-${step}`] = toOklch(generated[step])
  }
  vars['--ds-theme-font-body'] = fonts[font]
  vars['--ds-theme-font-display'] = fonts[font]
  return vars as CSSProperties
}

export function ThemeKnobsDemo() {
  const [seeds, setSeeds] = useState(sameSeeds)
  const [radius, setRadius] = useState(0.5)
  const [font, setFont] = useState<Font>('Sans')

  return (
    <div data-brand="knobs-demo" style={knobStyle(seeds, radius, font)} className="flex flex-col gap-6 rounded-surface bg-background p-6 lg:flex-row">
      <Stack gap={4} asChild>
        <section aria-label="Theme knobs" className="lg:w-64 lg:shrink-0">
          <h3 className="font-display text-lg font-semibold">Knobs</h3>
          {roles.map((role) => (
            <Field key={role} label={`${role[0]!.toUpperCase()}${role.slice(1)} colour`} id={`knob-${role}`} description={seeds[role]}>
              <Input type="color" value={seeds[role]} onChange={(e) => setSeeds({ ...seeds, [role]: e.target.value })} className="h-input w-full p-1" />
            </Field>
          ))}
          <Field label="Radius" id="knob-radius" description={`${radius}rem`}>
            <input
              id="knob-radius"
              type="range"
              min={0}
              max={1.5}
              step={0.125}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </Field>
          <Field label="Font" id="knob-font">
            <Select value={font} onValueChange={(value) => setFont(value as Font)}>
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
            <Button variant="secondary" onClick={() => setSeeds(sameSeeds)}>
              One colour for all
            </Button>
            <Button variant="outline" onClick={() => setSeeds(brandSeeds)}>
              waldow.design colours
            </Button>
          </Stack>
        </section>
      </Stack>

      <div className="grid flex-1 content-start gap-6 md:grid-cols-2">
        <Tile title="Actions" uses="primary · secondary">
          <Stack direction="horizontal" gap={2} wrap>
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </Stack>
          <p className="text-sm">
            Read the <a href="#knobs" className="text-link underline">booking terms</a> before you pay.
          </p>
        </Tile>

        <Tile title="Badges" uses="primary · secondary · highlight">
          <Stack direction="horizontal" gap={2} wrap>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="highlight">Highlight</Badge>
            <Badge>Neutral</Badge>
            <Badge variant="success">Confirmed</Badge>
          </Stack>
        </Tile>

        <Card>
          <CardHeader>
            <CardTitle>Plan a weekend in Lisbon</CardTitle>
            <CardDescription>Three friends, two nights. Uses primary, secondary and the radius.</CardDescription>
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
            <Button variant="secondary">Save draft</Button>
            <Button>Book trip</Button>
          </CardFooter>
        </Card>

        <Tile title="This week" uses="primary · highlight">
          <Meter label="Bookings" value={72} fill="bg-primary" />
          <Meter label="Saved places" value={45} fill="bg-highlight" />
          <Meter label="Budget used" value={88} fill="bg-primary" />
        </Tile>

        <Tile title="Travellers" uses="secondary · highlight">
          <Stack gap={3} asChild>
            <ul>
              {[
                ['AM', 'Ana Martins', 'Organiser', true],
                ['JO', 'Jun Ohara', 'Joined today', true],
                ['RP', 'Rui Paiva', 'Invited', false],
              ].map(([initials, name, note, isNew]) => (
                <li key={name as string} className="flex items-center gap-3">
                  <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-pill bg-secondary text-sm font-semibold text-secondary-foreground">
                    {initials}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium">{name}</span>
                    <span className="block text-sm text-muted-foreground">{note}</span>
                  </span>
                  {isNew && <Badge variant="highlight">New</Badge>}
                </li>
              ))}
            </ul>
          </Stack>
        </Tile>

        <Tile title="Itinerary" uses="primary · highlight">
          <ol className="flex flex-col gap-3 border-l-2 border-border pl-4">
            {[
              ['Fri 18:40', 'Land at LIS', 'bg-primary'],
              ['Sat 10:00', 'Tram 28 and Alfama', 'bg-highlight'],
              ['Sun 13:00', 'Lunch in Belém', 'bg-primary'],
            ].map(([time, what, dot]) => (
              <li key={time} className="relative text-sm">
                <span aria-hidden="true" className={`absolute top-1.5 -left-5.5 size-3 rounded-pill ${dot}`} />
                <span className="block font-medium">{what}</span>
                <span className="block text-muted-foreground">{time}</span>
              </li>
            ))}
          </ol>
        </Tile>

        <div className="md:col-span-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stay</TableHead>
                <TableHead>Nights</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Casa do Largo</TableCell>
                <TableCell>2</TableCell>
                <TableCell>
                  <Badge variant="primary">Booked</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Hotel Lumiares</TableCell>
                <TableCell>2</TableCell>
                <TableCell>
                  <Badge variant="highlight">Shortlisted</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="md:col-span-2">
          <Card className="shadow-overlay">
            <CardHeader>
              <CardTitle>Cancel the hotel booking?</CardTitle>
              <CardDescription>A dialog, shown in place. Hotel Lumiares refunds up to 48 hours before check-in.</CardDescription>
            </CardHeader>
            <ActionBar>
              <Button variant="ghost">Keep booking</Button>
              <Button variant="danger">Cancel booking</Button>
            </ActionBar>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Tile({ title, uses, children }: { title: string; uses: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Uses {uses}</CardDescription>
      </CardHeader>
      <Stack gap={4}>{children}</Stack>
    </Card>
  )
}

// The figure is in the text; the bar only illustrates it, so it is hidden from assistive tech.
function Meter({ label, value, fill }: { label: string; value: number; fill: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground">{value}%</span>
      </div>
      <div aria-hidden="true" className="h-2 rounded-pill bg-background-muted">
        <div className={`h-full rounded-pill ${fill}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}
