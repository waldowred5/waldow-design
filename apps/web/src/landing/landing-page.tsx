/**
 * The landing page: the case for a design system, walked through like a product page, with
 * the real components live on the page. The guide (`DOCS_PATH`) tells the same story in full;
 * each section links to its chapter there.
 */
import {
  ActionBar,
  Badge,
  Button,
  CallToAction,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FeatureGrid,
  FeatureGridItem,
  FeatureSection,
  Field,
  Hero,
  Input,
  Navbar,
  NavbarActions,
  NavbarBrand,
  Stack,
  Stat,
  StatGroup,
} from '@waldow-design/ui'
import {
  AccessibilityIcon,
  BlocksIcon,
  BotIcon,
  CameraIcon,
  GaugeIcon,
  LanguagesIcon,
  PaletteIcon,
  ShieldCheckIcon,
  SlidersHorizontalIcon,
  UsersIcon,
  ZapIcon,
} from 'lucide-react'
import { useEffect } from 'react'
import budgets from '../../../../.size-limit.json'
import { MAIN_ID, ModeToggleButton, SiteNav, SiteSearch, useFocusMainOnNavigate } from '../chrome'
import { loadDocs } from '../routes'
import { DOCS_PATH, introHeadings as intro, SITE_NAME } from '../site'
import { BrandShowcase } from './brand-showcase'
import { ComponentShowcase } from './component-showcase'

const guide = (heading: { id: string }) => `${DOCS_PATH}#${heading.id}`
const budget = (name: string) => budgets.find((entry) => entry.name === name)?.limit ?? '–'

