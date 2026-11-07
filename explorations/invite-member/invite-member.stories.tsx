/**
 * Exploration: inviting a team member. Three directions for the same task.
 * Throwaway: compare in Chromatic, pick one, then build it properly in the app.
 */
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@waldow-ds/ui'

const meta = {
  title: 'Explorations/Invite member',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function RoleSelect() {
  return (
    <Select defaultValue="editor">
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="viewer">Viewer</SelectItem>
        <SelectItem value="editor">Editor</SelectItem>
        <SelectItem value="owner">Owner</SelectItem>
      </SelectContent>
    </Select>
  )
}

/** The fields every variant shares, so the variants differ only in where the form lives. */
function InviteFields() {
  return (
    <Stack gap={4}>
      <Field label="Email">
        <Input type="email" />
      </Field>
      <Field label="Role">
        <RoleSelect />
      </Field>
    </Stack>
  )
}

const heading = 'Invite a team member'
const description = "They'll get an email with a link to join."

/** A: inline form card at the top of the members page. Fast for repeat invites. */
export const A_InlineCard: Story = {
  name: 'A: inline card',
  render: () => (
    <Card className="max-w-dialog">
      <CardHeader>
        <CardTitle>{heading}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <InviteFields />
      </CardContent>
      <CardFooter>
        <Button>Send invite</Button>
      </CardFooter>
    </Card>
  ),
}

/** B: a dialog from a single button. Keeps the members list uncluttered. */
export const B_Dialog: Story = {
  name: 'B: dialog',
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Invite member</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{heading}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <InviteFields />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button>Send invite</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

/** C: invite as an empty row in the members table. Shows pending invites in context. */
export const C_TableRow: Story = {
  name: 'C: table row',
  render: () => (
    <Table aria-label="Members">
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>ada@example.com</TableCell>
          <TableCell>Owner</TableCell>
          <TableCell>
            <Badge variant="success">Active</Badge>
          </TableCell>
          <TableCell />
        </TableRow>
        <TableRow>
          <TableCell>
            <Input type="email" aria-label="Email to invite" placeholder="name@example.com" />
          </TableCell>
          <TableCell>
            <Select defaultValue="editor">
              <SelectTrigger aria-label="Role for new member">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">Viewer</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
              </SelectContent>
            </Select>
          </TableCell>
          <TableCell>
            <Badge>New</Badge>
          </TableCell>
          <TableCell>
            <Button size="sm">Invite</Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}
