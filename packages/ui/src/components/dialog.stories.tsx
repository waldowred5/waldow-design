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

export const Closed: Story = {}

/** Open by default so visual tests capture the dialog. */
export const Open: Story = { args: { defaultOpen: true } }

/** Opens with the keyboard, checks focus moves in, then closes with Escape. */
export const KeyboardFlow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Edit profile' })
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    const dialog = await within(document.body).findByRole('dialog', { name: 'Edit profile' })
    await expect(dialog).toContainElement(document.activeElement as HTMLElement)
    await userEvent.keyboard('{Escape}')
    // Radix restores focus to the trigger after unmount, on the next tick.
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}
