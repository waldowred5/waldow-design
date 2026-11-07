import type { ComponentProps } from 'react'
import { cn } from '../lib/cn'
import { actionBarClasses } from './action-bar'

/**
 * Groups related content on a raised surface.
 *
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Team members</CardTitle>
 *     <CardDescription>Invite people to collaborate.</CardDescription>
 *   </CardHeader>
 *   <CardContent>…</CardContent>
 *   <CardFooter>
 *     <Button variant="ghost">Manage seats</Button>
 *     <Button>Invite</Button>
 *   </CardFooter>
 * </Card>
 * ```
 *
 * **Accessibility**
 * - A Card is a plain `<div>`; it adds no landmark. Wrap it in `<section aria-labelledby>`
 *   if it should appear in the landmark list.
 * - `CardTitle` renders an `<h3>`. If the page outline needs another level, put your
 *   own heading in `CardHeader` instead.
 * - Don't make the whole card clickable; put a real link or button inside it.
 */
export function Card({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn('flex flex-col gap-6 rounded-surface border border-border bg-surface p-surface-inset text-foreground shadow-raised', className)}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card-header" className={cn('flex flex-col gap-1.5', className)} {...props} />
}

export function CardTitle({ className, ...props }: ComponentProps<'h3'>) {
  // oxlint-disable-next-line jsx-a11y/heading-has-content -- content arrives as children via props
  return <h3 data-slot="card-title" className={cn('font-display text-lg leading-tight font-semibold', className)} {...props} />
}

export function CardDescription({ className, ...props }: ComponentProps<'p'>) {
  return <p data-slot="card-description" className={cn('text-sm text-muted-foreground', className)} {...props} />
}

export function CardContent({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn(className)} {...props} />
}

/** The card's actions, at the trailing edge with the primary action last (see `ActionBar`). */
export function CardFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card-footer" className={cn(actionBarClasses, className)} {...props} />
}
