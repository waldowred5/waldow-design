/** Example content shared by the pattern stories: a small docs site. Not exported from the package. */
import type { OutlineItem } from './outline'
import type { SearchItem } from './search'

const slug = (text: string) => text.toLowerCase().replace(/\s+/g, '-')

export const sampleNav = [
  { title: 'Getting started', pages: ['Introduction', 'Installation'] },
  { title: 'Foundations', pages: ['Colour', 'Typography', 'Spacing'] },
  { title: 'Components', pages: ['Overview'] },
  { title: 'Tools', pages: ['Theme knobs'] },
]

export const sampleOutline: OutlineItem[] = [
  { id: 'what-is-a-design-system', title: 'What is a design system?' },
  { id: 'why-it-matters', title: 'Why it matters' },
  { id: 'prototypes-in-code', title: 'Prototypes in code' },
  { id: 'fidelity-loss', title: 'Fidelity loss', level: 3 },
  { id: 'performance', title: 'Performance' },
]

export const sampleSearchItems: SearchItem[] = [
  ...sampleNav.flatMap(({ title: group, pages }) => pages.map((title) => ({ id: slug(title), title, group, href: `/${slug(title)}` }))),
  ...sampleOutline.map(({ id, title }) => ({ id: `introduction-${id}`, title: String(title), group: 'Introduction', href: `/#${id}` })),
]
