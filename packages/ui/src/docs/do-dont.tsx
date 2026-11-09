import type { ReactNode } from 'react'
import { Badge } from '../components/badge'

type ExampleProps = {
  /** What the example demonstrates, shown under the label. */
  caption: string
  children: ReactNode
}

/** Frames a "do" example in principle docs. */
export function Do({ caption, children }: ExampleProps) {
  return <Example kind="do" caption={caption}>{children}</Example>
}

/** Frames a "don't" example in principle docs. */
export function Dont({ caption, children }: ExampleProps) {
  return <Example kind="dont" caption={caption}>{children}</Example>
}

function Example({ kind, caption, children }: ExampleProps & { kind: 'do' | 'dont' }) {
  return (
    <figure className="m-0 flex w-96 flex-col gap-3">
      <div
        className={`rounded-surface border-2 bg-background p-6 ${kind === 'do' ? 'border-success-border' : 'border-danger-border'}`}
      >
        {children}
      </div>
      <figcaption className="flex items-start gap-2 text-sm">
        <Badge variant={kind === 'do' ? 'success' : 'danger'}>{kind === 'do' ? 'Do' : "Don't"}</Badge>
        <span className="text-muted-foreground">{caption}</span>
      </figcaption>
    </figure>
  )
}
