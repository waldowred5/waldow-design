import {
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
} from '@waldow-ds/ui'
import { useState } from 'react'

type Theme = 'light' | 'dark'

const members = [
  { name: 'Ada Lovelace', role: 'Owner', status: 'Active' },
  { name: 'Grace Hopper', role: 'Editor', status: 'Active' },
  { name: 'Alan Turing', role: 'Viewer', status: 'Invited' },
] as const

function App() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === 'dark' ||
    (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches)
      ? 'dark'
      : 'light',
  )
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    setTheme(next)
  }

  const emailError = submitted && !email.includes('@') ? 'Enter an email address, like name@example.com.' : undefined

  return (
    <Stack asChild gap={8} className="mx-auto max-w-4xl p-6">
      <main>
        <Stack direction="horizontal" justify="between" align="center" asChild>
          <header>
            <Stack gap={1}>
              <h1 className="text-3xl font-bold">waldow.design</h1>
              <p className="text-muted-foreground">Phase 1 components, built on tokens.</p>
            </Stack>
            <Button variant="outline" onClick={toggleTheme}>
              {theme === 'dark' ? 'Light' : 'Dark'} theme
            </Button>
          </header>
        </Stack>

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
                <Stack direction="horizontal" gap={2}>
                  <Button type="submit">Send invite</Button>
                  <Button variant="ghost" type="reset" onClick={() => setSubmitted(false)}>
                    Cancel
                  </Button>
                </Stack>
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
      </main>
    </Stack>
  )
}

export default App
