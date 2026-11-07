import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import type { ComponentProps } from 'react'
import { cn } from '../lib/cn'

export const buttonVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-control font-medium transition-colors',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-hover',
        outline: 'border border-border-strong bg-transparent text-foreground hover:bg-background-subtle',
        ghost: 'bg-transparent text-foreground hover:bg-background-muted',
        danger: 'bg-danger text-danger-foreground hover:bg-danger-hover',
      },
      size: {
        sm: 'h-control-sm px-control-x-sm text-sm',
        md: 'h-control-md px-control-x-md text-sm',
        lg: 'h-control-lg px-control-x-lg text-base',
        icon: 'size-control-md',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    /** Render the child element (for example a link) with button styles instead of a `<button>`. */
    asChild?: boolean
  }

/**
 * Triggers an action. Use one `primary` button per surface; pair it with `secondary`
 * or `ghost` for lesser actions, and `danger` only for destructive ones.
 *
 * ```tsx
 * <Button onClick={save}>Save changes</Button>
 * <Button variant="ghost" asChild><a href="/docs">Read the docs</a></Button>
 * ```
 *
 * **Accessibility**
 * - Renders a native `<button>` (defaults to `type="button"`), so Enter and Space work.
 * - Icon-only buttons (`size="icon"`) must have an `aria-label`.
 * - With `asChild`, use it for links (`<a href>`), not for non-interactive elements.
 * - Focus is shown with a 2px `ring` outline that meets 3:1 contrast.
 */
export function Button({ className, variant, size, asChild = false, type, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button'
  return (
    <Comp
      data-slot="button"
      type={asChild ? type : (type ?? 'button')}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
