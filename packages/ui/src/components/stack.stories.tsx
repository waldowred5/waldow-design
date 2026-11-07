import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stack, stackVariantOptions } from './stack'

const Box = ({ label }: { label: string }) => (
  <div className="rounded-control border border-border bg-background-muted px-4 py-2 text-sm">{label}</div>
)

const meta = {
  title: 'Components/Stack',
  component: Stack,
  args: {
    children: (
      <>
        <Box label="One" />
        <Box label="Two" />
        <Box label="Three" />
      </>
    ),
  },
  argTypes: {
    direction: { control: 'inline-radio', options: stackVariantOptions.direction },
    // Object keys come back as strings; the gap prop takes numbers.
    gap: { control: 'select', options: stackVariantOptions.gap.map(Number) },
    align: { control: 'select', options: stackVariantOptions.align },
    justify: { control: 'select', options: stackVariantOptions.justify },
  },
} satisfies Meta<typeof Stack>

export default meta
type Story = StoryObj<typeof meta>

export const Vertical: Story = {}
export const Horizontal: Story = { args: { direction: 'horizontal', gap: 2 } }
export const SpaceBetween: Story = {
  args: { direction: 'horizontal', justify: 'between', className: 'w-96' },
}
/** `asChild` renders a semantic element, here a list. */
export const AsList: Story = {
  args: {
    asChild: true,
    gap: 1,
    children: (
      <ul>
        <li>Tokens</li>
        <li>Components</li>
        <li>Docs</li>
      </ul>
    ),
  },
}