export default function LandingPage() {
  useFocusMainOnNavigate('/')

  // Most readers head for the guide next: fetch it once the landing page has settled.
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((callback: () => void) => setTimeout(callback, 2000))
    idle(() => void loadDocs())
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <a
        href={`#${MAIN_ID}`}
        className="sr-only rounded-control bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-50"
      >
        Skip to content
      </a>
      <Navbar contained>
        <NavbarBrand href="/">{SITE_NAME}</NavbarBrand>
        <NavbarActions>
          <SiteNav />
          <SiteSearch />
          <ModeToggleButton />
        </NavbarActions>
      </Navbar>

      <main id={MAIN_ID} tabIndex={-1} className="focus:outline-none">
        <Hero
          variant="landing"
          eyebrow={<Badge variant="highlight">Tokens · components · principles · agents</Badge>}
          title="Waldow.Design"
          tagline="An exploration into design systems in the age of agents"
        >
          <Button variant="outline" asChild>
            <a href="/tools/theme-knobs">Try the theme knobs</a>
          </Button>
          <Button asChild>
            <a href={DOCS_PATH}>Read the docs</a>
          </Button>
        </Hero>
        <HeroPreview />

        <FeatureSection
          titleId="what"
          eyebrow="What it is"
          title="A kit of parts, and the rules for using them"
          description="Instead of every team drawing its own buttons and picking its own blues, everyone builds from the same pieces. Three layers, each built only from the one below."
          actions={
            <Button variant="outline" asChild>
              <a href={guide(intro.what)}>What is a design system?</a>
            </Button>
          }
        >
          <Layers />
        </FeatureSection>

        <FeatureSection
          titleId="components"
          tone="subtle"
          eyebrow="Components"
          title="Real components, not pictures of them"
          description="Everything on this page is the design system itself. Press the buttons, open the dialog, tab through the form: what you see is what ships."
          actions={
            <Button variant="outline" asChild>
              <a href="/components">Browse the components</a>
            </Button>
          }
        >
          <ComponentShowcase />
        </FeatureSection>

        <FeatureSection
          titleId="theming"
          eyebrow="Theming"
          title="One knob, every screen"
          description={
            <>
              A whole brand is three seed colours, a corner radius and a font. Pick one below and every component
              re-derives its tokens, hover shades and dark mode included. Changing the look becomes a decision you try
              in seconds, and one you can hand to your users without leaving your design.
            </>
          }
          actions={
            <Button variant="outline" asChild>
              <a href="/tools/theme-knobs">Open the theme knobs</a>
            </Button>
          }
        >
          <BrandShowcase />
        </FeatureSection>

        <FeatureSection
          titleId="prototypes"
          tone="subtle"
          layout="split"
          eyebrow="Prototypes"
          title="Prototype in code, skip the translation"
          description="Every hop between a picture and code loses something: a state nobody drew, spacing approximated in handoff notes. A prototype built from the real components has nothing to translate, and three variants cost little more than one."
          actions={
            <Button variant="outline" asChild>
              <a href={guide(intro.fidelity)}>Read about fidelity loss</a>
            </Button>
          }
        >
          <FidelityComparison />
        </FeatureSection>

        <FeatureSection
          titleId="why"
          eyebrow="Why it matters"
          title="Small decisions, made once"
          description="Producing interface code is getting cheap; judgement isn’t. So the work moves from building each pixel to building the guardrails that make the right result the easy one."
          actions={
            <Button variant="outline" asChild>
              <a href={guide(intro.why)}>Why it matters</a>
            </Button>
          }
        >
          <FeatureGrid columns={3}>
            <FeatureGridItem icon={<PaletteIcon />} title="Change once, update everywhere">
              A new brand colour is one edit. Every screen that uses it follows, in light and dark mode.
            </FeatureGridItem>
            <FeatureGridItem icon={<AccessibilityIcon />} title="Accessible by default">
              Labels, focus, contrast and keyboard support are solved once in the component, not per screen.
            </FeatureGridItem>
            <FeatureGridItem icon={<ZapIcon />} title="Faster to build">
              Teams assemble screens from parts that already work, instead of a fourth date picker.
            </FeatureGridItem>
            <FeatureGridItem icon={<LanguagesIcon />} title="One shared language">
              Design, product and engineering mean the same thing by “card” or “danger button”.
            </FeatureGridItem>
            <FeatureGridItem icon={<SlidersHorizontalIcon />} title="Cheap design decisions">
              Try a new radius or accent across the whole product without an engineering project.
            </FeatureGridItem>
            <FeatureGridItem icon={<UsersIcon />} title="Customisation for your users">
              Let customers pick an accent or a font, and it still looks like your product.
            </FeatureGridItem>
          </FeatureGrid>
        </FeatureSection>

        <FeatureSection
          titleId="agents"
          tone="subtle"
          layout="split"
          reverse
          eyebrow="Agents"
          title="Generative UI, on rails"
          description={
            <>
              With protocols like A2UI, an agent doesn’t send code. It describes a screen using only components from a
              catalog the app already trusts, and the app renders it with its own. A design system is exactly that
              catalog, so a generated screen keeps your tokens, principles and accessibility.
            </>
          }
          actions={
            <Button variant="outline" asChild>
              <a href={guide(intro.generative)}>Generative UI, safely</a>
            </Button>
          }
        >
          <AgentFlow />
        </FeatureSection>

        <FeatureSection
          titleId="quality"
          eyebrow="Quality"
          title="Fast, accessible, and checked on every change"
          description="A system that makes every page slower or harder to use isn’t helping. Every pull request runs the same gates, and the build fails when one is crossed."
          actions={
            <Button variant="outline" asChild>
              <a href={guide(intro.performance)}>Performance in the guide</a>
            </Button>
          }
        >
          <Stack gap={12}>
            <StatGroup>
              <Stat value={budget('apps/web: entry JS')} label="This site’s entry JavaScript" detail="Budget, brotli-compressed" />
              <Stat value={budget('ui: all components')} label="Every component" detail="Budget for the whole library" />
              <Stat value="AA" label="Colour contrast" detail="Every text pair, checked at build" />
              <Stat value="100%" label="Stories axe-tested" detail="In CI, on every change" />
            </StatGroup>
            <FeatureGrid columns={3}>
              <FeatureGridItem icon={<ShieldCheckIcon />} title="axe on every story">
                Each component example is rendered and scanned for accessibility problems in CI.
              </FeatureGridItem>
              <FeatureGridItem icon={<GaugeIcon />} title="Bundle budgets">
                Every package and this site has a size limit, so growth is a decision rather than an accident.
              </FeatureGridItem>
              <FeatureGridItem icon={<CameraIcon />} title="Visual tests on a budget">
                Chromatic snapshots only where a review matters, re-capturing just what a change could affect.
              </FeatureGridItem>
            </FeatureGrid>
          </Stack>
        </FeatureSection>

        <section aria-labelledby="anyone" className="border-t border-border bg-background-subtle">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 sm:py-24">
            <p className="text-sm font-semibold text-link">The principle</p>
            <h2 id="anyone" className="font-display text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl">
              Anyone can propose a prototype
            </h2>
            <blockquote className="text-xl text-balance text-muted-foreground">
              A good design system lets anyone, technical or not, submit an idea as a working prototype for design review
              and engineering, built from the real components and following the system’s principles.
            </blockquote>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <CallToAction
            title="Read the guide"
            description="The whole story, page by page: what a design system is, why it matters now, and how this one is built."
          >
            <Button variant="outline" asChild>
              <a href="/components">Browse the components</a>
            </Button>
            <Button asChild>
              <a href={DOCS_PATH}>Read the docs</a>
            </Button>
          </CallToAction>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <p>{SITE_NAME}: an exploration into design systems in the age of agents.</p>
          <p>Built only from its own components and tokens.</p>
        </div>
      </footer>
    </div>
  )
}

