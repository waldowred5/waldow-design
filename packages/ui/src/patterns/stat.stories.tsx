import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stat, StatGroup } from './stat'

const meta = {
  title: 'Patterns/Stat',
  component: StatGroup,
  parameters: { layout: 'padded' },
  render: (args) => (
    <StatGroup {...args}>
      <Stat value="45 kB" label="Every component" detail="Budget, minified and brotli" />
      <Stat value="11 kB" label="A single button" detail="Tree-shaken" />
      <Stat value="40" label="Contrast pairs" detail="Checked against WCAG AA" />
      <Stat value="0" label="axe violations" detail="On every story, in CI" />
    </StatGroup>
  ),
} satisfies Meta<typeof StatGroup>

export default meta
type Story = StoryObj<typeof meta>

/** Two across on phones, four from `lg`. The value is shown above its label. */
export const Default: Story = {}

/** Labels only, no notes. */
export const WithoutDetail: Story = {
  render: () => (
    <StatGroup>
      <Stat value="12" label="Components" />
      <Stat value="8" label="Patterns" />
      <Stat value="3" label="Seed colours" />
      <Stat value="2" label="Modes" />
    </StatGroup>
  ),
}
