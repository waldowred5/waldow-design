import type { Meta, StoryObj } from '@storybook/react-vite'
import { PlusIcon } from 'lucide-react'
import { fn } from 'storybook/test'
import { Button, buttonVariantOptions } from './button'

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Save changes', onClick: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: buttonVariantOptions.variant },
    size: { control: 'inline-radio', options: buttonVariantOptions.size },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}
export const Secondary: Story = { args: { variant: 'secondary' } }
export const Outline: Story = { args: { variant: 'outline' } }
export const Ghost: Story = { args: { variant: 'ghost' } }
export const Danger: Story = { args: { variant: 'danger', children: 'Delete project' } }
export const Disabled: Story = { args: { disabled: true } }

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </div>
  ),
}

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <PlusIcon aria-hidden="true" /> New project
      </>
    ),
  },
}

/** Icon-only buttons need an `aria-label`. */
export const IconOnly: Story = {
  args: { size: 'icon', 'aria-label': 'Add item', children: <PlusIcon aria-hidden="true" /> },
}

export const AsLink: Story = {
  args: { asChild: true, variant: 'outline', children: <a href="#docs">Read the docs</a> },
}
