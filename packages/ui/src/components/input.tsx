import type { ComponentProps } from 'react'
import { cn } from '../lib/cn'
import { useFieldControl } from './field'

export const controlStyles = [
  'rounded-input border border-input-border bg-input text-foreground transition-colors',
  'focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring',
  'aria-invalid:border-danger aria-invalid:focus-visible:outline-danger',
  'disabled:cursor-not-allowed disabled:opacity-50',
]

export type InputProps = ComponentProps<'input'>

/**
 * Single-line text entry. Wrap in a `<Field>` to give it a label, help text and errors.
 *
 * ```tsx
 * <Field label="Name"><Input placeholder="Ada Lovelace" /></Field>
 * ```
 *
 * **Accessibility**
 * - Always needs a label: use `<Field>`, or pass `aria-label` when a visible label isn't possible.
 * - Don't use `placeholder` as the label; it disappears on input and has low contrast.
 * - Use the right `type` and `autoComplete` so mobile keyboards and autofill work.
 * - Inside a Field with an `error`, it's marked `aria-invalid` and the border turns `danger`.
 */
export function Input({ className, type = 'text', ...props }: InputProps) {
  const field = useFieldControl()
  return (
    <input
      data-slot="input"
      type={type}
      className={cn(
        controlStyles,
        'h-input w-full min-w-0 px-input-x text-sm placeholder:text-muted-foreground',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
        className,
      )}
      {...field}
      {...props}
    />
  )
}
