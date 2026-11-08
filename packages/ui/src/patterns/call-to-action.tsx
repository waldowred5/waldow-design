import { type ComponentProps, type ReactNode, useId } from 'react'
import { ActionBar } from '../components/action-bar'
import { cn } from '../lib/cn'

export type CallToActionProps = Omit<ComponentProps<'section'>, 'title'> & {
  /** The ask, rendered as an `h2`. */
  title: ReactNode
  /** One sentence on what the reader gets. */
  description?: ReactNode
}

/**
 * The closing ask of a landing page: a headline, a sentence, and the next steps as `children`
 * (a secondary and a primary link-button). The actions sit in an `ActionBar`, primary last.
 *
 * ```tsx
 * <CallToAction title="Read the guide" description="The full story, page by page.">
 *   <Button variant="outline" asChild><a href="/components">Browse the components</a></Button>
 *   <Button asChild><a href="/getting-started/introduction">Read the docs</a></Button>
 * </CallToAction>
 * ```
 *
 * **Accessibility**
 * - Renders a `<section>` labelled by its `h2`.
 * - Actions keep DOM order, so Tab reaches the primary action last.
 */
export function CallToAction({ title, description, className, children, ...props }: CallToActionProps) {
  const titleId = useId()
  return (
    <section
      data-slot="call-to-action"
      aria-labelledby={titleId}
      className={cn(
        'flex flex-col gap-6 rounded-surface border border-highlight-border bg-highlight-subtle p-6 shadow-raised sm:p-12 lg:flex-row lg:items-center lg:justify-between',
        className,
      )}
      {...props}
    >
      <div className="flex max-w-2xl flex-col gap-3">
        <h2 id={titleId} className="font-display text-3xl leading-tight font-bold tracking-tight text-balance text-foreground">
          {title}
        </h2>
        {description && <p className="text-lg text-muted-foreground">{description}</p>}
      </div>
      {children && <ActionBar className="lg:shrink-0">{children}</ActionBar>}
    </section>
  )
}
