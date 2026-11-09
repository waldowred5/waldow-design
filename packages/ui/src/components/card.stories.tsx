import type { Meta, StoryObj } from '@storybook/react-vite'
import { withWidth } from '../../.storybook/decorators'
import { Button } from './button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card'

const meta = {
  title: 'Components/Card',
  component: Card,
  decorators: [withWidth('w-96')],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Team members</CardTitle>
        <CardDescription>Invite people to collaborate on this project.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">3 of 5 seats used.</p>
      </CardContent>
      <CardFooter>
        <Button variant="ghost">Manage seats</Button>
        <Button>Invite</Button>
      </CardFooter>
    </Card>
  ),
}

export const ContentOnly: Story = {
  render: (args) => (
    <Card {...args}>
      <p className="text-sm">A card can hold any content.</p>
    </Card>
  ),
}
