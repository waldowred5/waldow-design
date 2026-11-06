import type { ComponentProps } from 'react'
import { cn } from '../lib/cn'

/**
 * Tabular data. Thin styling over native table elements, so all native semantics apply.
 *
 * ```tsx
 * <Table>
 *   <TableCaption>Invoices from the last 30 days</TableCaption>
 *   <TableHeader>
 *     <TableRow><TableHead>Invoice</TableHead><TableHead className="text-right">Amount</TableHead></TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow><TableCell>INV-001</TableCell><TableCell className="text-right">$250.00</TableCell></TableRow>
 *   </TableBody>
 * </Table>
 * ```
 *
 * **Accessibility**
 * - Use tables for data, never for layout.
 * - Give every table a name with `TableCaption` (visible) or `aria-label` on `Table`.
 * - `TableHead` renders `<th scope="col">`; for row headers render
 *   `<TableHead scope="row">` inside the body.
 * - The wrapper scrolls horizontally on small screens and is keyboard-focusable
 *   so the overflow can be reached without a mouse.
 */
export function Table({ className, ...props }: ComponentProps<'table'>) {
  return (
    <div
      data-slot="table-container"
      // Focusable so keyboard users can scroll overflowing tables (axe: scrollable-region-focusable).
      // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      className="relative w-full overflow-x-auto rounded-control focus-visible:outline-2 focus-visible:outline-ring"
    >
      <table data-slot="table" className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  )
}

export function TableHeader({ className, ...props }: ComponentProps<'thead'>) {
  return <thead data-slot="table-header" className={cn('[&_tr]:border-b', className)} {...props} />
}

export function TableBody({ className, ...props }: ComponentProps<'tbody'>) {
  return <tbody data-slot="table-body" className={cn('[&_tr:last-child]:border-0', className)} {...props} />
}

export function TableFooter({ className, ...props }: ComponentProps<'tfoot'>) {
  return <tfoot data-slot="table-footer" className={cn('border-t bg-background-subtle font-medium', className)} {...props} />
}

export function TableRow({ className, ...props }: ComponentProps<'tr'>) {
  return <tr data-slot="table-row" className={cn('border-b transition-colors hover:bg-row-hover data-[state=selected]:bg-background-muted', className)} {...props} />
}

export function TableHead({ className, scope = 'col', ...props }: ComponentProps<'th'>) {
  return (
    <th
      data-slot="table-head"
      scope={scope}
      className={cn('h-10 px-cell-x text-left align-middle font-medium whitespace-nowrap text-muted-foreground', className)}
      {...props}
    />
  )
}

export function TableCell({ className, ...props }: ComponentProps<'td'>) {
  return <td data-slot="table-cell" className={cn('px-cell-x py-cell-y align-middle', className)} {...props} />
}

export function TableCaption({ className, ...props }: ComponentProps<'caption'>) {
  return <caption data-slot="table-caption" className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />
}
