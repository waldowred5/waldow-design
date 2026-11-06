import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Field } from './field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

describe('Select', () => {
  it('is labelled by its Field and selects an option', async () => {
    const onValueChange = vi.fn()
    render(
      <Field label="Role">
        <Select onValueChange={onValueChange}>
          <SelectTrigger>
            <SelectValue placeholder="Pick one" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="viewer">Viewer</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
          </SelectContent>
        </Select>
      </Field>,
    )
    const trigger = screen.getByRole('combobox', { name: 'Role' })
    await userEvent.click(trigger)
    await userEvent.click(await screen.findByRole('option', { name: 'Editor' }))
    expect(onValueChange).toHaveBeenCalledWith('editor')
    expect(trigger).toHaveTextContent('Editor')
  })
})
