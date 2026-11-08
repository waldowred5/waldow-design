import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../components/button'
import { CallToAction } from './call-to-action'

const meta = {
  title: 'Patterns/CallToAction',
  component: CallToAction,
  parameters: { layout: 'padded' },
  args: {
    title: 'Read the guide',
    description: 'The whole story, page by page: what a design system is, and how this one is built.',
    children: (
      <>
        <Button variant="outline" asChild>
          <a href="#top">Browse the components</a>
        </Button>
        <Button asChild>
          <a href="#top">Read the docs</a>
        </Button>
      </>
    ),
  },
} satisfies Meta<typeof CallToAction>

export default meta
type Story = StoryObj<typeof meta>

/** The secondary action first, the primary last at the trailing edge. */
export const Default: Story = {}

/** One action. */
export const SingleAction: Story = {
  args: {
    children: (
      <Button asChild>
        <a href="#top">Read the docs</a>
      </Button>
    ),
  },
}
