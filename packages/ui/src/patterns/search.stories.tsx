import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { sampleSearchItems } from './sample-data'
import { Search } from './search'

const meta = {
  title: 'Patterns/Search',
  component: Search,
  args: { items: sampleSearchItems, onSelect: fn() },
} satisfies Meta<typeof Search>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Try it:
 * - **Open** with the button, <kbd>⌘K</kbd> / <kbd>Ctrl+K</kbd>, or <kbd>/</kbd> (when focus isn't in a text field).
 *   With an empty query the dialog lists the pages.
 * - **Type** to filter: every word must appear in a result's title or group, and title matches come first
 *   ("co" finds Colour, then Prototypes in code, then Overview in Components).
 * - **Move** through the results with <kbd>↑</kbd> and <kbd>↓</kbd>; the pointer also highlights them.
 * - **Enter** (or a click) opens the highlighted result: `onSelect` gets the item and the dialog closes.
 * - **Esc** closes without choosing and returns focus to the button.
 */
export const Default: Story = {}

/** The query "zebra" matches nothing, so opening it shows the empty state instead of an empty list. */
export const NoResults: Story = {
  args: { defaultQuery: 'zebra', shortcut: false },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Search docs' })
    await userEvent.click(trigger)
    const dialog = within(await within(document.body).findByRole('dialog', { name: 'Search docs' }))
    await expect(dialog.queryAllByRole('option')).toHaveLength(0)
    // Not toBeVisible: the dialog pops in from opacity 0, and animations stall in a background tab.
    await expect(dialog.getByText('No results for “zebra”.')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument())
    await expect(trigger).toHaveFocus()
  },
}
