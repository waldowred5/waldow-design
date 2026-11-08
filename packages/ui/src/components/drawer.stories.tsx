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

export const Closed: Story = {}

/** Opened by the play function, so visual tests capture the panel. */
export const Open: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Open navigation' }))
    await within(document.body).findByRole('dialog', { name: 'Navigation' })
  },
}

export const End: Story = { args: { side: 'end' }, play: Open.play }

/** Opens with the keyboard, checks focus moves in, then closes with Escape. */
export const KeyboardFlow: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Open navigation' })
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    const drawer = await within(document.body).findByRole('dialog', { name: 'Navigation' })
    await expect(drawer).toContainElement(document.activeElement as HTMLElement)
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}
