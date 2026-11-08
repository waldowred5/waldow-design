import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../lib/cn'

/**
 * A row of headline numbers, such as bundle sizes or test counts, each with a label and an
 * optional note. Two columns on phones, four from `lg`.
 *
 * ```tsx
 * <StatGroup>
 *   <Stat label="Entry JavaScript" value="110 kB" detail="Budget, brotli" />
 *   <Stat label="Contrast pairs checked" value="40" />
 * </StatGroup>
 * ```
 *
 * **Accessibility**
 * - A description list: each value is announced with its label (`<dt>`, with the note), so a
 *   number is never read without what it measures. The label comes first in the DOM; the value
 *   is shown above it by reversing the item's column, and nothing in it is focusable.
 */
export function StatGroup({ className, ...props }: ComponentProps<'dl'>) {
  return <dl data-slot="stat-group" className={cn('grid grid-cols-2 gap-4 lg:grid-cols-4', className)} {...props} />
}

export type StatProps = Omit<ComponentProps<'div'>, 'children'> & {
  /** What the number measures. */
  label: ReactNode
  /** The number itself, with its unit. */
  value: ReactNode
  /** A short note under the label, such as the limit or the source. */
  detail?: ReactNode
}

export function Stat({ label, value, detail, className, ...props }: StatProps) {
  return (
    <div data-slot="stat" className={cn('flex flex-col-reverse justify-end gap-1 rounded-surface border border-border bg-surface p-surface-inset shadow-raised', className)} {...props}>
      <dt className="flex flex-col gap-1 text-sm font-medium text-foreground">
        {label}
        {detail && <span className="text-xs font-normal text-muted-foreground">{detail}</span>}
      </dt>
      <dd className="font-display text-4xl font-bold tracking-tight text-foreground">{value}</dd>
    </div>
  )
}
