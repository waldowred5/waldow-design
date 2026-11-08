import { Prose } from '@waldow-design/ui'
import { installationHeadings as h, type Heading } from '../site'

const H2 = ({ heading }: { heading: Heading }) => <h2 id={heading.id}>{heading.title}</h2>

/** The packages are source-only for now (not on npm), so this follows the workspace setup. */
export default function InstallationPage() {
  return (
    <Prose className="max-w-3xl">
      <h1>Installation</h1>
      <p className="lead">Two packages, one stylesheet import, and every component is ready to use.</p>

      <H2 heading={h.install} />
      <p>
        The packages aren’t published to npm yet. Inside this monorepo, an app depends on them as workspace packages,
        and <code>pnpm install</code> also builds the tokens:
      </p>
      <pre>
        <code>{`"dependencies": {
  "@waldow-design/tokens": "workspace:*",
  "@waldow-design/ui": "workspace:*"
}`}</code>
      </pre>

      <H2 heading={h.styles} />
      <p>
        Import the stylesheet once from your app’s CSS entry. It brings Tailwind, the token variables and the utilities
        that map to them; Tailwind’s default palette is removed, so only tokens are available.
      </p>
      <pre>
        <code>@import "@waldow-design/ui/styles.css";</code>
      </pre>

      <H2 heading={h.use} />
      <pre>
        <code>{`import { Button, Field, Input } from '@waldow-design/ui'

<Field label="Email" error={error}>
  <Input type="email" />
</Field>
<Button>Save</Button>`}</code>
      </pre>
      <p>
        Each component’s documentation, with usage and accessibility notes, is in its JSDoc and in Storybook. Style
        anything around them with token utilities such as <code>bg-surface</code>, <code>text-muted-foreground</code>{' '}
        and <code>gap-4</code>.
      </p>

      <H2 heading={h.mode} />
      <p>
        Set <code>data-theme="light"</code> or <code>data-theme="dark"</code> on <code>&lt;html&gt;</code>, or leave
        it unset to follow the system setting. The toggle in this site’s header does exactly that.
      </p>
    </Prose>
  )
}
