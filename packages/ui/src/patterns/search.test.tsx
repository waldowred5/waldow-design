import { composeStories } from '@storybook/react-vite'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { fn } from 'storybook/test'
import { describe, expect, it } from 'vitest'
import { filterSearchItems, type SearchItem } from './search'
import * as stories from './search.stories'

const { Default } = composeStories(stories)

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
  it('opens with ⌘K / Ctrl+K and closes with Escape, returning focus to the trigger', async () => {
    render(<Default />)
    await userEvent.keyboard('{Control>}k{/Control}')
    expect(screen.getByRole('combobox', { name: 'Search docs' })).toHaveFocus()
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Search docs' })).toHaveFocus()
    await userEvent.keyboard('{Meta>}k{/Meta}')
    expect(screen.getByRole('dialog', { name: 'Search docs' })).toBeInTheDocument()
  })

  it('opens with / unless focus is in a text field', async () => {
    render(
      <>
        <input aria-label="Other field" />
        <Default />
      </>,
    )
    await userEvent.click(screen.getByRole('textbox', { name: 'Other field' }))
    await userEvent.keyboard('/')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await userEvent.click(document.body)
    await userEvent.keyboard('/')
    expect(screen.getByRole('combobox', { name: 'Search docs' })).toHaveFocus()
  })

  it('filters as you type, moves with the arrow keys and opens a result with Enter', async () => {
    const onSelect = fn()
    render(<Default onSelect={onSelect} />)
    await userEvent.click(screen.getByRole('button', { name: 'Search docs' }))
    const dialog = within(screen.getByRole('dialog', { name: 'Search docs' }))
    await userEvent.type(dialog.getByRole('combobox'), 'co')
    const options = dialog.getAllByRole('option')
    expect(options.map((option) => option.textContent)).toEqual(['ColourFoundations', 'Prototypes in codeIntroduction', 'OverviewComponents'])
    expect(screen.getByRole('status')).toHaveTextContent('3 results')
    await userEvent.keyboard('{ArrowDown}')
    expect(options[1]).toHaveAttribute('aria-selected', 'true')
    await userEvent.keyboard('{Enter}')
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ title: 'Prototypes in code' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('announces the number of results', async () => {
    render(<Default defaultOpen />)
    await userEvent.type(screen.getByRole('combobox'), 'colour')
    expect(screen.getByRole('status')).toHaveTextContent('1 result')
  })

  it('says so when nothing matches', async () => {
    render(<Default />)
    await userEvent.click(screen.getByRole('button', { name: 'Search docs' }))
    await userEvent.type(screen.getByRole('combobox'), 'zebra')
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    expect(screen.getByText('No results for “zebra”.')).toBeVisible()
    expect(screen.getByRole('status')).toHaveTextContent('0 results')
  })
})
