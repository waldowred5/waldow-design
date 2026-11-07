import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../components/button'
import { Stack } from '../../components/stack'
import { Do, Dont } from '../do-dont'

const meta = { title: 'Principles/Keyboard first', tags: ['!autodocs'] } satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const DoExample: Story = {
  name: 'Do',
  render: () => (
    <Do caption="Real buttons and links: reachable with Tab, activated with Enter or Space, with a visible focus ring.">
      <Stack direction="horizontal" gap={2}>
        <Button variant="outline" asChild>
          <a href="#history">View history</a>
        </Button>
        <Button>Save</Button>
      </Stack>
    </Do>
  ),
}

export const DontExample: Story = {
  name: "Don't",
  render: () => (
    <Dont caption="A clickable div looks like a button but can't be focused or triggered from the keyboard.">
      <Stack direction="horizontal" gap={2}>
        {/* oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- deliberate "don't" example */}
        <div onClick={() => {}} className="rounded-button bg-primary px-button-x-md py-2 text-sm font-medium text-primary-foreground">
          Save
        </div>
      </Stack>
    </Dont>
  ),
}
