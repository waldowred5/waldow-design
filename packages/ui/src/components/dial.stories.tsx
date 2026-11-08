import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Dial, type DialProps } from './dial'
import { Field } from './field'

function ControlledDial(props: Omit<DialProps, 'value' | 'onValueChange'> & { initial?: number }) {
  const { initial = 277, ...rest } = props
  const [value, setValue] = useState(initial)
  return (
    <Dial {...rest} value={value} onValueChange={setValue}>
      <span className="font-mono text-xs text-muted-foreground">HUE</span>
      <span className="font-display text-3xl font-semibold tabular-nums text-foreground">{value}°</span>
    </Dial>
  )
}

const meta = {
  title: 'Components/Dial',
  component: ControlledDial,
  args: { 'aria-label': 'Hue' },
} satisfies Meta<typeof ControlledDial>

export default meta
type Story = StoryObj<typeof meta>

/** Drag around the centre, or focus it and use the arrow keys. It turns past 359 without spinning back. */
export const Default: Story = {}
export const Large: Story = { args: { size: 'lg' } }
export const CoarseSteps: Story = { args: { step: 15, ticks: 24, 'aria-label': 'Heading', initial: 90 } }

/** In a Field, the label names the dial. */
export const InField: Story = {
  args: { 'aria-label': undefined },
  render: (args) => (
    <Field label="Brand hue" description="Turn to re-derive every colour token">
      <ControlledDial {...args} />
    </Field>
  ),
}
