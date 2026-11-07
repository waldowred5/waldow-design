import { CheckIcon, MinusIcon } from 'lucide-react'
import { Checkbox as CheckboxPrimitive } from 'radix-ui'
import type { ComponentProps } from 'react'
import { cn } from '../lib/cn'
import { useFieldControl } from './field'

export type CheckboxProps = ComponentProps<typeof CheckboxPrimitive.Root>

/**
 * A binary (or indeterminate) choice. Built on Radix Checkbox.
 *
 * ```tsx
 * <Field label="Email me about product updates" orientation="horizontal">
 *   <Checkbox defaultChecked />
 * </Field>
 * <Checkbox checked="indeterminate" aria-label="Select all rows" />
 * ```
 *
 * **Accessibility**
 * - Renders `role="checkbox"` with `aria-checked` (`true`, `false` or `mixed`); Space toggles it.
 * - Use `<Field orientation="horizontal">` so clicking the label toggles the box.
 * - State is shown by an icon, not colour alone. Boundary meets 3:1 contrast.
 */
export function Checkbox({ className, ...props }: CheckboxProps) {
  const field = useFieldControl()
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer grid size-checkbox shrink-0 place-content-center rounded-checkbox border border-input-border bg-input transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
        'data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground',
        'aria-invalid:border-danger disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...field}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="group grid place-content-center">
        <CheckIcon aria-hidden="true" className="size-3.5 group-data-[state=indeterminate]:hidden" strokeWidth={3} />
        <MinusIcon aria-hidden="true" className="hidden size-3.5 group-data-[state=indeterminate]:block" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}
