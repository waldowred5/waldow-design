import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Field } from './field'
import { Slider } from './slider'

describe('Slider', () => {
  it('is named by its Field and steps with the arrow keys', async () => {
    const onValueChange = vi.fn()
    render(
      <Field label="Volume">
        <Slider defaultValue={[50]} onValueChange={onValueChange} />
      </Field>,
    )
    const thumb = screen.getByRole('slider', { name: 'Volume' })
    thumb.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(onValueChange).toHaveBeenCalledWith([51])
  })

  it('names range thumbs separately', () => {
    render(<Slider defaultValue={[10, 90]} thumbLabels={['Minimum', 'Maximum']} />)
    expect(screen.getByRole('slider', { name: 'Minimum' })).toBeInTheDocument()
    expect(screen.getByRole('slider', { name: 'Maximum' })).toBeInTheDocument()
  })
})
