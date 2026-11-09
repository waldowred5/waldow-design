import type { Meta, StoryObj } from '@storybook/react-vite'
import { AccessibilityIcon, LanguagesIcon, PaletteIcon, ZapIcon } from 'lucide-react'
import { FeatureGrid, FeatureGridItem, featureGridVariantOptions } from './feature-grid'

const meta = {
  title: 'Patterns/FeatureGrid',
  component: FeatureGrid,
  parameters: { layout: 'padded' },
  argTypes: { columns: { control: 'inline-radio', options: featureGridVariantOptions.columns.map(Number) } },
  render: (args) => (
    <section aria-labelledby="why">
      <h2 id="why" className="sr-only">
        Why it matters
      </h2>
      <FeatureGrid {...args}>
        <FeatureGridItem icon={<PaletteIcon />} title="Change once, update everywhere">
          A new brand colour is one edit. Every screen follows, in light and dark mode.
        </FeatureGridItem>
        <FeatureGridItem icon={<AccessibilityIcon />} title="Accessible by default">
          Labels, focus and contrast are solved once in the component.
        </FeatureGridItem>
        <FeatureGridItem icon={<ZapIcon />} title="Faster to build">
          Teams assemble screens from parts that already work.
        </FeatureGridItem>
        <FeatureGridItem icon={<LanguagesIcon />} title="One shared language">
          Design, product and engineering mean the same thing by “card”.
        </FeatureGridItem>
      </FeatureGrid>
    </section>
  ),
} satisfies Meta<typeof FeatureGrid>

export default meta
type Story = StoryObj<typeof meta>

/** Three across from `lg`. */
export const ThreeColumns: Story = { args: { columns: 3 } }

/** Two across, for longer descriptions. */
export const TwoColumns: Story = { args: { columns: 2 } }

/** Four across, for one-line features. */
export const FourColumns: Story = { args: { columns: 4 } }

/** Without icons: titles and text only. */
export const TextOnly: Story = {
  render: () => (
    <FeatureGrid columns={3}>
      <FeatureGridItem title="Describe">The agent describes a screen from the catalog.</FeatureGridItem>
      <FeatureGridItem title="Check">The app checks it against what the catalog allows.</FeatureGridItem>
      <FeatureGridItem title="Render">The app renders it with its own components.</FeatureGridItem>
    </FeatureGrid>
  ),
}
