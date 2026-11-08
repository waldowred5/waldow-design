import type { ComponentProps } from 'react'
import { cn } from '../lib/cn'

/**
 * Typography for long-form content, such as a docs page: write plain `h1`–`h3`, `p`, `ul`,
 * `ol`, `a`, `code`, `pre` and `blockquote`, and Prose styles them from the type and space tokens
 * (the rules are in `styles.css`).
 *
 * ```tsx
 * <Prose>
 *   <h1>Installation</h1>
 *   <p className="lead">Two commands and an import.</p>
 *   <h2 id="install">Install</h2>
 *   <p>Run <code>pnpm add @waldow-design/ui</code>.</p>
 * </Prose>
 * ```
 *
 * Only direct children get block styles, so components placed inside (cards, tables,
 * examples) keep their own. Links styled as buttons (anything with a `data-slot`) keep theirs too.
 *
 * **Accessibility**
 * - Styling follows the element, so the heading levels you write are the outline screen
 *   readers navigate. Don't skip levels for a size.
 * - Give `h2` and `h3` an `id` to make them linkable; they leave room for a sticky header
 *   when scrolled to.
 * - Links are underlined, not marked by colour alone.
 * - Code blocks wrap rather than scroll, so they never need to be focusable to be read.
 */
export function Prose({ className, ...props }: ComponentProps<'div'>) {
  // The element styles live in styles.css, keyed on data-slot="prose".
  return <div data-slot="prose" className={cn('text-base text-foreground', className)} {...props} />
}
