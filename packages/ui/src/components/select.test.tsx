import { composeStories } from '@storybook/react-vite'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import * as stories from './select.stories'

const { Placeholder } = composeStories(stories)

describe('Select', () => {
  it('selects an option', async () => {
    const onValueChange = vi.fn()
    render(<Placeholder onValueChange={onValueChange} />)
    const trigger = screen.getByRole('combobox', { name: 'Fruit' })
    await userEvent.click(trigger)
    await userEvent.click(await screen.findByRole('option', { name: 'Banana' }))
    expect(onValueChange).toHaveBeenCalledWith('banana')
    expect(trigger).toHaveTextContent('Banana')
  })
})
