import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { sampleSearchItems } from './sample-data'
import { Search } from './search'

const meta = {
  title: 'Patterns/Search',
  component: Search,
  args: { items: sampleSearchItems, onSelect: fn(), shortcut: false },
} satisfies Meta<typeof Search>

export default meta
type Story = StoryObj<typeof meta>

export const Closed: Story = {}

/** Open with an empty query: the pages are listed. */
export const Open: Story = { args: { defaultOpen: true } }

/** Types a query (title matches come before group matches), moves to the second result with the arrow key and opens it with Enter. */
export const KeyboardFlow: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Search docs' }))
    const dialog = within(await within(document.body).findByRole('dialog', { name: 'Search docs' }))
    const box = dialog.getByRole('combobox', { name: 'Search docs' })
    await expect(box).toHaveFocus()
    await userEvent.type(box, 'co')
    const options = dialog.getAllByRole('option')
    await expect(options.map((option) => option.textContent)).toEqual(['ColourFoundations', 'Prototypes in codeIntroduction', 'OverviewComponents'])
    await userEvent.keyboard('{ArrowDown}')
    await expect(options[1]).toHaveAttribute('aria-selected', 'true')
    await userEvent.keyboard('{Enter}')
    await expect(args.onSelect).toHaveBeenCalledWith(expect.objectContaining({ title: 'Prototypes in code' }))
  },
}

/** Nothing matches: the dialog says so instead of showing an empty list. */
export const NoResults: Story = {
  args: { defaultOpen: true },
  play: async () => {
    const box = await within(document.body).findByRole('combobox', { name: 'Search docs' })
    await userEvent.type(box, 'zebra')
    await expect(within(document.body).getByText('No results for “zebra”.')).toBeVisible()
  },
}
