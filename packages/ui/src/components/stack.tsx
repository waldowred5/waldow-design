import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import type { ComponentProps } from 'react'
import { cn } from '../lib/cn'

export const stackVariants = cva('flex', {
  variants: {
    direction: { vertical: 'flex-col', horizontal: 'flex-row' },
    gap: { 0: 'gap-0', 1: 'gap-1', 2: 'gap-2', 3: 'gap-3', 4: 'gap-4', 6: 'gap-6', 8: 'gap-8', 12: 'gap-12' },
    align: { start: 'items-start', center: 'items-center', end: 'items-end', stretch: 'items-stretch', baseline: 'items-baseline' },
    justify: { start: 'justify-start', center: 'justify-center', end: 'justify-end', between: 'justify-between' },
    wrap: { true: 'flex-wrap', false: 'flex-nowrap' },
  },
  defaultVariants: { direction: 'vertical', gap: 4 },
})

export type StackProps = ComponentProps<'div'> &
  VariantProps<typeof stackVariants> & {
    /** Render the child element (for example `<ul>` or `<section>`) as the stack. */
    asChild?: boolean
  }

/**
 * Lays children out in a row or column with a gap from the token space scale.
 * Prefer Stack over ad-hoc margins so spacing stays on the scale.
 *
 * ```tsx
 * <Stack gap={2}>…</Stack>
 * <Stack direction="horizontal" justify="between" align="center">…</Stack>
 * <Stack asChild gap={1}><ul>…</ul></Stack>
 * ```
 *
 * **Accessibility**
 * - Stack is layout only and adds no semantics. Use `asChild` to render the semantic
 *   element you need (`ul`, `nav`, `section`).
 * - Visual order follows DOM order; never reorder with CSS, or keyboard and screen
 *   reader order will diverge from what's seen.
 */
export function Stack({ className, direction, gap, align, justify, wrap, asChild = false, ...props }: StackProps) {
  const Comp = asChild ? Slot.Root : 'div'
  return <Comp data-slot="stack" className={cn(stackVariants({ direction, gap, align, justify, wrap }), className)} {...props} />
}
