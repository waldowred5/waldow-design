import { Slider as SliderPrimitive } from 'radix-ui'
import type { ComponentProps } from 'react'
import { cn } from '../lib/cn'
import { useFieldControl, useFieldLabel } from './field'

export type SliderProps = ComponentProps<typeof SliderPrimitive.Root> & {
  /** Names for the thumbs when there's no surrounding `Field`, or more than one thumb. */
  thumbLabels?: string[]
}

/**
 * Picks a number, or a range, from a continuous scale. Built on Radix Slider.
 *
 * ```tsx
 * <Field label="Volume" description="0 to 100">
 *   <Slider defaultValue={[60]} max={100} />
 * </Field>
 * <Slider defaultValue={[20, 80]} thumbLabels={['Minimum price', 'Maximum price']} />
 * ```
 *
 * **Accessibility**
 * - Each thumb is `role="slider"` with `aria-valuenow`; arrows step, Page Up/Down jump, Home/End go to the ends.
 * - Inside a `Field`, a single thumb is named by the field's label (`aria-labelledby`). Name range
 *   thumbs with `thumbLabels`.
 * - The thumb has a 2px focus outline and a boundary that meets 3:1 contrast.
 */
export function Slider({ className, thumbLabels, value, defaultValue, ...props }: SliderProps) {
  const { id, ...described } = useFieldControl()
  const label = useFieldLabel()
  const count = (value ?? defaultValue ?? [0]).length
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      value={value}
      defaultValue={defaultValue}
      className={cn('relative flex h-control-inner w-full touch-none items-center select-none data-disabled:opacity-50', className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-pill bg-background-muted">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      {Array.from({ length: count }, (_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          id={index === 0 ? id : undefined}
          aria-label={thumbLabels?.[index]}
          {...(thumbLabels?.[index] ? {} : label)}
          {...described}
          className={cn(
            'block size-control-inner rounded-pill border-2 border-primary bg-surface shadow-raised transition-transform',
            'hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
            'data-disabled:pointer-events-none',
          )}
        />
      ))}
    </SliderPrimitive.Root>
  )
}
