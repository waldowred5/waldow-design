import type { Meta, StoryObj } from '@storybook/react-vite'
import { withWidth } from '../../.storybook/decorators'
import { ActionBar } from './action-bar'
import { Button } from './button'

const meta = {
  title: 'Components/ActionBar',
  component: ActionBar,
  decorators: [withWidth('w-96')],
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
  decorators: [
    (Story) => (
      <div dir="rtl">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <ActionBar {...args}>
      <Button variant="ghost">إلغاء</Button>
      <Button>حفظ</Button>
    </ActionBar>
  ),
}
