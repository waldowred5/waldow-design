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
 * screens; `DocsLayout` does this for you.
 *
 * **Accessibility**
 * - Renders `<header>`, the page's banner landmark when it isn't inside `<main>` or a section.
 * - `NavbarBrand` is a link home. Keep its text, or give a logo-only brand an `aria-label`.
 * - Actions keep DOM order, so Tab moves from the brand to the actions as they're seen.
 */
export function Navbar({ className, children, ...props }: ComponentProps<'header'>) {
  return (
    <header
      data-slot="navbar"
      className={cn('sticky top-0 z-40 border-b border-border bg-background', className)}
      {...props}
    >
      <div className="flex h-16 items-center gap-2 px-4 sm:px-6">{children}</div>
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
