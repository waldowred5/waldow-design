/**
 * The site map: every docs page's path, sidebar section, title and headings. The sidebar,
 * search, the "On this page" outline and document titles all read from here, and pages render
 * their headings from it too, so a heading can't drift from what search and the outline show.
 *
 * The landing page (`/`) sits outside the docs: it has its own full-width layout, and links
 * into the guide at `DOCS_PATH`.
 */
export type Heading = { id: string; title: string; level?: 2 | 3 }

export type Page = {
  path: string
  title: string
  section: Section
  /** One sentence: the page's lead paragraph and its search description. */
  description: string
  headings: Heading[]
}

export const sections = ['Getting started', 'Foundations', 'Components', 'Tools', "How it's built"] as const
export type Section = (typeof sections)[number]

export const SITE_NAME = 'waldow.design'

/** Where the navbar's "Docs" link goes: the first page of the guide. */
export const DOCS_PATH = '/getting-started/introduction'

/** The introduction's sections, in order. The page renders each one under its heading. */
export const introHeadings = {
  what: { id: 'what-is-a-design-system', title: 'What is a design system?' },
  why: { id: 'why-it-matters', title: 'Why it matters' },
  trends: { id: 'how-front-end-work-is-changing', title: 'How front-end work is changing' },
  prototypes: { id: 'prototypes-in-code', title: 'Prototypes in code, not pictures of code' },
  fidelity: { id: 'fidelity-loss', title: 'Fidelity loss', level: 3 },
  decisions: { id: 'cheap-design-decisions', title: 'Design decisions that cost almost nothing' },
  customisation: { id: 'customisation-for-your-users', title: 'Customisation for your users' },
  generative: { id: 'generative-ui-safely', title: 'Generative UI, safely' },
  performance: { id: 'performance', title: 'Performance' },
  bundle: { id: 'bundle-size', title: 'Bundle size', level: 3 },
  snapshots: { id: 'visual-tests-on-a-budget', title: 'Visual tests on a budget', level: 3 },
  anyone: { id: 'anyone-can-prototype', title: 'Anyone can propose a prototype' },
} satisfies Record<string, Heading>

export const componentsHeadings = {
  workspace: { id: 'workspace-example', title: 'Workspace example' },
} satisfies Record<string, Heading>

export const pages: Page[] = [
  {
    path: DOCS_PATH,
    title: 'Introduction',
    section: 'Getting started',
    description: 'What a design system is, why it matters now, and how this one is built.',
    headings: Object.values(introHeadings),
  },
  {
    path: '/foundations/colour',
    title: 'Colour',
    section: 'Foundations',
    description: 'Three seed colours expand into scales, then into semantic roles for light and dark mode.',
    headings: [],
  },
  {
    path: '/foundations/typography',
    title: 'Typography',
    section: 'Foundations',
    description: 'Two font roles, body and display, and one type scale.',
    headings: [],
  },
  {
    path: '/foundations/spacing',
    title: 'Spacing',
    section: 'Foundations',
    description: 'One space scale, and the semantic sizes and insets built from it.',
    headings: [],
  },
  {
    path: '/components',
    title: 'Overview',
    section: 'Components',
    description: 'The components working together in one small workspace screen.',
    headings: Object.values(componentsHeadings),
  },
  {
    path: '/tools/theme-knobs',
    title: 'Theme knobs',
    section: 'Tools',
    description: 'Change the seed colours, radius and font, and watch every token follow.',
    headings: [],
  },
  {
    path: '/how-its-built/tokens',
    title: 'Token pipeline',
    section: "How it's built",
    description: 'From a few brand knobs in JSON to CSS variables, with a contrast gate on the way.',
    headings: [],
  },
  {
    path: '/how-its-built/quality',
    title: 'Quality gates',
    section: "How it's built",
    description: 'Lint, types, axe on every story, bundle budgets and visual tests.',
    headings: [],
  },
  {
    path: '/how-its-built/workflow',
    title: 'Workflow',
    section: "How it's built",
    description: 'From an idea to prototype variants, review, and a component that ships.',
    headings: [],
  },
]

export const pageByPath = new Map(pages.map((page) => [page.path, page]))
