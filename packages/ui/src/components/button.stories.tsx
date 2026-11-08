import type { Meta, StoryObj } from '@storybook/react-vite'
import { PlusIcon } from 'lucide-react'
import { Fragment } from 'react'
import { fn } from 'storybook/test'
import { Button, buttonVariantOptions } from './button'

type Variant = NonNullable<Parameters<typeof Button>[0]['variant']>
type Size = NonNullable<Parameters<typeof Button>[0]['size']>

// `icon` is a shape, not a step on the size scale; it has its own story.
const sizes = buttonVariantOptions.size.filter((size) => size !== 'icon') as Size[]
const variants = buttonVariantOptions.variant as Variant[]

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

/** Every `variant` (rows) at every `size` (columns). */
export const Variants: Story = {
  render: (args) => (
    <div className="grid grid-cols-4 items-center justify-items-start gap-x-6 gap-y-4">
      <span aria-hidden="true" />
      {sizes.map((size) => (
        <span key={size} className="font-mono text-xs text-muted-foreground">
          {size}
        </span>
      ))}
      {variants.map((variant) => (
        <Fragment key={variant}>
          <span className="font-mono text-xs text-muted-foreground">{variant}</span>
          {sizes.map((size) => (
            <Button key={size} {...args} variant={variant} size={size}>
              {variant === 'danger' ? 'Delete' : 'Save'}
            </Button>
          ))}
        </Fragment>
      ))}
    </div>
  ),
}

/** Use the controls to try any combination. */
export const Playground: Story = {}

export const Disabled: Story = { args: { disabled: true } }

/**
 * An icon beside a label, and an icon-only button. Icons are `aria-hidden`; an icon-only
 * button (`size="icon"`) takes its accessible name from `aria-label`.
 */
export const WithIcon: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Button {...args}>
        <PlusIcon aria-hidden="true" /> New project
      </Button>
      <Button {...args} variant="outline" size="icon" aria-label="Add item">
        <PlusIcon aria-hidden="true" />
      </Button>
    </div>
  ),
}

export const AsLink: Story = {
  args: { asChild: true, variant: 'outline', children: <a href="#docs">Read the docs</a> },
}
