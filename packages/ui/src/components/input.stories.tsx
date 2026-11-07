import type { Meta, StoryObj } from '@storybook/react-vite'
import { withWidth } from '../../.storybook/decorators'
import { Input } from './input'

const meta = {
  title: 'Components/Input',
  component: Input,
  args: { 'aria-label': 'Name', placeholder: 'Ada Lovelace' },
  decorators: [withWidth('w-80')],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithValue: Story = { args: { defaultValue: 'Grace Hopper' } }
export const Invalid: Story = { args: { 'aria-invalid': true, defaultValue: 'not-an-email' } }
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Read only' } }
export const Email: Story = { args: { type: 'email', 'aria-label': 'Email', placeholder: 'name@example.com', autoComplete: 'email' } }
