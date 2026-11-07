import type { Meta, StoryObj } from '@storybook/react-vite'
import { ActionBar } from './action-bar'
import { Button } from './button'

const meta = {
  title: 'Components/ActionBar',
  component: ActionBar,
  decorators: [(Story) => <div className="w-96"><Story /></div>],
} satisfies Meta<typeof ActionBar>

export default meta
type Story = StoryObj<typeof meta>

/** Lesser actions first, primary last: it lands at the trailing edge. */
export const Default: Story = {
  render: (args) => (
    <ActionBar {...args}>
      <Button variant="ghost">Cancel</Button>
      <Button>Save changes</Button>
    </ActionBar>
  ),
}

export const WithSecondary: Story = {
  render: (args) => (
    <ActionBar {...args}>
      <Button variant="ghost">Cancel</Button>
      <Button variant="secondary">Save draft</Button>
      <Button>Publish</Button>
    </ActionBar>
  ),
}

/** Right-to-left: `justify-end` follows the writing direction, so the primary action moves to the left. */
export const RightToLeft: Story = {
  render: (args) => (
    <div dir="rtl">
      <ActionBar {...args}>
        <Button variant="ghost">إلغاء</Button>
        <Button>حفظ</Button>
      </ActionBar>
    </div>
  ),
}
