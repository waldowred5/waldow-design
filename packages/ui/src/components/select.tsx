import { CheckIcon, ChevronDownIcon } from 'lucide-react'
import { Select as SelectPrimitive } from 'radix-ui'
import type { ComponentProps } from 'react'
import { cn } from '../lib/cn'
import { useFieldControl } from './field'
import { controlStyles } from './input'

/**
 * Choose one option from a list. Built on Radix Select.
 *
 * ```tsx
 * <Field label="Role">
 *   <Select defaultValue="editor">
 *     <SelectTrigger><SelectValue placeholder="Pick a role" /></SelectTrigger>
 *     <SelectContent>
 *       <SelectItem value="viewer">Viewer</SelectItem>
 *       <SelectItem value="editor">Editor</SelectItem>
 *     </SelectContent>
 *   </Select>
 * </Field>
 * ```
 *
 * **Accessibility**
 * - The trigger is a `combobox` button labelled by its Field; arrow keys open the list,
 *   typing jumps to matching items, Escape closes and returns focus.
 * - Selection is announced; the chosen item shows a check mark as well as the colour change.
 * - For fewer than about 5 options that should all be visible, prefer radio buttons.
 */
export const Select = SelectPrimitive.Root
export const SelectGroup = SelectPrimitive.Group
export const SelectValue = SelectPrimitive.Value

export function SelectTrigger({ className, children, ...props }: ComponentProps<typeof SelectPrimitive.Trigger>) {
  const field = useFieldControl()
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        controlStyles,
        'flex h-input w-full items-center justify-between gap-2 px-input-x text-sm',
        'data-placeholder:text-muted-foreground [&>span]:truncate',
        className,
      )}
      {...field}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

export function SelectContent({ className, children, position = 'popper', ...props }: ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        className={cn(
          'relative z-50 max-h-(--radix-select-content-available-height) min-w-32 overflow-hidden',
          'rounded-control border border-border bg-surface-raised text-foreground shadow-floating',
          'motion-safe:data-[state=open]:animate-fade-in',
          position === 'popper' && 'w-full min-w-(--radix-select-trigger-width) data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

export function SelectLabel({ className, ...props }: ComponentProps<typeof SelectPrimitive.Label>) {
  return <SelectPrimitive.Label data-slot="select-label" className={cn('px-2 py-1.5 text-xs font-medium text-muted-foreground', className)} {...props} />
}

export function SelectItem({ className, children, ...props }: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-inner py-1.5 pr-8 pl-2 text-sm outline-none',
        'data-highlighted:bg-background-muted data-disabled:pointer-events-none data-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <span className="absolute right-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon aria-hidden="true" className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  )
}

export function SelectSeparator({ className, ...props }: ComponentProps<typeof SelectPrimitive.Separator>) {
  return <SelectPrimitive.Separator data-slot="select-separator" className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />
}
