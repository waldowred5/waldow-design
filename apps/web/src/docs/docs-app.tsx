/**
 * The docs: a sidebar of every guide page, the page itself, and its "On this page" outline.
 * Its own chunk (see routes.ts), so the landing page doesn't download it up front.
 */
import { DocsLayout, NavbarBrand, Outline, Sidebar, SidebarGroup, SidebarLink } from '@waldow-design/ui'
import { type ComponentType, lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { focusMain, MAIN_ID, ThemeToggleButton, SiteNav, SiteSearch, useFocusMainOnNavigate } from '../chrome'
import ComponentsPage from '../pages/components'
import IntroductionPage from '../pages/introduction'
import { NotFoundPage } from '../pages/not-found'
import { StubPage } from '../pages/stub'
import { subscribe } from '../router'
import { DOCS_PATH, type Page, pageByPath, pages, sections, SITE_NAME } from '../site'

// The playground carries the colour maths (culori), so it loads only when someone opens it.
const THEME_KNOBS_PATH = '/tools/theme-knobs'
const loadThemeKnobs = () => import('../pages/theme-knobs/theme-knobs-page')
const ThemeKnobsPage = lazy(loadThemeKnobs)
if (location.pathname.startsWith(THEME_KNOBS_PATH)) void loadThemeKnobs()

const pageComponents: Record<string, ComponentType> = {
  [DOCS_PATH]: IntroductionPage,
  '/components': ComponentsPage,
  [THEME_KNOBS_PATH]: ThemeKnobsPage,
}

export default function DocsApp({ path }: { path: string }) {
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

  useFocusMainOnNavigate(path)

  const headings = page?.headings ?? []
  const activeId = useActiveHeading(headings)
  const Content = pageComponents[path]

  return (
    <DocsLayout
      brand={<NavbarBrand href="/">{SITE_NAME}</NavbarBrand>}
      actions={
        <>
          <SiteNav inDocs />
          <SiteSearch />
          <ThemeToggleButton />
        </>
      }
      sidebar={<DocsNav path={path} />}
      outline={<Outline items={headings} activeId={activeId} />}
      navOpen={navOpen}
      onNavOpenChange={setNavOpen}
      onNavCloseAutoFocus={(event) => {
        if (!navigatedFromDrawer.current) return
        navigatedFromDrawer.current = false
        event.preventDefault()
        focusMain()
      }}
      mainId={MAIN_ID}
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

function DocsNav({ path }: { path: string }) {
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
