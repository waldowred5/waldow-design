import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from './checkbox'
import { Field } from './field'

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Every state. Wrap a checkbox in `<Field orientation="horizontal">` so the label sits after
 * the box and toggles it; `description` and `error` are linked with `aria-describedby`.
 */
export const States: Story = {
  render: () => (
    <div className="grid gap-x-12 gap-y-6 sm:grid-cols-2">
      <div className="flex flex-col gap-3">
        <Field label="Unchecked" orientation="horizontal">
          <Checkbox />
        </Field>
        <Field label="Checked" orientation="horizontal">
          <Checkbox defaultChecked />
        </Field>
        <Field label="Indeterminate" orientation="horizontal">
          <Checkbox checked="indeterminate" />
        </Field>
        <Field label="Disabled" orientation="horizontal">
          <Checkbox disabled />
        </Field>
        <Field label="Disabled and checked" orientation="horizontal">
          <Checkbox disabled defaultChecked />
        </Field>
      </div>
      <div className="flex max-w-xs flex-col gap-5">
        <Field label="Email me about product updates" description="About once a month. Unsubscribe any time." orientation="horizontal">
          <Checkbox defaultChecked />
        </Field>
        <Field label="I accept the terms" error="Accept the terms to continue." orientation="horizontal">
          <Checkbox />
        </Field>
      </div>
    </div>
  ),
}