/** A screen made from the kit, under the hero. An illustration: inert, so it isn't in the tab order. */
function HeroPreview() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <div inert className="rounded-surface border border-border bg-background-subtle p-2 shadow-floating sm:p-3">
        <div className="grid gap-3 rounded-control bg-background p-3 sm:p-6 md:grid-cols-5">
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Invite a team member</CardTitle>
              <CardDescription>They’ll get an email with a link to join.</CardDescription>
            </CardHeader>
            <CardContent>
              <Stack gap={4}>
                <Field label="Email" description="Use their work address.">
                  <Input defaultValue="grace@example.com" />
                </Field>
                <ActionBar>
                  <Button variant="ghost">Cancel</Button>
                  <Button>Send invite</Button>
                </ActionBar>
              </Stack>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Members</CardTitle>
              <CardDescription>3 people</CardDescription>
            </CardHeader>
            <Stack gap={3} asChild>
              <ul>
                {[
                  ['Ada Lovelace', 'Owner', 'success', 'Active'],
                  ['Grace Hopper', 'Editor', 'success', 'Active'],
                  ['Alan Turing', 'Viewer', 'warning', 'Invited'],
                ].map(([name, role, variant, status]) => (
                  <li key={name} className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex flex-col">
                      <span className="font-medium">{name}</span>
                      <span className="text-muted-foreground">{role}</span>
                    </span>
                    <Badge variant={variant as 'success' | 'warning'}>{status}</Badge>
                  </li>
                ))}
              </ul>
            </Stack>
          </Card>
        </div>
      </div>
    </div>
  )
}

const layers = [
  {
    icon: <PaletteIcon />,
    title: 'Tokens',
    body: 'The decisions, named once: colours, spacing, type, corner radius, motion.',
    example: (
      <Stack direction="horizontal" gap={2} wrap>
        <Badge variant="primary">primary</Badge>
        <Badge>space-4</Badge>
        <Badge>radius-control</Badge>
      </Stack>
    ),
  },
  {
    icon: <BlocksIcon />,
    title: 'Components',
    body: 'Buttons, fields, dialogs and tables built only from tokens, with accessibility built in.',
    example: (
      <Stack direction="horizontal" gap={2} wrap inert>
        <Button size="sm" variant="outline">
          Cancel
        </Button>
        <Button size="sm">Save</Button>
      </Stack>
    ),
  },
  {
    icon: <BotIcon />,
    title: 'Principles',
    body: 'Short, checkable rules for people and agents putting the pieces together.',
    example: <Badge variant="info">One primary action per surface</Badge>,
  },
]

