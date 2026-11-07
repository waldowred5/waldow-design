import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemeKnobsDemo } from './theme-knobs-demo'

const meta = {
  title: 'Foundations/Theme knobs',
  component: ThemeKnobsDemo,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ThemeKnobsDemo>

export default meta
type Story = StoryObj<typeof meta>

/** Change a knob; every component below re-derives its colours, corners and type live. */
export const Playground: Story = {}
