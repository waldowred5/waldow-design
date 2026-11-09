/**
 * The navbar pieces both layouts share: the site's links, search and the theme toggle.
 */
import { NavbarLink, NavbarNav, Search, type SearchItem, ThemeToggle } from '@waldow-design/ui'
import { loadDocs } from './routes'
import { navigate } from './router'
import { DOCS_PATH, pages } from './site'
import { setMode, useMode } from './theme-mode'

/** Every docs page, and every heading on it, for search. */
const searchItems: SearchItem[] = pages.flatMap((page) => [
  { id: page.path, title: page.title, group: page.section, href: page.path },
  ...page.headings.map((heading) => ({
    id: `${page.path}#${heading.id}`,
    title: heading.title,
    group: page.title,
    href: `${page.path}#${heading.id}`,
  })),
])

export function SiteSearch() {
  return <Search items={searchItems} onSelect={(item) => navigate(item.href)} />
}

/** The site's top-level links: for now, the guide. `current` inside the docs. */
export function SiteNav({ inDocs = false }: { inDocs?: boolean }) {
  return (
    <NavbarNav aria-label="Main">
      <NavbarLink href={DOCS_PATH} current={inDocs} onPointerEnter={loadDocs} onFocus={loadDocs}>
        Docs
      </NavbarLink>
    </NavbarNav>
  )
}

/** Only this button subscribes to the mode, so switching never re-renders (or remounts) a page. */
export function ThemeToggleButton() {
  return <ThemeToggle theme={useMode()} onThemeChange={setMode} />
}
