import type { ComponentProps, ReactNode } from 'react'
import { useId } from 'react'
import { cn } from '../lib/cn'

/**
 * Site navigation as titled groups of links, like the sidebar of a docs site.
 *
 * ```tsx
 * <Sidebar aria-label="Docs">
 *   <SidebarGroup title="Getting started">
 *     <SidebarLink href="/getting-started/introduction" current>Introduction</SidebarLink>
 *   </SidebarGroup>
 *   <SidebarGroup title="Foundations">
 *     <SidebarLink href="/foundations/colour">Colour</SidebarLink>
 *   </SidebarGroup>
 * </Sidebar>
 * ```
 *
 * The links are plain `<a href>`, so they work with any router: intercept clicks in the
 * app, or pass `onClick`. `DocsLayout` places the sidebar, and moves it into a drawer on
 * small screens.
 *
 * **Accessibility**
 * - Renders a `<nav>`; give it an `aria-label` when the page has more than one.
 * - Each group is a list labelled by its title, so screen readers announce "Getting started,
 *   list, 3 items".
 * - The current page has `aria-current="page"`, and is marked by weight and an edge bar as
 *   well as colour.
 */
export function Sidebar({ className, ...props }: ComponentProps<'nav'>) {
  return <nav data-slot="sidebar" className={cn('flex flex-col gap-6 text-sm', className)} {...props} />
}

export type SidebarGroupProps = Omit<ComponentProps<'div'>, 'title'> & {
  /** The group's heading, such as "Getting started". */
  title: ReactNode
}

export function SidebarGroup({ title, className, children, ...props }: SidebarGroupProps) {
  const titleId = useId()
  return (
    <div data-slot="sidebar-group" className={cn('flex flex-col gap-2', className)} {...props}>
      <h2 id={titleId} className="font-display text-sm font-semibold text-foreground">
        {title}
      </h2>
      <ul aria-labelledby={titleId} className="flex flex-col border-s border-border">
        {children}
      </ul>
    </div>
  )
}

export type SidebarLinkProps = ComponentProps<'a'> & {
  /** This link is the page being shown. */
  current?: boolean
}

export function SidebarLink({ current = false, className, children, ...props }: SidebarLinkProps) {
  return (
    <li className="flex">
      <a
        data-slot="sidebar-link"
        aria-current={current ? 'page' : undefined}
        className={cn(
          '-ms-px flex-1 border-s border-transparent py-1 ps-4 text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground',
          'rounded-e-inner focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
          'aria-[current=page]:border-primary aria-[current=page]:font-semibold aria-[current=page]:text-link',
          className,
        )}
        {...props}
      >
        {children}
      </a>
    </li>
  )
}
