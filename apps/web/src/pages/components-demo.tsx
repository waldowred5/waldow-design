import {
  ActionBar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@waldow-design/ui'
import { useState } from 'react'

const members = [
  { name: 'Ada Lovelace', role: 'Owner', status: 'Active' },
  { name: 'Grace Hopper', role: 'Editor', status: 'Active' },
  { name: 'Alan Turing', role: 'Viewer', status: 'Invited' },
] as const

/** The Phase 1 components in one small workspace screen. */
export function ComponentsDemo() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const emailError = submitted && !email.includes('@') ? 'Enter an email address, like name@example.com.' : undefined

  return (
    <Stack gap={8} className="mx-auto max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Invite a team member</CardTitle>
          <CardDescription>They'll get an email with a link to join.</CardDescription>
        </CardHeader>
        <CardContent>
          <Stack asChild gap={4}>
            <form
              noValidate
              onSubmit={(event) => {
                event.preventDefault()
                setSubmitted(true)
              }}
            >
              <Field label="Email" description="Use their work address." error={emailError} required>
                <Input type="email" autoComplete="off" value={email} onChange={(event) => setEmail(event.target.value)} />
              </Field>
              <Field label="Role">
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
              </Field>
              <Field label="Send a copy to me" orientation="horizontal">
                <Checkbox defaultChecked />
              </Field>
              <ActionBar>
                <Button variant="ghost" type="reset" onClick={() => setSubmitted(false)}>
                  Cancel
                </Button>
                <Button type="submit">Send invite</Button>
              </ActionBar>
            </form>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Everyone with access to this workspace.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.name}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    <Badge variant={member.status === 'Active' ? 'success' : 'warning'}>{member.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="danger">Remove all members</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Remove all members?</DialogTitle>
                <DialogDescription>Everyone except you loses access. You can invite them again later.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant="danger">Remove members</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>

      <Stack direction="horizontal" gap={2} wrap>
        <Badge>Neutral</Badge>
        <Badge variant="primary">Primary</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="danger">Danger</Badge>
        <Badge variant="info">Info</Badge>
      </Stack>
    </Stack>
  )
}
