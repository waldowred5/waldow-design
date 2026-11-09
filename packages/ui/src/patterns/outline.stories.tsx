import type { Meta, StoryObj } from '@storybook/react-vite'
import { withWidth } from '../../.storybook/decorators'
import { Outline } from './outline'
import { sampleOutline } from './sample-data'

const meta = {
  title: 'Patterns/Outline',
  component: Outline,
  decorators: [withWidth('w-56')],
  args: { items: sampleOutline, activeId: 'why-it-matters' },
} satisfies Meta<typeof Outline>

export default meta
type Story = StoryObj<typeof meta>

/** The section being read is highlighted; `h3`s are indented under their `h2`. */
export const Default: Story = {}
export const NothingActive: Story = { args: { activeId: undefined } }
export const CustomTitle: Story = { args: { title: 'In this guide' } }
