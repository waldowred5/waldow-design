import {
  DocsLayout,
  NavbarBrand,
  Outline,
  Search,
  type SearchItem,
  Sidebar,
  SidebarGroup,
  SidebarLink,
  ThemeToggle,
} from '@waldow-design/ui'
import { type ComponentType, lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import ComponentsPage from './pages/components'
import HomePage from './pages/home'
import InstallationPage from './pages/installation'
import { NotFoundPage } from './pages/not-found'
import { StubPage } from './pages/stub'
import { navigate, subscribe, usePath } from './router'
import { type Page, pageByPath, pages, sections } from './site'
import { setMode, useMode } from './theme-mode'

// The playground carries the colour maths (culori), so it loads only when someone opens it.
const THEME_KNOBS_PATH = '/tools/theme-knobs'
const loadThemeKnobs = () => import('./pages/theme-knobs/theme-knobs-page')
const ThemeKnobsPage = lazy(loadThemeKnobs)
if (location.pathname.startsWith(THEME_KNOBS_PATH)) void loadThemeKnobs()

const pageComponents: Record<string, ComponentType> = {
  '/': HomePage,
  '/getting-started/installation': InstallationPage,
  '/components': ComponentsPage,
  [THEME_KNOBS_PATH]: ThemeKnobsPage,
}

/** Every page, and every heading on it, for search. */
const searchItems: SearchItem[] = pages.flatMap((page) => [
  { id: page.path, title: page.title, group: page.section, href: page.path },
  ...page.headings.map((heading) => ({
    id: `${page.path}#${heading.id}`,
    title: heading.title,
    group: page.title,
    href: `${page.path}#${heading.id}`,
  })),
])

const SITE_NAME = 'waldow.design'

function App() {
  const path = usePath()
  const page = pageByPath.get(path)
  const [navOpen, setNavOpen] = useState(false)

  // Following a link in the phone drawer closes it, and focus goes to the new page rather than
  // back to the menu button.
  const navigatedFromDrawer = useRef(false)
  useEffect(
    () =>
      subscribe(() => {
        setNavOpen((open) => {
          if (open) navigatedFromDrawer.current = true
          return false
        })
      }),
    [],
  )
  const focusMain = () => document.getElementById('main')?.focus({ preventScroll: true })

  // A deep link to a heading: the browser looked for it before React rendered, so jump now.
  useEffect(() => {
    if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView()
  }, [])

  useEffect(() => {
    document.title = !page ? `Page not found · ${SITE_NAME}` : path === '/' ? SITE_NAME : `${page.title} · ${SITE_NAME}`
  }, [page, path])

  // After a navigation (not the first load), move focus to the new page so keyboard and screen
  // reader users start there. A timeout, so it lands after search's own focus return.
  const firstPath = useRef(path)
  useEffect(() => {
    if (path === firstPath.current) return
    firstPath.current = ''
    const timer = setTimeout(focusMain)
    return () => clearTimeout(timer)
  }, [path])

  const headings = page?.headings ?? []
  const activeId = useActiveHeading(headings)
  const Content = pageComponents[path]

  return (
    <DocsLayout
      brand={<NavbarBrand href="/">{SITE_NAME}</NavbarBrand>}
      actions={
        <>
          <Search items={searchItems} onSelect={(item) => navigate(item.href)} />
          <ThemeToggleButton />
        </>
      }
      sidebar={<SiteNav path={path} />}
      outline={<Outline items={headings} activeId={activeId} />}
      navOpen={navOpen}
      onNavOpenChange={setNavOpen}
      onNavCloseAutoFocus={(event) => {
        if (!navigatedFromDrawer.current) return
        navigatedFromDrawer.current = false
        event.preventDefault()
        focusMain()
      }}
    >
      {!page ? (
        <NotFoundPage />
      ) : Content ? (
        <Suspense fallback={<p className="text-muted-foreground">Loading {page.title.toLowerCase()}…</p>}>
          <Content />
        </Suspense>
      ) : (
        <StubPage page={page} />
      )}
    </DocsLayout>
  )
}

function SiteNav({ path }: { path: string }) {
  return (
    <Sidebar aria-label="Docs">
      {sections.map((section) => (
        <SidebarGroup key={section} title={section}>
          {pages
            .filter((page) => page.section === section)
            .map((page) => (
              <SidebarLink
                key={page.path}
                href={page.path}
                current={page.path === path}
                onPointerEnter={page.path === THEME_KNOBS_PATH ? loadThemeKnobs : undefined}
                onFocus={page.path === THEME_KNOBS_PATH ? loadThemeKnobs : undefined}
              >
                {page.title}
              </SidebarLink>
            ))}
        </SidebarGroup>
      ))}
    </Sidebar>
  )
}

/** Only this button subscribes to the mode, so switching never re-renders (or remounts) a page. */
function ThemeToggleButton() {
  return <ThemeToggle theme={useMode()} onThemeChange={setMode} />
}

/** The heading the reader is in: the last one above the top of the viewport (below the sticky navbar). */
function useActiveHeading(headings: Page['headings']) {
  const [active, setActive] = useState<string>()
  const ids = useMemo(() => headings.map((heading) => heading.id), [headings])

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const atBottom = innerHeight + scrollY >= document.documentElement.scrollHeight - 2
      let current: string | undefined
      for (const id of ids) {
        const top = document.getElementById(id)?.getBoundingClientRect().top
        if (top !== undefined && (top <= 120 || atBottom)) current = id
      }
      setActive(current)
    }
    const onScroll = () => {
      frame ||= requestAnimationFrame(update)
    }
    update()
    addEventListener('scroll', onScroll, { passive: true })
    return () => {
      removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [ids])

  return active
}

export default App
