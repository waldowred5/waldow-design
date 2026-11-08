import type { Meta, StoryObj } from '@storybook/react-vite'
import { MenuIcon } from 'lucide-react'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { Button } from './button'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger, drawerVariantOptions } from './drawer'
import { Stack } from './stack'

const meta = {
  title: 'Components/Drawer',
  component: DrawerContent,
  args: { side: 'start' },
  argTypes: { side: { control: 'inline-radio', options: drawerVariantOptions.side } },
  render: ({ side }) => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Open navigation">
          <MenuIcon aria-hidden="true" />
        </Button>
      </DrawerTrigger>
      <DrawerContent side={side}>
        <DrawerTitle>Navigation</DrawerTitle>
        <DrawerDescription>Every page in the docs.</DrawerDescription>
        <Stack gap={1} asChild>
          <ul>
            {['Introduction', 'Colour', 'Components', 'Theme knobs'].map((page) => (
              <li key={page}>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="#top">{page}</a>
                </Button>
              </li>
            ))}
          </ul>
        </Stack>
        <DrawerClose asChild>
          <Button variant="secondary" className="mt-auto">
            Done
          </Button>
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  ),
} satisfies Meta<typeof DrawerContent>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Press the menu button to open the drawer; switch `side` to slide it in from the other
 * edge (`start` and `end` follow the reading direction). The story renders closed; its play
 * function runs the keyboard flow below and leaves it closed again.
 *
 * - **Open:** click the trigger, or focus it and press Enter or Space.
 * - **Focus:** moves into the panel on open and is trapped there: Tab and Shift+Tab cycle
 *   through its links and buttons, and the page behind is inert.
 * - **Close:** Escape, the × button, clicking the overlay, or **Done**. Focus returns to
 *   the trigger.
 * - **Actions:** Done sits at the foot of the panel, after the content it closes.
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Open navigation' })
    await step('Open from the keyboard; focus moves in', async () => {
      trigger.focus()
      await userEvent.keyboard('{Enter}')
      const drawer = await within(document.body).findByRole('dialog', { name: 'Navigation' })
      await expect(drawer).toContainElement(document.activeElement as HTMLElement)
    })
    await step('Escape closes; focus returns to the trigger', async () => {
      await userEvent.keyboard('{Escape}')
      await waitFor(() => expect(trigger).toHaveFocus())
      await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument()
    })
  },
}
