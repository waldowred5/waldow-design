import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../components/badge'
import { Button } from '../components/button'
import { Card, CardDescription, CardHeader, CardTitle } from '../components/card'
import { Stack } from '../components/stack'
import { FeatureSection, featureSectionVariantOptions } from './feature-section'

function Demo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekend in Lisbon</CardTitle>
        <CardDescription>Three friends, two nights.</CardDescription>
      </CardHeader>
      <Stack direction="horizontal" gap={2} wrap>
        <Badge variant="success">Confirmed</Badge>
        <Badge variant="highlight">2 nights</Badge>
      </Stack>
    </Card>
  )
}

const meta = {
  title: 'Patterns/FeatureSection',
  component: FeatureSection,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    layout: { control: 'inline-radio', options: featureSectionVariantOptions.layout },
    tone: { control: 'inline-radio', options: featureSectionVariantOptions.tone },
  },
  args: {
    eyebrow: 'Theming',
    title: 'One knob, every screen',
    description: 'Change a seed colour and every component follows, in light and dark mode.',
    children: <Demo />,
  },
} satisfies Meta<typeof FeatureSection>

export default meta
type Story = StoryObj<typeof meta>

/** The copy above, the demo full width below it. */
export const Stacked: Story = {}

/** The copy beside the demo from `lg`; a tinted band separates it from its neighbours. */
export const Split: Story = {
  args: {
    layout: 'split',
    tone: 'subtle',
    actions: (
      <Button variant="outline" asChild>
        <a href="#top">Try the theme knobs</a>
      </Button>
    ),
  },
}

/** The demo on the leading side on wide screens; the copy is still first in reading order. */
export const SplitReversed: Story = { args: { layout: 'split', reverse: true } }
