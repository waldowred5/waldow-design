import type { ComponentProps, ReactNode } from 'react'
import { useId } from 'react'
import { cn } from '../lib/cn'

export type OutlineItem = {
  /** The heading's `id`; the link goes to `#id`. */
  id: string
  title: ReactNode
  /** 2 for an `h2`, 3 for an `h3`: deeper levels are indented. */
  level?: 2 | 3
}

export type OutlineProps = Omit<ComponentProps<'nav'>, 'title'> & {
  items: OutlineItem[]
  /** The id of the section being read, highlighted in the list. */
  activeId?: string
  title?: ReactNode
}

/**
 * The "On this page" list beside a long page: one link per heading, with the section being
 * read highlighted. The app decides which section is active (for example from the scroll
 * position) and passes `activeId`.
 *
 * ```tsx
 * <Outline items={[{ id: 'seeds', title: 'Seeds' }, { id: 'roles', title: 'Roles' }]} activeId="roles" />
 * ```
 *
 * **Accessibility**
 * - A `<nav>` labelled by its title, so it is a separate landmark from the site navigation.
 * - The active link has `aria-current="location"` and is marked by weight as well as colour.
 * - Renders nothing for an empty list, so short pages don't get an empty landmark.
 */
export function Outline({ items, activeId, title = 'On this page', className, ...props }: OutlineProps) {
  const titleId = useId()
  if (!items.length) return null
  return (
    <nav data-slot="outline" aria-labelledby={titleId} className={cn('flex flex-col gap-2 text-sm', className)} {...props}>
      <h2 id={titleId} className="font-display text-sm font-semibold text-foreground">
        {title}
      </h2>
      <ul className="flex flex-col gap-1">
        {items.map((item) => (
          <li key={item.id} className={cn(item.level === 3 && 'ps-3')}>
            <a
              href={`#${item.id}`}
              aria-current={item.id === activeId ? 'location' : undefined}
              className={cn(
                'block rounded-inner py-0.5 text-muted-foreground transition-colors hover:text-foreground',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                'aria-[current=location]:font-semibold aria-[current=location]:text-link',
              )}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
