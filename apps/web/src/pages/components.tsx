import { Prose, Stack } from '@waldow-design/ui'
import { componentsHeadings as h } from '../site'
import { ComponentsDemo } from './components-demo'

export default function ComponentsPage() {
  return (
    <Stack gap={8}>
      <Prose className="max-w-3xl">
        <h1>Components</h1>
        <p className="lead">
          The components working together in one small workspace screen: a form, a table, status badges and a
          confirmation dialog. Every one is built only from tokens and passes axe.
        </p>
        <h2 id={h.workspace.id}>{h.workspace.title}</h2>
      </Prose>
      <ComponentsDemo />
    </Stack>
  )
}
