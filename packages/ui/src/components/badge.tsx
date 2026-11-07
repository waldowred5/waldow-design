import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '../lib/cn'

export const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center gap-1 whitespace-nowrap rounded-badge border px-badge-x py-0.5 text-xs font-medium [&_svg]:size-3',
  {
    variants: {
      variant: {
        neutral: 'border-border bg-background-muted text-foreground',
        primary: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        highlight: 'border-highlight-border bg-highlight-subtle text-highlight-text',
        success: 'border-success-border bg-success-subtle text-success-text',
        warning: 'border-warning-border bg-warning-subtle text-warning-text',
        danger: 'border-danger-border bg-danger-subtle text-danger-text',
        info: 'border-info-border bg-info-subtle text-info-text',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
)

export type BadgeProps = ComponentProps<'span'> & VariantProps<typeof badgeVariants>

/**
 * A short, non-interactive label for status or metadata.
 *
 * ```tsx
 * <Badge variant="success">Active</Badge>
 * ```
 *
 * **Accessibility**
 * - Badges are static text. Don't put click handlers on them; use a Button.
 * - Never rely on colour alone: the text must say the status ("Failed", not just red).
 * - If a badge only makes sense next to something (a count on an icon), give that
 *   element an accessible name that includes the badge text.
 */
export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}
