import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../components/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/card'
import { Do, Dont } from '../do-dont'

const meta = { title: 'Principles/Destructive actions explain themselves', tags: ['!autodocs'] } satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const DoExample: Story = {
  name: 'Do',
  render: () => (
    <Do caption="Say what will happen, name the thing, and label the button with the action. Use a Dialog to confirm.">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Delete “Marketing site”?</CardTitle>
          <CardDescription>This deletes 12 pages and their history. It can't be undone.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="ghost">Cancel</Button>
          <Button variant="danger">Delete project</Button>
        </CardFooter>
      </Card>
    </Do>
  ),
}

export const DontExample: Story = {
  name: "Don't",
  render: () => (
    <Dont caption="Vague copy and generic buttons make people guess, and they guess wrong.">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Are you sure?</CardTitle>
        </CardHeader>
        <CardFooter>
          <Button variant="secondary">No</Button>
          <Button>OK</Button>
        </CardFooter>
      </Card>
    </Dont>
  ),
}
