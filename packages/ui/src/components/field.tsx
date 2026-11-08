import { Label } from 'radix-ui'
import { createContext, type ReactNode, useContext, useId } from 'react'
import { cn } from '../lib/cn'

type FieldContextValue = {
  id: string
  labelId: string
  describedBy: string | undefined
  invalid: boolean
  required: boolean
}

const FieldContext = createContext<FieldContextValue | null>(null)

/**
 * `aria-labelledby` for controls a `<label for>` can't name, such as a `role="slider"` element
 * that isn't a native input (Slider thumbs, Dial). Empty outside a Field.
 */
export function useFieldLabel() {
  const field = useContext(FieldContext)
  return field ? { 'aria-labelledby': field.labelId } : {}
}

/**
 * Props a form control should spread to be wired to its surrounding `<Field>`.
 * Returns an empty object outside a Field, so controls work standalone too.
 */
export function useFieldControl() {
  const field = useContext(FieldContext)
  if (!field) return {}
  return {
    id: field.id,
    'aria-describedby': field.describedBy,
    'aria-invalid': field.invalid || undefined,
    'aria-required': field.required || undefined,
  }
}

export type FieldProps = {
  /** Visible label. Required: every control needs an accessible name. */
  label: ReactNode
  /** Help text shown under the label. */
  description?: ReactNode
  /** Error message. When set, the control is marked `aria-invalid`. */
  error?: ReactNode
  required?: boolean
  /** `horizontal` puts the control before the label, for checkboxes. */
  orientation?: 'vertical' | 'horizontal'
  /** Override the generated control id. */
  id?: string
  className?: string
  children: ReactNode
}

/**
 * Wraps a form control with its label, description and error, and wires up the
 * ids so assistive technology announces them together.
 *
 * ```tsx
 * <Field label="Email" description="We'll never share it." error={errors.email} required>
 *   <Input type="email" />
 * </Field>
 * ```
 *
 * **Accessibility**
 * - The label is a real `<label for>` pointing at the control.
 * - Description and error are linked with `aria-describedby`; errors use `role="alert"`
 *   so they're announced when they appear.
 * - `required` sets `aria-required` and shows a visual marker hidden from screen readers.
 */
export function Field({ label, description, error, required = false, orientation = 'vertical', id, className, children }: FieldProps) {
  const generated = useId()
  const controlId = id ?? `field-${generated}`
  const labelId = `${controlId}-label`
  const descriptionId = description ? `${controlId}-description` : undefined
  const errorId = error ? `${controlId}-error` : undefined
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined

  const labelNode = (
    <Label.Root id={labelId} htmlFor={controlId} className="text-sm font-medium text-foreground">
      {label}
      {required && (
        <span aria-hidden="true" className="text-danger-text">
          {' *'}
        </span>
      )}
    </Label.Root>
  )

  return (
    <FieldContext.Provider value={{ id: controlId, labelId, describedBy, invalid: Boolean(error), required }}>
      <div data-slot="field" className={cn('flex flex-col gap-1.5', className)}>
        {orientation === 'horizontal' ? (
          <div className="flex items-center gap-2">
            {children}
            {labelNode}
          </div>
        ) : (
          <>
            {labelNode}
            {children}
          </>
        )}
        {description && (
          <p id={descriptionId} className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
        {error && (
          <p id={errorId} role="alert" className="text-sm font-medium text-danger-text">
            {error}
          </p>
        )}
      </div>
    </FieldContext.Provider>
  )
}