function Layers() {
  return (
    <ol className="grid gap-4 md:grid-cols-3">
      {layers.map((layer, index) => (
        <li key={layer.title} className="flex">
          <Card className="flex-1 gap-4">
            <CardHeader>
              <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <span aria-hidden="true" className="text-highlight-text [&_svg]:size-4">
                  {layer.icon}
                </span>
                Layer {index + 1}
              </span>
              <CardTitle>{layer.title}</CardTitle>
              <CardDescription>{layer.body}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">{layer.example}</CardContent>
          </Card>
        </li>
      ))}
    </ol>
  )
}

const handoff = [
  ['Mock-up in a design tool', 'States and edge cases'],
  ['Handoff notes', 'Exact spacing and behaviour'],
  ['Rebuilt in code', 'Whatever the notes missed'],
]
const inCode = [
  ['Prototype from real components', 'Real states, real content'],
  ['Review the running thing', 'Keyboard, dark mode, phone width'],
  ['Ship', 'Nothing to translate'],
]

function FidelityComparison() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Flow title="Pictures of code" description="Each hop translates, and loses something." steps={handoff} verb="Lost" variant="warning" />
      <Flow title="Prototypes in code" description="Already made of the real thing." steps={inCode} verb="Kept" variant="success" />
    </div>
  )
}

function Flow({
  title,
  description,
  steps,
  verb,
  variant,
}: {
  title: string
  description: string
  steps: string[][]
  verb: string
  variant: 'warning' | 'success'
}) {
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <ol className="flex flex-col gap-3 border-s-2 border-border ps-4">
        {steps.map(([step, note]) => (
          <li key={step} className="flex flex-col items-start gap-1">
            <span className="text-sm font-medium">{step}</span>
            <Badge variant={variant}>
              {verb}: {note}
            </Badge>
          </li>
        ))}
      </ol>
    </Card>
  )
}

const a2uiDescription = `{
  "component": "Card",
  "title": "Table for 4, Friday",
  "actions": [
    { "component": "Button", "variant": "ghost", "label": "Change" },
    { "component": "Button", "label": "Confirm" }
  ]
}`

function AgentFlow() {
  return (
    <ol className="grid gap-4">
      <li className="flex flex-col gap-2">
        <span className="text-sm font-semibold">1. The agent describes a screen from the catalog</span>
        <pre className="rounded-control border border-border bg-background-muted p-4 font-mono text-xs whitespace-pre-wrap">
          {a2uiDescription}
        </pre>
      </li>
      <li className="flex flex-col gap-2">
        <span className="text-sm font-semibold">2. The app checks it against what the catalog allows</span>
        <Stack direction="horizontal" gap={2} wrap>
          <Badge variant="success">Card: allowed</Badge>
          <Badge variant="success">Button: allowed</Badge>
          <Badge variant="danger">Raw HTML or scripts: rejected</Badge>
        </Stack>
      </li>
      <li className="flex flex-col gap-2">
        <span className="text-sm font-semibold">3. The app renders it with its own components</span>
        <Card inert>
          <CardHeader>
            <CardTitle>Table for 4, Friday</CardTitle>
            <CardDescription>Generated, but on-brand and accessible.</CardDescription>
          </CardHeader>
          <ActionBar>
            <Button variant="ghost">Change</Button>
            <Button>Confirm</Button>
          </ActionBar>
        </Card>
      </li>
    </ol>
  )
}
