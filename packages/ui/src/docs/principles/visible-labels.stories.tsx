import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field } from '../../components/field'
import { Input } from '../../components/input'
import { Stack } from '../../components/stack'
import { Do, Dont } from '../do-dont'

const meta = { title: 'Principles/Labels stay visible', tags: ['!autodocs'] } satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const DoExample: Story = {
  name: 'Do',
  render: () => (
    <Do caption="Every control has a visible label from Field; hints go in the description.">
      <Stack gap={4}>
        <Field label="Email" description="Use your work address.">
          <Input type="email" />
        </Field>
        <Field label="Password">
          <Input type="password" />
        </Field>
      </Stack>
    </Do>
  ),
}

export const DontExample: Story = {
  name: "Don't",
  render: () => (
    <Dont caption="Placeholders as labels vanish on typing, fail contrast and leave people guessing what a filled field was.">
      <Stack gap={4}>
        <Input type="email" aria-label="Email" placeholder="Email (work address)" />
        <Input type="password" aria-label="Password" placeholder="Password" />
      </Stack>
    </Dont>
  ),
}
