import { ActionBar, Button, Prose } from '@waldow-design/ui'
import { DOCS_PATH } from '../site'

export function NotFoundPage() {
  return (
    <Prose className="max-w-3xl">
      <h1>Page not found</h1>
      <p className="lead">There’s no page at this address. Try search, or start from the introduction.</p>
      <ActionBar>
        <Button variant="outline" asChild>
          <a href="/">Go to the home page</a>
        </Button>
        <Button asChild>
          <a href={DOCS_PATH}>Go to the introduction</a>
        </Button>
      </ActionBar>
    </Prose>
  )
}
