/**
 * The pieces both layouts share: the navbar's search and mode toggle, and
 * moving focus to the new page after a navigation.
 */
import { ModeToggle, NavbarLink, NavbarNav, Search, type SearchItem } from '@waldow-design/ui'
import { useEffect } from 'react'
import { loadDocs } from './routes'
import { hasNavigated, navigate } from './router'
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
export function ModeToggleButton() {
  return <ModeToggle mode={useMode()} onModeChange={setMode} />
}

export const MAIN_ID = 'main'
export const focusMain = () => document.getElementById(MAIN_ID)?.focus({ preventScroll: true })

/**
 * After a navigation (not the first load), move focus to the new page so keyboard and screen
 * reader users start there. Runs when a layout mounts after a navigation too (landing → docs).
 * A timeout, so it lands after search's own focus return.
 */
export function useFocusMainOnNavigate(path: string) {
  useEffect(() => {
    if (!hasNavigated()) return
    const timer = setTimeout(focusMain)
    return () => clearTimeout(timer)
  }, [path])
}
