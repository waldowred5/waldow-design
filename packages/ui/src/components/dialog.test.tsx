import { composeStories } from '@storybook/react-vite'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import * as stories from './dialog.stories'

const { Default } = composeStories(stories)

// Opening from the keyboard, Escape closing and focus returning to the trigger are the
// Default story's play function, which src/test/stories.test.tsx runs.
describe('Dialog', () => {
  it('renders closed until the trigger is pressed', () => {
    render(<Default />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens a named modal dialog and closes with the close button', async () => {
    render(<Default />)
    await userEvent.click(screen.getByRole('button', { name: 'Edit profile' }))
    const dialog = screen.getByRole('dialog', { name: 'Edit profile' })
    expect(dialog).toHaveAccessibleDescription('Changes are saved to your account.')
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('traps focus inside while open', async () => {
    render(<Default />)
    await userEvent.click(screen.getByRole('button', { name: 'Edit profile' }))
    const dialog = screen.getByRole('dialog')
    for (let i = 0; i < 6; i++) {
      await userEvent.tab()
      expect(dialog).toContainElement(document.activeElement as HTMLElement)
    }
    await userEvent.tab({ shift: true })
    expect(dialog).toContainElement(document.activeElement as HTMLElement)
  })

  it('closes when the overlay is clicked and returns focus to the trigger', async () => {
    render(<Default />)
    const trigger = screen.getByRole('button', { name: 'Edit profile' })
    await userEvent.click(trigger)
    const overlay = document.querySelector('[data-slot="dialog-overlay"]') as HTMLElement
    await userEvent.click(overlay)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  it('puts the primary action last in the footer', async () => {
    render(<Default />)
    await userEvent.click(screen.getByRole('button', { name: 'Edit profile' }))
    const footer = screen.getByRole('button', { name: 'Save' }).parentElement as HTMLElement
    const names = Array.from(footer.querySelectorAll('button')).map((button) => button.textContent)
    expect(names).toEqual(['Cancel', 'Save'])
  })
})
