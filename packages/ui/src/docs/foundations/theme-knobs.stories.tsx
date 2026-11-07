/**
 * Fixed examples of the theme knobs: the same small sample under different knob settings.
 * The interactive playground, with the full gallery, lives in the web app (apps/web,
 * `#/theme-knobs`), where knob state survives light/dark switches and reloads.
 */
import { brandSeeds, defaultKnobs, type Knobs, knobStyle, sameSeeds } from '@waldow-design/tokens/knobs'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties } from 'react'
import { withWidth } from '../../../.storybook/decorators'
import { Badge } from '../../components/badge'
import { Button } from '../../components/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/card'
import { Field } from '../../components/field'
import { Input } from '../../components/input'
import { Stack } from '../../components/stack'

function KnobsSample(knobs: Knobs) {
  return (
    <div data-brand="knobs-example" style={knobStyle(knobs) as CSSProperties}>
      <Card>
        <CardHeader>
          <CardTitle>Knob preview</CardTitle>
          <CardDescription>Buttons, badges and a field under these knobs.</CardDescription>
        </CardHeader>
        <CardContent>
          <Stack gap={4}>
            <Stack direction="horizontal" gap={2} wrap>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="highlight">Highlight</Badge>
            </Stack>
            <Field label="Name">
              <Input defaultValue="waldow.design" />
            </Field>
          </Stack>
        </CardContent>
        <CardFooter>
          <Button variant="secondary">Secondary</Button>
          <Button>Primary</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

const meta = {
  title: 'Foundations/Theme knobs',
  component: KnobsSample,
  tags: ['!autodocs'],
  decorators: [withWidth('w-full max-w-md')],
  args: { ...defaultKnobs, seeds: brandSeeds },
} satisfies Meta<typeof KnobsSample>

export default meta
type Story = StoryObj<typeof meta>

/** The waldow.design brand: indigo, teal and amber seeds, 0.5rem radius, the sans font. */
export const Brand: Story = {}

/** One seed for all three colours: primary, secondary and highlight become the same scale. */
export const OneColour: Story = {
  name: 'One colour',
  args: { seeds: sameSeeds },
}

/** Warm seeds with square corners and a serif: radius 0 squares every surface and control. */
export const SquareSerif: Story = {
  name: 'Square, serif',
  args: { seeds: { primary: '#9f1239', secondary: '#57534e', highlight: '#ca8a04' }, radius: 0, font: 'Serif' }, // tokens-ok: example seeds
}

/** Cool seeds with generous corners and the mono font. */
export const RoundMono: Story = {
  name: 'Round, mono',
  args: { seeds: { primary: '#0369a1', secondary: '#7c3aed', highlight: '#16a34a' }, radius: 1.25, font: 'Mono' }, // tokens-ok: example seeds
}
