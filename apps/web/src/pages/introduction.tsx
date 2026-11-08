/**
 * The guide's first page: the case for a design system, told for someone who doesn't write
 * code. The landing page (`/`) tells the same story in pictures and links here for the detail.
 * Each section's heading comes from `introHeadings` in site.ts, which also feeds search and
 * the outline.
 */
import {
  ActionBar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Prose,
  Stack,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@waldow-design/ui'
import type { ReactNode } from 'react'
import budgets from '../../../../.size-limit.json'
import { type Heading, introHeadings as h } from '../site'

function H2({ heading }: { heading: Heading }) {
  return <h2 id={heading.id}>{heading.title}</h2>
}

function H3({ heading }: { heading: Heading }) {
  return <h3 id={heading.id}>{heading.title}</h3>
}

const layers: Array<{ title: string; description: string; example: ReactNode }> = [
  {
    title: 'Tokens',
    description: 'The decisions, named once: colours, spacing, type, corner radius, motion.',
    example: (
      <Stack direction="horizontal" gap={2} wrap>
        <Badge variant="primary">primary</Badge>
        <Badge>space-4</Badge>
        <Badge>radius-control</Badge>
      </Stack>
    ),
  },
  {
    title: 'Components',
    description: 'Buttons, fields, dialogs and tables built only from tokens, with accessibility built in.',
    example: (
      // An illustration, not a control: inert keeps it out of the tab order and the accessibility tree.
      <Stack direction="horizontal" gap={2} align="center" wrap inert>
        <Button size="sm" variant="outline">
          Cancel
        </Button>
        <Button size="sm">Save</Button>
      </Stack>
    ),
  },
  {
    title: 'Principles',
    description: 'Short, checkable rules for putting the pieces together, each with a do and a don’t.',
    example: <Badge variant="info">One primary action per surface</Badge>,
  },
]

const benefits = [
  { title: 'Change once, update everywhere', body: 'A new brand colour is one edit. Every screen that uses it follows, in light and dark mode.' },
  { title: 'Accessible by default', body: 'Labels, focus, contrast and keyboard support are solved once in the component, not re-solved per screen.' },
  { title: 'Faster to build', body: 'Teams assemble screens from parts that already work, instead of rebuilding a date picker for the fourth time.' },
  { title: 'One shared language', body: 'Design, product and engineering mean the same thing by “card” or “danger button”.' },
]

const shifts = [
  { topic: 'Writing UI code', then: 'Slow and specialist', now: 'Fast: agents and generators draft screens in minutes' },
  { topic: 'The scarce skill', then: 'Implementing every pixel by hand', now: 'Deciding what’s right, and checking it' },
  { topic: 'Where effort goes', then: 'Building each screen', now: 'Guardrails: tokens, components, rules and tests' },
]

const handoff = [
  { step: 'Idea', lost: null },
  { step: 'Mock-up in a design tool', lost: 'States and edge cases' },
  { step: 'Handoff notes', lost: 'Exact spacing and behaviour' },
  { step: 'Rebuilt in code', lost: 'Whatever the notes missed' },
]

const inCode = [
  { step: 'Idea', kept: null },
  { step: 'Prototype from real components', kept: 'Real states, real content' },
  { step: 'Review the running thing', kept: 'Keyboard, dark mode, phone width' },
  { step: 'Ship', kept: 'Nothing to translate' },
]

const appBudget = (name: string) => budgets.find((budget) => budget.name === name)?.limit

export default function IntroductionPage() {
  return (
    <Stack gap={12}>
      <Prose className="max-w-3xl">
        <h1>Introduction</h1>
        <p className="lead">
          This site is a working design system and the story of why it exists. It’s written for anyone who builds
          products, whether or not you write code.
        </p>

        <H2 heading={h.what} />
        <p>
          A design system is a shared kit of parts and the rules for using them. Instead of every team drawing its own
          buttons and picking its own blues, everyone builds from the same pieces. It has three layers:
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {layers.map((layer) => (
            <Card key={layer.title} className="gap-4">
              <CardHeader>
                <CardTitle>{layer.title}</CardTitle>
                <CardDescription>{layer.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">{layer.example}</CardContent>
            </Card>
          ))}
        </div>
        <p>
          Screens are made by combining components; components are made from tokens. Change a token and everything
          above it follows.
        </p>

        <H2 heading={h.why} />
        <p>Without a system, every screen is a fresh set of small decisions, and small decisions drift.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="gap-2">
              <CardTitle>{benefit.title}</CardTitle>
              <CardDescription>{benefit.body}</CardDescription>
            </Card>
          ))}
        </div>

        <H2 heading={h.trends} />
        <p>
          Producing interface code is getting cheap. An agent can draft a settings page before the meeting about it
          ends. What stays expensive is judgement: is this the right screen, does it fit the product, does it work for
          everyone? So the work moves from building each pixel to building the guardrails that make the right result
          the easy one.
        </p>
        <Table>
          <TableCaption>Where front-end effort is moving.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">
                <span className="sr-only">Topic</span>
              </TableHead>
              <TableHead scope="col">Then</TableHead>
              <TableHead scope="col">Now</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shifts.map((shift) => (
              <TableRow key={shift.topic}>
                <TableHead scope="row">{shift.topic}</TableHead>
                <TableCell className="text-muted-foreground">{shift.then}</TableCell>
                <TableCell>{shift.now}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p>
          A design system is that set of guardrails. When a person or an agent can only reach for approved parts, fast
          output is also consistent output.
        </p>

        <H2 heading={h.prototypes} />
        <p>
          The usual way to explore an idea is to draw it in a design tool, then have engineers rebuild the drawing in
          code. With a design system in code, you can skip the drawing: assemble the idea from the real components and
          you have something that runs, in the real browser, with real behaviour. Making three versions costs little
          more than making one, so you can compare options instead of debating them.
        </p>
        <H3 heading={h.fidelity} />
        <p>
          Every time a design moves between a picture and code, something is lost in translation. A mock-up rarely
          shows every state (loading, error, empty, a name that’s too long). Handoff notes approximate spacing. Nobody
          draws keyboard order or dark mode. Each loss becomes a question, a guess or a bug.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="gap-4">
            <CardHeader>
              <CardTitle>Pictures of code</CardTitle>
              <CardDescription>Each hop translates, and loses something.</CardDescription>
            </CardHeader>
            <CardContent>
              <Stack gap={3} asChild>
                <ol>
                  {handoff.map(({ step, lost }, index) => (
                    <li key={step} className="flex flex-col gap-1">
                      <span className="text-sm font-medium">
                        {index + 1}. {step}
                      </span>
                      {lost && <Badge variant="warning">Lost: {lost}</Badge>}
                    </li>
                  ))}
                </ol>
              </Stack>
            </CardContent>
          </Card>
          <Card className="gap-4">
            <CardHeader>
              <CardTitle>Prototypes in code</CardTitle>
              <CardDescription>The prototype is already made of the real thing.</CardDescription>
            </CardHeader>
            <CardContent>
              <Stack gap={3} asChild>
                <ol>
                  {inCode.map(({ step, kept }, index) => (
                    <li key={step} className="flex flex-col gap-1">
                      <span className="text-sm font-medium">
                        {index + 1}. {step}
                      </span>
                      {kept && <Badge variant="success">Kept: {kept}</Badge>}
                    </li>
                  ))}
                </ol>
              </Stack>
            </CardContent>
          </Card>
        </div>

        <H2 heading={h.decisions} />
        <p>
          In this system a whole brand is a handful of knobs: three seed colours, a corner radius and a font. Everything
          else, from hover shades to dark mode, is derived from them. Changing the look of the product becomes a design
          decision you can try in seconds, not an engineering project that touches every screen.
        </p>
        <ActionBar>
          <Button variant="outline" asChild>
            <a href="/tools/theme-knobs">Try the theme knobs</a>
          </Button>
        </ActionBar>

        <H2 heading={h.customisation} />
        <p>
          The same knobs can be handed to your users. Let a customer pick an accent colour, or a font that suits their
          brand, and the result still looks like your product, because it’s still your components and your rules. The
          token build checks colour contrast against WCAG AA, so a choice can change the mood without making text
          unreadable.
        </p>

        <H2 heading={h.generative} />
        <p>
          Agents are starting to build interface on the fly: a booking form shaped to the question you asked, a chart
          for the data you just pulled. The risk is obvious: generated UI that’s off-brand, inaccessible, or runs code
          nobody reviewed.
        </p>
        <p>
          Protocols like <strong>A2UI</strong> (Agent-to-User Interface) take a safer route. The agent doesn’t send
          code; it sends a description of the interface, built only from a catalog of components the app already
          trusts. The app renders that description with its own components. A design system is exactly that catalog,
          so a generated screen follows the same tokens, principles and accessibility rules as a hand-built one.
        </p>
        <ol>
          <li>The agent describes a screen using names from the catalog.</li>
          <li>The app checks the description against what the catalog allows.</li>
          <li>The app renders it with its own design system components.</li>
        </ol>

        <H2 heading={h.performance} />
        <p>A system that makes every page slower isn’t helping. Two costs are worth watching from day one.</p>
        <H3 heading={h.bundle} />
        <p>
          Every component is code your users download. Here each package and the app has a size budget, and the build
          fails if a change goes over it, so growth is always a decision rather than an accident.
        </p>
        <Table>
          <TableCaption>Size budgets enforced in CI (minified and compressed).</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">What</TableHead>
              <TableHead scope="col">Budget</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              ['Every component', 'ui: all components'],
              ['A single button', 'ui: Button only (tree-shaking)'],
              ['This app’s JavaScript', 'apps/web: entry JS'],
              ['This app’s CSS', 'apps/web: CSS'],
            ].map(([label, name]) => (
              <TableRow key={name}>
                <TableCell>{label}</TableCell>
                <TableCell className="font-mono">{appBudget(name!)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <H3 heading={h.snapshots} />
        <p>
          Visual tests take a picture of every component example and flag any pixel that changed. Services like
          Chromatic charge per picture, and a free plan runs out fast. This project only takes real snapshots where a
          review matters (changes heading for the main branch), re-captures only the examples a change could affect,
          and skips work-in-progress branches. Same safety net, a fraction of the bill.
        </p>

        <H2 heading={h.anyone} />
        <blockquote>
          A good design system lets anyone, technical or not, submit an idea as a working prototype for design review
          and engineering, built from the real components and following the system’s principles.
        </blockquote>
        <p>
          That’s the bar this project sets itself. A product manager, a researcher or someone in support can ask an
          agent for a few variants of an idea. Because the agent may only use the system’s components and tokens, what
          comes back is reviewable, accessible and close to shippable, not a mock-up to be rebuilt. Designers review
          real options side by side; engineers start from code that already follows the rules.
        </p>
      </Prose>

      <ActionBar className="max-w-3xl">
        <Button variant="outline" asChild>
          <a href="/tools/theme-knobs">Try the theme knobs</a>
        </Button>
        <Button asChild>
          <a href="/components">Browse the components</a>
        </Button>
      </ActionBar>
    </Stack>
  )
}
