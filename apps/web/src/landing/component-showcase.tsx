/** Live components on the landing page: press, type, tab and open them. */
import {
  ActionBar,
  Badge,
  Button,
  Card,
  CardDescription,
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
} from '@waldow-design/ui'
import type { ReactNode } from 'react'

export function ComponentShowcase() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Tile title="Buttons" description="One primary action per surface, at the trailing edge.">
        <Stack direction="horizontal" gap={2} wrap>
          <Button variant="ghost">Ghost</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button>Primary</Button>
        </Stack>
      </Tile>

      <Tile title="Badges" description="Status in words, never colour alone.">
        <Stack direction="horizontal" gap={2} wrap>
          <Badge variant="success">Confirmed</Badge>
          <Badge variant="warning">Pending</Badge>
          <Badge variant="danger">Failed</Badge>
          <Badge variant="info">New</Badge>
          <Badge variant="highlight">Featured</Badge>
        </Stack>
      </Tile>

      <Tile title="Dialog" description="Focus moves in, Escape closes, focus comes back.">
        <ActionBar>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="danger">Delete project</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete this project?</DialogTitle>
                <DialogDescription>It’s a demo, so nothing is deleted. A real one would say what’s lost.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Keep project</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant="danger">Delete project</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </ActionBar>
      </Tile>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Forms</CardTitle>
          <CardDescription>Every field has a label, a hint and an error slot wired up for screen readers.</CardDescription>
        </CardHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" description="We’ll never share it.">
            <Input type="email" placeholder="name@example.com" autoComplete="off" />
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
          <Field label="Send me a copy" orientation="horizontal">
            <Checkbox defaultChecked />
          </Field>
        </div>
      </Card>

      <Tile title="Tokens" description="The decisions underneath, named once.">
        <Stack direction="horizontal" gap={2} wrap>
          <Badge variant="primary">primary</Badge>
          <Badge variant="secondary">secondary</Badge>
          <Badge>space-4</Badge>
          <Badge>radius-control</Badge>
          <Badge>shadow-raised</Badge>
        </Stack>
      </Tile>
    </div>
  )
}

function Tile({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <div className="mt-auto">{children}</div>
    </Card>
  )
}
