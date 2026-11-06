import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stack } from './stack'

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
    direction: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    gap: { control: 'select', options: [0, 1, 2, 3, 4, 6, 8, 12] },
    align: { control: 'select', options: ['start', 'center', 'end', 'stretch', 'baseline'] },
    justify: { control: 'select', options: ['start', 'center', 'end', 'between'] },
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
