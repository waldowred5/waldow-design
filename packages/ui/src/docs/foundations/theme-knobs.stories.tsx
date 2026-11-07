import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties } from 'react'
import { Badge } from '../../components/badge'
import { Button } from '../../components/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/card'
import { Checkbox } from '../../components/checkbox'
import { Field } from '../../components/field'
import { Input } from '../../components/input'
import { Stack } from '../../components/stack'

/**
 * Sample values for the knobs. A real brand sets these in packages/tokens/src/brand/<name>.json,
 * where the build checks their contrast; here they are inline so the controls can swap them.
 */
const palettes = {
  Indigo: null, // the waldow.design default from the token build
  Teal: ['#effcf9', '#d0f5ee', '#a3eadf', '#6dd8ca', '#3dbdb0', '#22a196', '#13817a', '#126762', '#13524f', '#134442', '#042827'],
  Rose: ['#fff1f3', '#ffe4e8', '#fecdd6', '#fda4b4', '#fb7190', '#f43f6c', '#d91f57', '#b71449', '#991444', '#83153f', '#49051e'],
} as const

const fonts = {
  Sans: null,
  Serif: '"Iowan Old Style", "Palatino Linotype", Georgia, ui-serif, serif',
  Mono: '"JetBrains Mono", ui-monospace, Menlo, monospace',
} as const

const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

type KnobArgs = { palette: keyof typeof palettes; radius: number; font: keyof typeof fonts }

function knobStyle({ palette, radius, font }: KnobArgs): CSSProperties {
  const vars: Record<string, string> = { '--ds-theme-radius': `${radius}rem` }
  palettes[palette]?.forEach((hex, i) => (vars[`--ds-color-brand-${steps[i]}`] = hex))
  const family = fonts[font]
  if (family) {
    vars['--ds-theme-font-body'] = family
    vars['--ds-theme-font-display'] = family
  }
  return vars as CSSProperties
}

const meta = {
  title: 'Foundations/Theme knobs',
  tags: ['!autodocs'],
  args: { palette: 'Indigo', radius: 0.5, font: 'Sans' },
  argTypes: {
    palette: { control: 'inline-radio', options: Object.keys(palettes), description: 'The brand scale (`color.brand.*`)' },
    radius: { control: { type: 'range', min: 0, max: 1.5, step: 0.125 }, description: '`theme.radius`, in rem' },
    font: { control: 'inline-radio', options: Object.keys(fonts), description: '`theme.font.body` and `theme.font.display`' },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<KnobArgs>

export default meta
type Story = StoryObj<KnobArgs>

/** Change the three knobs; every component re-derives its colours, corners and type from them. */
export const Playground: Story = {
  render: (args) => (
    <div data-brand="knobs" style={knobStyle(args)} className="max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Plan a weekend in Lisbon</CardTitle>
          <CardDescription>Three friends, two nights, one shared budget.</CardDescription>
        </CardHeader>
        <CardContent>
          <Stack gap={4}>
            <Stack direction="horizontal" gap={2}>
              <Badge variant="success">Flights booked</Badge>
              <Badge variant="warning">Hotel pending</Badge>
            </Stack>
            <Field label="Trip name">
              <Input defaultValue="Lisbon long weekend" />
            </Field>
            <Field label="Share the itinerary with everyone" orientation="horizontal">
              <Checkbox defaultChecked />
            </Field>
          </Stack>
        </CardContent>
        <CardFooter>
          <Button variant="ghost">Cancel</Button>
          <Button>Save trip</Button>
        </CardFooter>
      </Card>
    </div>
  ),
}

/** Square corners and a serif face: the same components, reading as a different product. */
export const SquareSerif: Story = {
  ...Playground,
  args: { palette: 'Teal', radius: 0, font: 'Serif' },
}

/** Generous radius and a warm palette. */
export const RoundRose: Story = {
  ...Playground,
  args: { palette: 'Rose', radius: 1.25, font: 'Sans' },
}
