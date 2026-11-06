import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from './checkbox'

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: { 'aria-label': 'Accept terms' },
  argTypes: { checked: { control: 'inline-radio', options: [true, false, 'indeterminate'] } },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Unchecked: Story = {}
export const Checked: Story = { args: { defaultChecked: true } }
export const Indeterminate: Story = { args: { checked: 'indeterminate', 'aria-label': 'Select all rows' } }
export const Invalid: Story = { args: { 'aria-invalid': true } }
export const Disabled: Story = { args: { disabled: true, defaultChecked: true } }
