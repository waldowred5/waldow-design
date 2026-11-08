import { composeStories } from '@storybook/react-vite'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import * as stories from './drawer.stories'

const { Closed } = composeStories(stories)

// Escape closing the drawer and returning focus is the KeyboardFlow story's play function.
describe('Drawer', () => {
  it('opens a named modal panel and closes with the close button', async () => {
    render(<Closed />)
    await userEvent.click(screen.getByRole('button', { name: 'Open navigation' }))
    const drawer = screen.getByRole('dialog', { name: 'Navigation' })
    expect(drawer).toHaveAccessibleDescription('Every page in the docs.')
    expect(drawer).toHaveClass('start-0')
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
