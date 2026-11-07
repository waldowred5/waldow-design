import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../components/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/card'
import { Stack } from '../../components/stack'
import { Do, Dont } from '../do-dont'

const meta = { title: 'Principles/Primary actions sit at the trailing edge', tags: ['!autodocs'] } satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const DoExample: Story = {
  name: 'Do',
  render: () => (
    <Do caption="Lesser actions first, the primary action last, at the trailing edge of the group.">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Leave without saving?</CardTitle>
          <CardDescription>Your changes to this trip will be lost.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="ghost">Keep editing</Button>
          <Button>Save and leave</Button>
        </CardFooter>
      </Card>
    </Do>
  ),
}

export const DontExample: Story = {
  name: "Don't",
  render: () => (
    <Dont caption="Primary first on the leading edge: the eye ends on Keep editing, and it breaks the pattern of every other surface.">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Leave without saving?</CardTitle>
          <CardDescription>Your changes to this trip will be lost.</CardDescription>
        </CardHeader>
        <Stack direction="horizontal" gap={2}>
          <Button>Save and leave</Button>
          <Button variant="ghost">Keep editing</Button>
        </Stack>
      </Card>
    </Dont>
  ),
}
