import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../components/badge'
import { Button } from '../components/button'
import { Hero } from './hero'

const meta = {
  title: 'Patterns/Hero',
  component: Hero,
  parameters: { layout: 'padded' },
  args: {
    title: 'Waldow.Design',
    tagline: 'An exploration into design systems in the age of agents',
  },
} satisfies Meta<typeof Hero>

export default meta
type Story = StoryObj<typeof meta>

export const TitleOnly: Story = {}

/** The secondary action first, the primary last at the trailing edge, as in every action group. */
export const WithActions: Story = {
  args: {
    eyebrow: <Badge variant="highlight">Phase 2</Badge>,
    children: (
      <>
        <Button variant="outline" asChild>
          <a href="#top">Try the theme knobs</a>
        </Button>
        <Button asChild>
          <a href="#top">Get started</a>
        </Button>
      </>
    ),
  },
}
