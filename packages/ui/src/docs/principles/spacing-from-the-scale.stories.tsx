import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../components/button'
import { Field } from '../../components/field'
import { Input } from '../../components/input'
import { Stack } from '../../components/stack'
import { Do, Dont } from '../do-dont'

const meta = { title: 'Principles/Spacing comes from the scale', parameters: { summary: '`Stack` gaps from the token scale, no arbitrary values' }, tags: ['!autodocs'] } satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const DoExample: Story = {
  name: 'Do',
  render: () => (
    <Do caption="Stack with one gap from the token scale gives an even rhythm.">
      <Stack gap={4}>
        <Field label="First name"><Input /></Field>
        <Field label="Last name"><Input /></Field>
        <Button className="self-start">Continue</Button>
      </Stack>
    </Do>
  ),
}

export const DontExample: Story = {
  name: "Don't",
  render: () => (
    <Dont caption="Ad-hoc margins drift: every gap is different and the form feels unfinished.">
      <div>
        <Field label="First name" className="mb-1"><Input /></Field>
        <Field label="Last name" className="mb-8"><Input /></Field>
        <Button className="ml-3">Continue</Button>
      </div>
    </Dont>
  ),
}
