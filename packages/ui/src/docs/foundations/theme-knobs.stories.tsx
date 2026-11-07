/**
 * Fixed examples of the theme knobs: the same small sample under different knob settings.
 * The interactive playground lives in the web app (apps/web, `#/theme-knobs`), where knob
 * state survives light/dark switches and reloads.
 */
import * as t from '@waldow-design/tokens'
import { scale, steps, toOklch } from '@waldow-design/tokens/palette'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties } from 'react'
import { Badge } from '../../components/badge'
import { Button } from '../../components/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/card'
import { Field } from '../../components/field'
import { Input } from '../../components/input'
import { Stack } from '../../components/stack'

type Knobs = { primary: string; secondary: string; highlight: string; radius: number; font: string }

const serif = '"Iowan Old Style", "Palatino Linotype", Georgia, ui-serif, serif'

/** The knobs as CSS variables for a `data-brand` subtree, as the web app's playground sets them. */
function knobStyle({ radius, font, ...seeds }: Knobs): CSSProperties {
  const vars: Record<string, string> = {
    '--ds-theme-radius': `${radius}rem`,
    '--ds-theme-font-body': font,
    '--ds-theme-font-display': font,
  }
  for (const [role, seed] of Object.entries(seeds)) {
    const generated = scale(seed)
    for (const step of steps) vars[`--ds-color-${role}-${step}`] = toOklch(generated[step])
  }
  return vars as CSSProperties
}

function KnobsSample(knobs: Knobs) {
  return (
    <div data-brand="knobs-example" style={knobStyle(knobs)} className="w-full max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Plan a weekend in Lisbon</CardTitle>
          <CardDescription>Three friends, two nights.</CardDescription>
        </CardHeader>
        <CardContent>
          <Stack gap={4}>
            <Stack direction="horizontal" gap={2} wrap>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="highlight">Highlight</Badge>
            </Stack>
            <Field label="Trip name">
              <Input defaultValue="Lisbon long weekend" />
            </Field>
          </Stack>
        </CardContent>
        <CardFooter>
          <Button variant="secondary">Save draft</Button>
          <Button>Book trip</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

const meta = {
  title: 'Foundations/Theme knobs',
  component: KnobsSample,
  tags: ['!autodocs'],
  args: {
    primary: t.ThemeColorPrimary,
    secondary: t.ThemeColorSecondary,
    highlight: t.ThemeColorHighlight,
    radius: Number.parseFloat(t.ThemeRadius),
    font: t.FontFamilySans.join(', '),
  },
} satisfies Meta<typeof KnobsSample>

export default meta
type Story = StoryObj<typeof meta>

/** The waldow.design brand: indigo, teal and amber seeds, 0.5rem radius, the sans font. */
export const Brand: Story = {}

/** One seed for all three colours: primary, secondary and highlight become the same scale. */
export const OneColour: Story = {
  name: 'One colour',
  args: { secondary: t.ThemeColorPrimary, highlight: t.ThemeColorPrimary },
}

/** Warm seeds with square corners and a serif: radius 0 squares every surface and control. */
export const SquareSerif: Story = {
  name: 'Square, serif',
  args: { primary: '#9f1239', secondary: '#57534e', highlight: '#ca8a04', radius: 0, font: serif },
}

/** Cool seeds with generous corners and the mono font. */
export const RoundMono: Story = {
  name: 'Round, mono',
  args: { primary: '#0369a1', secondary: '#7c3aed', highlight: '#16a34a', radius: 1.25, font: t.FontFamilyMono.join(', ') },
}
