import type { Meta, StoryObj } from '@storybook/react-vite'
import { withWidth } from '../../.storybook/decorators'
import { Field } from './field'
import { Slider } from './slider'

const meta = {
  title: 'Components/Slider',
  component: Slider,
  decorators: [withWidth('w-72')],
  args: { defaultValue: [60], max: 100, thumbLabels: ['Volume'] },
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** In a Field, the label names the thumb and the description is announced with it. */
export const InField: Story = {
  args: { thumbLabels: undefined },
  render: (args) => (
    <Field label="Radius" description="0 to 1.5rem">
      <Slider {...args} defaultValue={[0.5]} max={1.5} step={0.125} />
    </Field>
  ),
}

export const Range: Story = { args: { defaultValue: [20, 80], thumbLabels: ['Minimum price', 'Maximum price'] } }
export const Disabled: Story = { args: { disabled: true } }
