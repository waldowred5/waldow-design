import { composeStories } from '@storybook/react-vite'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { filterSearchItems, type SearchItem } from './search'
import * as stories from './search.stories'

const { Closed } = composeStories(stories)

const items: SearchItem[] = [
  { id: 'colour', title: 'Colour', group: 'Foundations', href: '/foundations/colour' },
  { id: 'colour-roles', title: 'Roles', group: 'Colour', href: '/foundations/colour#roles' },
  { id: 'tokens', title: 'Token pipeline', group: "How it's built", href: '/how-its-built/tokens' },
]

describe('filterSearchItems', () => {
  it('lists only pages for an empty query', () => {
    expect(filterSearchItems(items, '  ').map((item) => item.id)).toEqual(['colour', 'tokens'])
  })

  it('matches every word against title and group, title matches first', () => {
    expect(filterSearchItems(items, 'colour').map((item) => item.id)).toEqual(['colour', 'colour-roles'])
    expect(filterSearchItems(items, 'roles COLOUR').map((item) => item.id)).toEqual(['colour-roles'])
    expect(filterSearchItems(items, 'built token').map((item) => item.id)).toEqual(['tokens'])
    expect(filterSearchItems(items, 'tokens').map((item) => item.id)).toEqual(['tokens'])
  })
})

describe('Search', () => {
  it('opens with the keyboard shortcut and closes with Escape', async () => {
    render(<Closed shortcut />)
    await userEvent.keyboard('{Control>}k{/Control}')
    expect(screen.getByRole('combobox', { name: 'Search docs' })).toHaveFocus()
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('announces the number of results', async () => {
    render(<Closed defaultOpen />)
    await userEvent.type(screen.getByRole('combobox'), 'colour')
    expect(screen.getByRole('status')).toHaveTextContent('1 result')
  })
})
