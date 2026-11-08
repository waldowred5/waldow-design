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
 * - A description list: each value is announced with its label (`<dt>`), so a number is never
 *   read without what it measures. The label comes first in the DOM and the value is shown
 *   larger above it with CSS order only within its own item.
 */
export function StatGroup({ className, ...props }: ComponentProps<'dl'>) {
  return <dl data-slot="stat-group" className={cn('grid grid-cols-2 gap-px overflow-hidden rounded-surface border border-border bg-border lg:grid-cols-4', className)} {...props} />
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
    <div data-slot="stat" className={cn('flex flex-col gap-1 bg-surface p-surface-inset', className)} {...props}>
      <dt className="order-2 text-sm font-medium text-foreground">{label}</dt>
      <dd className="order-1 font-display text-3xl font-bold tracking-tight text-foreground">{value}</dd>
      {detail && <dd className="order-3 text-xs text-muted-foreground">{detail}</dd>}
    </div>
  )
}
