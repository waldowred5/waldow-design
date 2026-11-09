import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../components/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/card'
import { Do, Dont } from '../do-dont'

const meta = { title: 'Principles/One primary action', parameters: { summary: 'At most one `primary` button per card, dialog or section' }, tags: ['!autodocs'] } satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const DoExample: Story = {
  name: 'Do',
  render: () => (
    <Do caption="One primary button for the main path; lesser actions are ghost or secondary.">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Publish changes?</CardTitle>
          <CardDescription>Your edits go live for everyone.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button>Publish</Button>
          <Button variant="ghost">Save draft</Button>
        </CardFooter>
      </Card>
    </Do>
  ),
}

export const DontExample: Story = {
  name: "Don't",
  render: () => (
    <Dont caption="Three primary buttons compete; nothing reads as the main path.">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Publish changes?</CardTitle>
          <CardDescription>Your edits go live for everyone.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button>Publish</Button>
          <Button>Save draft</Button>
          <Button>Preview</Button>
        </CardFooter>
      </Card>
    </Dont>
  ),
}
