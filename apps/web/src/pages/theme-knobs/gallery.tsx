/**
 * The gallery the theme knobs act on: a few everyday components, each tile saying which knob
 * colours it uses. It only reads semantic tokens, so whatever `data-brand` subtree it sits in
 * decides how it looks.
 */
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
  Field,
  Input,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@waldow-design/ui'
import type { ReactNode } from 'react'

/** `linkHref` is where the sample text link points; the page passes its own URL so it stays put. */
export function KnobsGallery({ linkHref }: { linkHref: string }) {
  return (
    <div className="grid flex-1 content-start gap-6 md:grid-cols-2">
      <Tile title="Actions" uses="primary · secondary">
        <Stack direction="horizontal" gap={2} wrap>
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </Stack>
        <p className="text-sm">
          Read the <a href={linkHref} className="text-link underline">booking terms</a> before you pay.
        </p>
      </Tile>

      <Tile title="Badges" uses="primary · secondary · highlight">
        <Stack direction="horizontal" gap={2} wrap>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="highlight">Highlight</Badge>
          <Badge>Neutral</Badge>
          <Badge variant="success">Confirmed</Badge>
        </Stack>
      </Tile>

      <Card>
        <CardHeader>
          <CardTitle>Plan a weekend in Lisbon</CardTitle>
          <CardDescription>Three friends, two nights. Uses primary, secondary and the radius.</CardDescription>
        </CardHeader>
        <CardContent>
          <Stack gap={4}>
            <Field label="Trip name">
              <Input defaultValue="Lisbon long weekend" />
            </Field>
            <Field label="Share the itinerary with everyone" orientation="horizontal">
              <Checkbox defaultChecked />
            </Field>
          </Stack>
        </CardContent>
        <CardFooter>
          <Button variant="secondary">Save draft</Button>
          <Button>Book trip</Button>
        </CardFooter>
      </Card>

      <Tile title="This week" uses="primary · highlight">
        <Meter label="Bookings" value={72} fill="bg-primary" />
        <Meter label="Saved places" value={45} fill="bg-highlight" />
        <Meter label="Budget used" value={88} fill="bg-primary" />
      </Tile>

      <Tile title="Travellers" uses="secondary · highlight">
        <Stack gap={3} asChild>
          <ul>
            {[
              ['AM', 'Ana Martins', 'Organiser', true],
              ['JO', 'Jun Ohara', 'Joined today', true],
              ['RP', 'Rui Paiva', 'Invited', false],
            ].map(([initials, name, note, isNew]) => (
              <li key={name as string} className="flex items-center gap-3">
                <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-pill bg-secondary text-sm font-semibold text-secondary-foreground">
                  {initials}
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-medium">{name}</span>
                  <span className="block text-sm text-muted-foreground">{note}</span>
                </span>
                {isNew && <Badge variant="highlight">New</Badge>}
              </li>
            ))}
          </ul>
        </Stack>
      </Tile>

      <Tile title="Itinerary" uses="primary · highlight">
        <ol className="flex flex-col gap-3 border-l-2 border-border pl-4">
          {[
            ['Fri 18:40', 'Land at LIS', 'bg-primary'],
            ['Sat 10:00', 'Tram 28 and Alfama', 'bg-highlight'],
            ['Sun 13:00', 'Lunch in Belém', 'bg-primary'],
          ].map(([time, what, dot]) => (
            <li key={time} className="relative text-sm">
              <span aria-hidden="true" className={`absolute top-1.5 -left-5.5 size-3 rounded-pill ${dot}`} />
              <span className="block font-medium">{what}</span>
              <span className="block text-muted-foreground">{time}</span>
            </li>
          ))}
        </ol>
      </Tile>

      <div className="md:col-span-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Stay</TableHead>
              <TableHead>Nights</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Casa do Largo</TableCell>
              <TableCell>2</TableCell>
              <TableCell>
                <Badge variant="primary">Booked</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Hotel Lumiares</TableCell>
              <TableCell>2</TableCell>
              <TableCell>
                <Badge variant="highlight">Shortlisted</Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="md:col-span-2">
        <Card className="shadow-overlay">
          <CardHeader>
            <CardTitle>Cancel the hotel booking?</CardTitle>
            <CardDescription>A dialog, shown in place. Hotel Lumiares refunds up to 48 hours before check-in.</CardDescription>
          </CardHeader>
          <ActionBar>
            <Button variant="ghost">Keep booking</Button>
            <Button variant="danger">Cancel booking</Button>
          </ActionBar>
        </Card>
      </div>
    </div>
  )
}

function Tile({ title, uses, children }: { title: string; uses: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Uses {uses}</CardDescription>
      </CardHeader>
      <Stack gap={4}>{children}</Stack>
    </Card>
  )
}

// The figure is in the text; the bar only illustrates it, so it is hidden from assistive tech.
function Meter({ label, value, fill }: { label: string; value: number; fill: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground">{value}%</span>
      </div>
      <div aria-hidden="true" className="h-2 rounded-pill bg-background-muted">
        <div className={`h-full rounded-pill ${fill}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}
