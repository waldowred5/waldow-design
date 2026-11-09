import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { Button } from './button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog'
import { Field } from './field'
import { Input } from './input'

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Changes are saved to your account.</DialogDescription>
        </DialogHeader>
        <Field label="Display name">
          <Input defaultValue="Ada Lovelace" />
        </Field>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Save</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Press **Edit profile** to open the dialog. The story renders closed; its play function
 * runs the keyboard flow below and leaves it closed again.
 *
 * - **Open:** click the trigger, or focus it and press Enter or Space.
 * - **Focus:** moves into the dialog on open and is trapped there: Tab and Shift+Tab cycle
 *   through its controls, and the page behind is inert.
 * - **Close:** Escape, the × button, clicking the overlay outside the panel, or either
 *   footer action. Focus returns to the trigger.
 * - **Actions:** the footer sits on the trailing edge, the primary action (Save) last and
 *   Cancel before it.
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Edit profile' })
    await step('Open from the keyboard; focus moves in', async () => {
      trigger.focus()
      await userEvent.keyboard('{Enter}')
      const dialog = await within(document.body).findByRole('dialog', { name: 'Edit profile' })
      await expect(dialog).toContainElement(document.activeElement as HTMLElement)
    })
    await step('Escape closes; focus returns to the trigger', async () => {
      await userEvent.keyboard('{Escape}')
      // Radix restores focus to the trigger after unmount, on the next tick.
      await waitFor(() => expect(trigger).toHaveFocus())
      await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument()
    })
  },
}
