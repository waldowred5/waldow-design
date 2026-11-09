import { composeStories } from '@storybook/react-vite'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import * as stories from './drawer.stories'

const { Default } = composeStories(stories)

// Opening from the keyboard, Escape closing and focus returning to the trigger are the
// Default story's play function, which src/test/stories.test.tsx runs.
describe('Drawer', () => {
  it('renders closed until the trigger is pressed', () => {
    render(<Default />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens a named modal panel and closes with the close button', async () => {
    render(<Default />)
    await userEvent.click(screen.getByRole('button', { name: 'Open navigation' }))
    const drawer = screen.getByRole('dialog', { name: 'Navigation' })
    expect(drawer).toHaveAccessibleDescription('Every page in the docs.')
    expect(drawer).toHaveClass('start-0')
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('slides in from the end edge with side="end"', async () => {
    render(<Default side="end" />)
    await userEvent.click(screen.getByRole('button', { name: 'Open navigation' }))
    expect(screen.getByRole('dialog', { name: 'Navigation' })).toHaveClass('end-0')
  })

  it('closes with Done and when the overlay is clicked, returning focus to the trigger', async () => {
    render(<Default />)
    const trigger = screen.getByRole('button', { name: 'Open navigation' })
    await userEvent.click(trigger)
    await userEvent.click(screen.getByRole('button', { name: 'Done' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await waitFor(() => expect(trigger).toHaveFocus())

    await userEvent.click(trigger)
    await userEvent.click(document.querySelector('[data-slot="dialog-overlay"]') as HTMLElement)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
