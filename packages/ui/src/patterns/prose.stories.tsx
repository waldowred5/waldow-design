import type { Meta, StoryObj } from '@storybook/react-vite'
import { withWidth } from '../../.storybook/decorators'
import { Card, CardDescription, CardHeader, CardTitle } from '../components/card'
import { Prose } from './prose'

const meta = {
  title: 'Patterns/Prose',
  component: Prose,
  decorators: [withWidth('w-full max-w-2xl')],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Prose>

export default meta
type Story = StoryObj<typeof meta>

/** Plain elements, styled by position: headings, a lead paragraph, lists, links, code and a quote. */
export const Default: Story = {
  args: {
    children: (
      <>
        <h1>Colour</h1>
        <p className="lead">Every colour on the page comes from a token, so a theme is a handful of knobs.</p>
        <h2 id="roles">Roles</h2>
        <p>
          Components ask for a role such as <code>foreground</code> or <code>primary</code>, never a raw value. The{' '}
          <a href="#top">token reference</a> lists every role.
        </p>
        <ul>
          <li>Primitives hold the raw scales.</li>
          <li>Semantic tokens map roles onto them.</li>
        </ul>
        <pre>
          <code>color: var(--color-foreground);</code>
        </pre>
        <h3 id="themes">Themes</h3>
        <ol>
          <li>Set a brand's knobs.</li>
          <li>Pick light or dark mode.</li>
        </ol>
        <blockquote>A brand is a handful of knobs; everything else derives from them.</blockquote>
      </>
    ),
  },
}

/** Components inside Prose keep their own styles: only direct children get block styles. */
export const WithComponents: Story = {
  args: {
    children: (
      <>
        <h2 id="components">Components keep their look</h2>
        <p>The card below is a direct child, but its title and description aren't, so they keep the card's type.</p>
        <Card>
          <CardHeader>
            <CardTitle>A card in prose</CardTitle>
            <CardDescription>Its heading is an h3, styled by the card.</CardDescription>
          </CardHeader>
        </Card>
      </>
    ),
  },
}
