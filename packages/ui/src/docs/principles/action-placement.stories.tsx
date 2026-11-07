import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { Button } from '../../components/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/card'
import { Stack } from '../../components/stack'
import { Do, Dont } from '../do-dont'

const meta = {
  title: 'Principles/Primary actions sit at the trailing edge',
  parameters: { summary: 'Primary action last in every action group, via `CardFooter`, `DialogFooter` or `ActionBar`' },
  tags: ['!autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/** The same card in both examples; only the actions differ. */
const LeaveCard = ({ actions }: { actions: ReactNode }) => (
  <Card className="shadow-none">
    <CardHeader>
      <CardTitle>Leave without saving?</CardTitle>
      <CardDescription>Your changes to this trip will be lost.</CardDescription>
    </CardHeader>
    {actions}
  </Card>
)

export const DoExample: Story = {
  name: 'Do',
  render: () => (
    <Do caption="Lesser actions first, the primary action last, at the trailing edge of the group.">
      <LeaveCard
        actions={
          <CardFooter>
            <Button variant="ghost">Keep editing</Button>
            <Button>Save and leave</Button>
          </CardFooter>
        }
      />
    </Do>
  ),
}

export const DontExample: Story = {
  name: "Don't",
  render: () => (
    <Dont caption="Primary first on the leading edge: the eye ends on Keep editing, and it breaks the pattern of every other surface.">
      <LeaveCard
        actions={
          <Stack direction="horizontal" gap={2}>
            <Button>Save and leave</Button>
            <Button variant="ghost">Keep editing</Button>
          </Stack>
        }
      />
    </Dont>
  ),
}
