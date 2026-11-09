import { Badge, Card, CardDescription, Prose } from '@waldow-design/ui'
import type { Page } from '../site'

/** What each page will cover, for pages whose content lands in a later ticket. */
const upcoming: Record<string, string> = {
  '/foundations/colour': 'The colour scales, the semantic roles built on them, and the contrast pairs the build checks.',
  '/foundations/typography': 'The body and display fonts, the type scale and line heights.',
  '/foundations/spacing': 'The space scale, and the control, surface and cell sizes named for the shapes they serve.',
  '/how-its-built/tokens': 'How brand knobs in JSON become CSS variables, and where hex values remain for tools that need them.',
  '/how-its-built/quality': 'Each CI gate: lint and the tokens-only check, types, axe on every story, bundle budgets and Chromatic.',
  '/how-its-built/workflow': 'Linear tickets, stacked PRs, prototype variants as stories, and how a variant becomes a component.',
}

/** A page whose content isn't written yet: its title, lead and what it will cover. */
export function StubPage({ page }: { page: Page }) {
  return (
    <Prose className="max-w-3xl">
      <h1>{page.title}</h1>
      <p className="lead">{page.description}</p>
      <Card className="gap-2">
        <Badge variant="info">Coming soon</Badge>
        <CardDescription>{upcoming[page.path] ?? 'This page is being written.'}</CardDescription>
      </Card>
    </Prose>
  )
}
