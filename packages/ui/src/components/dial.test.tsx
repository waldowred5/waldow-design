import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { Dial } from './dial'
import { Field } from './field'

function Controlled({ initial = 0, step }: { initial?: number; step?: number }) {
  const [value, setValue] = useState(initial)
  return <Dial aria-label="Hue" value={value} onValueChange={setValue} step={step} />
}

describe('Dial', () => {
  it('steps with the arrow keys and wraps past 359', async () => {
    render(<Controlled initial={358} />)
    const dial = screen.getByRole('slider', { name: 'Hue' })
    dial.focus()
    await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowUp}')
    expect(dial).toHaveAttribute('aria-valuenow', '1')
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}')
    expect(dial).toHaveAttribute('aria-valuenow', '359')
    expect(dial).toHaveAttribute('aria-valuetext', '359 degrees')
  })

  it('moves ten steps with Page Up and returns to 0 with Home', async () => {
    render(<Controlled initial={10} step={3} />)
    const dial = screen.getByRole('slider')
    dial.focus()
    await userEvent.keyboard('{PageUp}')
    expect(dial).toHaveAttribute('aria-valuenow', '40')
    await userEvent.keyboard('{Home}')
    expect(dial).toHaveAttribute('aria-valuenow', '0')
  })

  it('keeps turning the same way across 0 instead of spinning back', () => {
    const { rerender } = render(<Dial aria-label="Hue" value={359} onValueChange={() => {}} />)
    rerender(<Dial aria-label="Hue" value={1} onValueChange={() => {}} />)
    const rim = screen.getByRole('slider').querySelector<HTMLElement>('[style*="rotate"]')
    expect(rim?.style.transform).toBe('rotate(361deg)')
  })

  it('is named by a surrounding Field', () => {
    render(
      <Field label="Brand hue">
        <Dial value={0} onValueChange={() => {}} />
      </Field>,
    )
    expect(screen.getByRole('slider', { name: 'Brand hue' })).toBeInTheDocument()
  })

  it('ignores pointer moves without a press', () => {
    let calls = 0
    render(<Dial aria-label="Hue" value={0} onValueChange={() => calls++} />)
    fireEvent.pointerMove(screen.getByRole('slider'), { clientX: 50, clientY: 50 })
    expect(calls).toBe(0)
  })
})
