import { XIcon } from 'lucide-react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import type { ComponentProps } from 'react'
import { cn } from '../lib/cn'
import { actionBarClasses } from './action-bar'

/**
 * A modal window that interrupts the page for a focused task or decision.
 * Built on Radix Dialog.
 *
 * ```tsx
 * <Dialog>
 *   <DialogTrigger asChild><Button>Edit profile</Button></DialogTrigger>
 *   <DialogContent>
 *     <DialogHeader>
 *       <DialogTitle>Edit profile</DialogTitle>
 *       <DialogDescription>Changes are saved to your account.</DialogDescription>
 *     </DialogHeader>
 *     …
 *     <DialogFooter>
 *       <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
 *       <Button>Save</Button>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 * ```
 *
 * **Accessibility**
 * - `role="dialog"` with `aria-modal`; focus moves in on open, is trapped inside, and
 *   returns to the trigger on close. Escape and the close button both dismiss it.
 * - `DialogTitle` is required (Radix warns without it); it names the dialog.
 *   `DialogDescription` is announced on open; omit it with `aria-describedby={undefined}`.
 * - The page behind is made inert, so screen readers can't wander out.
 */
export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close
export const DialogPortal = DialogPrimitive.Portal

export function DialogOverlay({ className, ...props }: ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn('fixed inset-0 z-50 bg-overlay motion-safe:data-[state=open]:animate-fade-in', className)}
      {...props}
    />
  )
}

export type DialogContentProps = ComponentProps<typeof DialogPrimitive.Content> & {
  /** Show the × close button in the corner. */
  showCloseButton?: boolean
}

export function DialogContent({ className, children, showCloseButton = true, ...props }: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          'fixed inset-4 z-50 m-auto grid h-fit max-w-dialog gap-4 overflow-y-auto',
          'rounded-dialog border border-border bg-dialog p-dialog-inset text-foreground shadow-dialog',
          'motion-safe:data-[state=open]:animate-pop-in',
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            className={cn(
              'absolute top-4 right-4 rounded-inner p-1 text-muted-foreground transition-colors hover:text-foreground',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
            )}
          >
            <XIcon aria-hidden="true" className="size-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

export function DialogHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="dialog-header" className={cn('flex flex-col gap-1.5 pr-6', className)} {...props} />
}

/** The dialog's actions, at the trailing edge with the primary action last (see `ActionBar`). */
export function DialogFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="dialog-footer" className={cn(actionBarClasses, className)} {...props} />
}

export function DialogTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title data-slot="dialog-title" className={cn('font-display text-lg leading-tight font-semibold', className)} {...props} />
}

export function DialogDescription({ className, ...props }: ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description data-slot="dialog-description" className={cn('text-sm text-muted-foreground', className)} {...props} />
}
