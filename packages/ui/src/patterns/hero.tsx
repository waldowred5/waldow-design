import { type ComponentProps, type ReactNode, useId } from 'react'
import { ActionBar } from '../components/action-bar'
import { cn } from '../lib/cn'

export type HeroProps = Omit<ComponentProps<'section'>, 'title'> & {
  /** The page's name, rendered as its `h1`. */
  title: ReactNode
  /** One sentence under the title that says what this is. */
  tagline: ReactNode
  /** A short label above the title, such as a status badge. */
  eyebrow?: ReactNode
}

/**
 * The opening of a landing page: the name, one sentence that says what it is, and the next
 * steps as `children` (usually a secondary and a primary link-button). The actions sit in an
 * `ActionBar`, so the primary one goes last, at the trailing edge, as on every other surface.
 *
 * ```tsx
 * <Hero title="waldow.design" tagline="A design system you can read end to end.">
 *   <Button variant="outline" asChild><a href="/tools/theme-knobs">Try the theme knobs</a></Button>
 *   <Button asChild><a href="/getting-started/installation">Get started</a></Button>
 * </Hero>
 * ```
 *
 * **Accessibility**
 * - The title is the page's `h1`; use one Hero per page, and start the page's other headings at `h2`.
 * - Renders a `<section>` labelled by the title, so it shows up in the landmark list.
 * - Actions keep DOM order, so Tab reaches the primary action last, where reading ends.
 */
export function Hero({ title, tagline, eyebrow, className, children, ...props }: HeroProps) {
  const titleId = useId()
  return (
    <section
      data-slot="hero"
      aria-labelledby={titleId}
      className={cn('flex flex-col items-start gap-6 rounded-surface border border-border bg-background-subtle p-6 sm:p-12', className)}
      {...props}
    >
      {eyebrow}
      <div className="flex flex-col gap-3">
        <h1 id={titleId} className="font-display text-4xl leading-tight font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">{tagline}</p>
      </div>
      {children && <ActionBar className="w-full">{children}</ActionBar>}
    </section>
  )
}
