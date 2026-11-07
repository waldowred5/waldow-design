import type { Meta, StoryObj } from '@storybook/react-vite'
import { withWidth } from '../../.storybook/decorators'
import { Checkbox } from './checkbox'
import { Field } from './field'
import { Input } from './input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

const meta = {
  title: 'Components/Field',
  component: Field,
  args: { label: 'Email', children: <Input type="email" /> },
  decorators: [withWidth('w-80')],
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithDescription: Story = { args: { description: "We'll only use this to send receipts." } }
export const Required: Story = { args: { required: true } }
export const WithError: Story = { args: { error: 'Enter an email address, like name@example.com.', required: true } }

export const WithSelect: Story = {
  args: {
    label: 'Role',
    children: (
      <Select defaultValue="editor">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="viewer">Viewer</SelectItem>
          <SelectItem value="editor">Editor</SelectItem>
        </SelectContent>
      </Select>
    ),
  },
}

export const WithCheckbox: Story = {
  args: { label: 'Email me about product updates', orientation: 'horizontal', children: <Checkbox /> },
}
