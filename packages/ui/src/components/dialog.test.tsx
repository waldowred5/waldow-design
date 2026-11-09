import { composeStories } from '@storybook/react-vite'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import * as stories from './dialog.stories'

const { Closed } = composeStories(stories)

// Escape closing the dialog and returning focus is the KeyboardFlow story's play
// function, which src/test/stories.test.tsx runs.
describe('Dialog', () => {
  it('opens a named modal dialog and closes with the close button', async () => {
    render(<Closed />)
    await userEvent.click(screen.getByRole('button', { name: 'Edit profile' }))
    const dialog = screen.getByRole('dialog', { name: 'Edit profile' })
    expect(dialog).toHaveAccessibleDescription('Changes are saved to your account.')
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
