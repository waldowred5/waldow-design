/* oxlint-disable jsx-a11y/prefer-tag-over-role -- a range input can't turn without end or take a circular drag */
import { type ComponentProps, type KeyboardEvent, type PointerEvent, type ReactNode, useRef, useState } from 'react'
import { cn } from '../lib/cn'
import { useFieldLabel } from './field'

export type DialProps = Omit<ComponentProps<'div'>, 'children' | 'onChange' | 'defaultValue'> & {
  /** The angle in degrees, 0 to 359. */
  value: number
  /** Called with the new angle (0 to 359) as the dial is dragged or stepped with the keyboard. */
  onValueChange: (value: number) => void
  /** Degrees per arrow-key press. Page Up/Down move ten steps. */
  step?: number
  /** What a screen reader announces for a value. Defaults to "N degrees". */
  valueText?: (value: number) => string
  size?: 'md' | 'lg'
  /** Tick marks around the rim; every fifth is a major tick. */
  ticks?: number
  /** Shown in the middle. It doesn't rotate, and is hidden from assistive technology (the value is announced instead). */
  children?: ReactNode
}

const wrap = (degrees: number) => ((degrees % 360) + 360) % 360
/** The shortest signed turn from one angle to another, so 359 → 1 is +2 rather than -358. */
const shortest = (from: number, to: number) => ((((to - from) % 360) + 540) % 360) - 180

const sizes = { md: 'size-40', lg: 'size-56' }

/**
 * A rotary control for a cyclic value, such as a hue or a heading. It turns without end: going past
 * 359 carries on to 0, and the rim keeps rotating rather than spinning back.
 *
 * ```tsx
 * const [hue, setHue] = useState(277)
 * <Dial aria-label="Hue" value={hue} onValueChange={setHue}>{hue}°</Dial>
 * ```
 *
 * **Accessibility**
 * - `role="slider"` with `aria-valuenow` and `aria-valuetext`. Name it with `aria-label`, or put it
 *   in a `Field`, which labels it.
 * - Arrows step (Right/Up increase), Page Up/Down move ten steps, Home goes to 0.
 * - Drag anywhere on the dial: the angle follows the pointer around the centre, like a physical knob.
 * - 2px focus outline; the grip and index mark don't rely on colour alone (position shows the value).
 */
export function Dial({
  value,
  onValueChange,
  step = 1,
  valueText = (degrees) => `${degrees} degrees`,
  size = 'md',
  ticks = 60,
  className,
  children,
  ...props
}: DialProps) {
  const label = useFieldLabel()

  // The rim's rotation is the value unwrapped: each change adds the shortest turn to it, so the
  // dial keeps turning the same way past 0 instead of spinning back. Adjusted while rendering
  // (React's "storing information from previous renders" pattern), so it never lags a frame.
  const [track, setTrack] = useState({ value, rotation: value })
  let rotation = track.rotation
  if (value !== track.value) {
    rotation = track.rotation + shortest(track.value, value)
    setTrack({ value, rotation })
  }

  const drag = useRef<{ angle: number; value: number } | null>(null)
  const [dragging, setDragging] = useState(false)

  const pointerAngle = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - (box.left + box.width / 2)
    const y = event.clientY - (box.top + box.height / 2)
    return (Math.atan2(y, x) * 180) / Math.PI + 90
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    event.currentTarget.focus()
    // Grab the dial where the pointer is, without jumping: only the turn from here counts.
    drag.current = { angle: pointerAngle(event), value }
    setDragging(true)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    const angle = pointerAngle(event)
    drag.current.value += shortest(drag.current.angle, angle)
    drag.current.angle = angle
    const next = wrap(Math.round(drag.current.value))
    if (next !== value) onValueChange(next)
  }

  const endDrag = () => {
    drag.current = null
    setDragging(false)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = {
      ArrowRight: step,
      ArrowUp: step,
      ArrowLeft: -step,
      ArrowDown: -step,
      PageUp: step * 10,
      PageDown: -step * 10,
    }
    if (event.key === 'Home') onValueChange(0)
    else if (event.key in moves) onValueChange(wrap(value + moves[event.key]!))
    else return
    event.preventDefault()
  }

  return (
    <div
      data-slot="dial"
      role="slider"
      tabIndex={0}
      aria-valuemin={0}
      aria-valuemax={359}
      aria-valuenow={value}
      aria-valuetext={valueText(value)}
      {...label}
      data-dragging={dragging || undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={onKeyDown}
      className={cn(
        'group relative grid shrink-0 cursor-grab touch-none place-items-center rounded-pill select-none',
        'border border-border-strong bg-surface shadow-floating',
        'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring data-dragging:cursor-grabbing',
        sizes[size],
        className,
      )}
      {...props}
    >
      {/* The index mark: fixed at the top, it shows where the value is read. */}
      <span aria-hidden className="absolute -top-2 left-1/2 h-3 w-1 -translate-x-1/2 rounded-pill bg-foreground" />

      {/* The rim turns with the value. Short ease between keyboard steps and external changes; none while dragging. */}
      <div
        aria-hidden
        className="absolute inset-2 rounded-pill transition-transform duration-(--ds-motion-duration-normal) ease-linear group-data-dragging:transition-none motion-reduce:transition-none"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {Array.from({ length: ticks }, (_, index) => (
          <div key={index} className="absolute inset-0" style={{ transform: `rotate(${(index * 360) / ticks}deg)` }}>
            <span
              className={cn(
                'mx-auto block w-px rounded-pill',
                index % 5 === 0 ? 'h-3 bg-muted-foreground' : 'h-1.5 bg-border-strong',
              )}
            />
          </div>
        ))}
        {/* The grip: a raised dot the finger "holds". */}
        <span className="absolute top-5 left-1/2 size-3 -translate-x-1/2 rounded-pill bg-primary shadow-raised ring-2 ring-surface" />
      </div>

      <div aria-hidden className="relative grid place-items-center rounded-pill text-center">
        {children}
      </div>
    </div>
  )
}
