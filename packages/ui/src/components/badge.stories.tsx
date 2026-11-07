import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './badge'

const meta = {
  title: 'Components/Badge',
  component: Badge,
  args: { children: 'Active' },
  argTypes: { variant: { control: 'inline-radio', options: ['neutral', 'primary', 'success', 'warning', 'danger', 'info'] } },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Neutral: Story = { args: { children: 'Draft' } }
export const Primary: Story = { args: { variant: 'primary', children: 'New' } }
export const Success: Story = { args: { variant: 'success' } }
export const Warning: Story = { args: { variant: 'warning', children: 'Pending' } }
export const Danger: Story = { args: { variant: 'danger', children: 'Failed' } }
export const Info: Story = { args: { variant: 'info', children: 'Beta' } }

export const All: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Draft</Badge>
      <Badge variant="primary">New</Badge>
      <Badge variant="secondary">Shared</Badge>
      <Badge variant="accent">Featured</Badge>
      <Badge variant="success">Active</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="danger">Failed</Badge>
      <Badge variant="info">Beta</Badge>
    </div>
  ),
}
