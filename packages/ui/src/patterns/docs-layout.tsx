import { MenuIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '../components/button'
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from '../components/drawer'
import { cn } from '../lib/cn'
import { Navbar, NavbarActions } from './navbar'

export type DocsLayoutProps = {
  /** The leading edge of the navbar, usually a `NavbarBrand`. */
  brand: ReactNode
  /** The trailing edge of the navbar: search, mode toggle, links. */
  actions?: ReactNode
  /** Site navigation, usually a `Sidebar`. Fixed beside the page from `md`, in a drawer below it. */
  sidebar: ReactNode
  /** The page's "On this page" `Outline`. Shown beside the page from `xl`. */
  outline?: ReactNode
  /** The page itself. */
  children: ReactNode
  /** Control the small-screen navigation drawer, for example to close it after navigating. */
  navOpen?: boolean
  onNavOpenChange?: (open: boolean) => void
  /**
   * Called when the drawer closes, before focus returns to the menu button. Call
   * `event.preventDefault()` to move focus elsewhere, such as to a page just navigated to.
   */
  onNavCloseAutoFocus?: (event: Event) => void
  /** Names the drawer and its menu button. */
  navLabel?: string
  /** The id of `<main>`, the skip link's target. */
  mainId?: string
  className?: string
}

/**
 * The frame of a docs site: a sticky navbar, the site navigation down the leading edge, the
 * page in the middle and its outline at the trailing edge. The navigation column is narrow
 * (14rem at `md`, 16rem from `lg`) so the page keeps the room. At phone width it moves into a
 * drawer opened from the navbar's menu button, and below `xl` the outline is hidden.
 *
 * ```tsx
 * <DocsLayout
 *   brand={<NavbarBrand href="/">waldow.design</NavbarBrand>}
 *   actions={<><Search items={items} /><ModeToggle mode={mode} onModeChange={setMode} /></>}
 *   sidebar={<Sidebar aria-label="Docs">…</Sidebar>}
 *   outline={<Outline items={headings} activeId={active} />}
 * >
 *   <Prose>…</Prose>
 * </DocsLayout>
 * ```
 *
 * **Accessibility**
 * - Starts with a "Skip to content" link, visible on focus, that jumps past the navbar and
 *   navigation to `<main>`.
 * - Landmarks: the navbar's `<header>`, the sidebar's `<nav>`, `<main>` and the outline's `<nav>`.
 *   The drawer holds a second copy of the sidebar; only one copy is displayed at a time.
 * - The menu button is named by `navLabel` and the drawer is a modal dialog, so focus is
 *   trapped while it is open and returns to the button when it closes (or where
 *   `onNavCloseAutoFocus` sends it, such as `<main>` after following a link).
 */
export function DocsLayout({
  brand,
  actions,
  sidebar,
  outline,
  children,
  navOpen,
  onNavOpenChange,
  onNavCloseAutoFocus,
  navLabel = 'Navigation',
  mainId = 'main',
  className,
}: DocsLayoutProps) {
  return (
    <div data-slot="docs-layout" className={cn('min-h-screen bg-background', className)}>
      <a
        href={`#${mainId}`}
        className="sr-only rounded-control bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-50"
      >
        Skip to content
      </a>
      <Navbar>
        <Drawer open={navOpen} onOpenChange={onNavOpenChange}>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={`Open ${navLabel.toLowerCase()}`} className="md:hidden">
              <MenuIcon aria-hidden="true" />
            </Button>
          </DrawerTrigger>
          <DrawerContent side="start" aria-describedby={undefined} onCloseAutoFocus={onNavCloseAutoFocus} className="gap-6">
            <DrawerTitle>{navLabel}</DrawerTitle>
            {sidebar}
          </DrawerContent>
        </Drawer>
        {brand}
        {actions && <NavbarActions>{actions}</NavbarActions>}
      </Navbar>

      <div className="fixed top-16 bottom-0 start-0 hidden w-56 overflow-y-auto border-e border-border px-4 py-8 md:block lg:w-64 lg:px-6">{sidebar}</div>

      <div className="md:ps-56 lg:ps-64">
        <div className="mx-auto flex max-w-6xl gap-12 px-4 py-10 sm:px-6 md:px-8 lg:px-12">
          <main id={mainId} tabIndex={-1} className="min-w-0 flex-1 focus:outline-none">
            {children}
          </main>
          {outline && (
            <div className="hidden w-56 shrink-0 xl:block">
              <div className="sticky top-24">{outline}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
