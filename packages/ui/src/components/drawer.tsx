import { cva, type VariantProps } from 'class-variance-authority'
import { XIcon } from 'lucide-react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import type { ComponentProps } from 'react'
import { cn } from '../lib/cn'
import { variantOptions } from '../lib/variant-options'
import { DialogOverlay } from './dialog'

/**
 * A panel that slides in from the edge of the screen, over the page: navigation on small
 * screens, filters, or details that don't need a full page. Built on Radix Dialog, so it is
 * modal and behaves like `Dialog`.
 *
 * ```tsx
 * <Drawer>
 *   <DrawerTrigger asChild><Button variant="ghost" size="icon" aria-label="Open navigation"><MenuIcon /></Button></DrawerTrigger>
 *   <DrawerContent side="start">
 *     <DrawerTitle>Navigation</DrawerTitle>
 *     …
 *   </DrawerContent>
 * </Drawer>
 * ```
 *
 * **Accessibility**
 * - `role="dialog"` with `aria-modal`; focus moves in on open, is trapped inside and returns
 *   to the trigger on close. Escape, the close button and a click on the overlay dismiss it.
 * - `DrawerTitle` is required; hide it with `className="sr-only"` if the content makes the
 *   purpose obvious. Without a `DrawerDescription`, pass `aria-describedby={undefined}`.
 * - `start` and `end` follow the writing direction, so RTL needs no changes.
 */
export const Drawer = DialogPrimitive.Root
export const DrawerTrigger = DialogPrimitive.Trigger
export const DrawerClose = DialogPrimitive.Close

const variants = {
  side: {
    start: 'inset-y-0 start-0 border-e motion-safe:data-[state=open]:animate-slide-in-start',
    end: 'inset-y-0 end-0 border-s motion-safe:data-[state=open]:animate-slide-in-end',
  },
}

export const drawerVariants = cva(
  'fixed z-50 flex w-72 max-w-full flex-col gap-4 overflow-y-auto border-border bg-surface-raised p-surface-inset text-foreground shadow-overlay',
  { variants, defaultVariants: { side: 'start' } },
)

export const drawerVariantOptions = variantOptions(variants)

export type DrawerContentProps = ComponentProps<typeof DialogPrimitive.Content> &
  VariantProps<typeof drawerVariants> & {
    /** Show the × close button in the corner. */
    showCloseButton?: boolean
  }

export function DrawerContent({ className, children, side, showCloseButton = true, ...props }: DrawerContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content data-slot="drawer-content" className={cn(drawerVariants({ side }), className)} {...props}>
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            className={cn(
              'absolute top-4 end-4 rounded-inner p-1 text-muted-foreground transition-colors hover:text-foreground',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
            )}
          >
            <XIcon aria-hidden="true" className="size-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

export function DrawerTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title data-slot="drawer-title" className={cn('pe-8 font-display text-lg leading-tight font-semibold', className)} {...props} />
}

export function DrawerDescription({ className, ...props }: ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description data-slot="drawer-description" className={cn('text-sm text-muted-foreground', className)} {...props} />
}
