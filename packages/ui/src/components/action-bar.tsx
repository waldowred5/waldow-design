import type { ComponentProps } from 'react'
import { cn } from '../lib/cn'

/**
 * Layout shared by every group of actions (`ActionBar`, `CardFooter`, `DialogFooter`):
 * actions sit at the trailing edge, in a row from `sm` up and full width in a column below it.
 */
export const actionBarClasses = 'flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end'

/**
 * A group of actions that closes a form, page section or panel. Put the primary action
 * **last**: see Principles/Primary actions sit at the trailing edge.
 *
 * ```tsx
 * <ActionBar>
 *   <Button variant="ghost">Cancel</Button>
 *   <Button type="submit">Send invite</Button>
 * </ActionBar>
 * ```
 *
 * Cards and dialogs have the same layout built in: use `CardFooter` and `DialogFooter`.
 *
 * **Accessibility**
 * - Visual order is DOM order, so Tab moves from the lesser actions to the primary one.
 *   Don't reorder actions with CSS.
 * - Uses `justify-end`, which follows the writing direction, so RTL needs no changes.
 */
export function ActionBar({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="action-bar" className={cn(actionBarClasses, className)} {...props} />
}
