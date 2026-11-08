import type { ComponentProps } from 'react'
import { cn } from '../lib/cn'

/**
 * The bar across the top of an app or docs site: the brand at the leading edge, then
 * actions (search, mode toggle, links) at the trailing edge. It sticks to the top as the
 * page scrolls.
 *
 * ```tsx
 * <Navbar>
 *   <NavbarBrand href="/">waldow.design</NavbarBrand>
 *   <NavbarActions>
 *     <Search items={pages} />
 *     <ModeToggle mode={mode} onModeChange={setMode} />
 *   </NavbarActions>
 * </Navbar>
 * ```
 *
 * Put a menu button (a `DrawerTrigger`) before the brand to open the navigation on small
 * screens; `DocsLayout` does this for you. On a landing page, use `contained` and put the
 * site's top-level links in a `NavbarNav` among the actions:
 *
 * ```tsx
 * <Navbar contained>
 *   <NavbarBrand href="/">waldow.design</NavbarBrand>
 *   <NavbarActions>
 *     <NavbarNav aria-label="Main">
 *       <NavbarLink href="/docs">Docs</NavbarLink>
 *     </NavbarNav>
 *     <ModeToggle mode={mode} onModeChange={setMode} />
 *   </NavbarActions>
 * </Navbar>
 * ```
 *
 * **Accessibility**
 * - Renders `<header>`, the page's banner landmark when it isn't inside `<main>` or a section.
 * - `NavbarBrand` is a link home. Keep its text, or give a logo-only brand an `aria-label`.
 * - Actions keep DOM order, so Tab moves from the brand to the actions as they're seen.
 * - `NavbarNav` is a `<nav>` list; name it (`aria-label="Main"`) when the page has another nav.
 *   Mark the section being shown with `current` on its `NavbarLink` (`aria-current="page"`).
 */
export type NavbarProps = ComponentProps<'header'> & {
  /**
   * Keep the content to the page's content width (a landing page), rather than spanning the
   * window (a docs site, whose sidebar starts at the edge).
   */
  contained?: boolean
}

export function Navbar({ contained = false, className, children, ...props }: NavbarProps) {
  return (
    <header
      data-slot="navbar"
      className={cn('sticky top-0 z-40 border-b border-border bg-background', className)}
      {...props}
    >
      <div className={cn('flex h-16 items-center gap-2 px-4 sm:px-6', contained && 'mx-auto max-w-6xl lg:px-8')}>{children}</div>
    </header>
  )
}

export function NavbarBrand({ className, children, ...props }: ComponentProps<'a'>) {
  return (
    <a
      data-slot="navbar-brand"
      className={cn(
        'rounded-inner font-display text-lg font-semibold text-foreground',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  )
}

export function NavbarActions({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="navbar-actions" className={cn('ms-auto flex items-center gap-2', className)} {...props} />
}

export function NavbarNav({ className, children, ...props }: ComponentProps<'nav'>) {
  return (
    <nav data-slot="navbar-nav" className={className} {...props}>
      <ul className="flex items-center gap-1">{children}</ul>
    </nav>
  )
}

export type NavbarLinkProps = ComponentProps<'a'> & {
  /** This link is the section being shown. */
  current?: boolean
}

/** A text link in the navbar, such as "Docs". The current section is marked by colour and weight. */
export function NavbarLink({ current = false, className, ...props }: NavbarLinkProps) {
  return (
    <li className="flex">
      <a
        data-slot="navbar-link"
        aria-current={current ? 'page' : undefined}
        className={cn(
          'inline-flex h-control-md items-center rounded-control px-control-x-sm text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          'aria-[current=page]:font-semibold aria-[current=page]:text-link',
          className,
        )}
        {...props}
      />
    </li>
  )
}
