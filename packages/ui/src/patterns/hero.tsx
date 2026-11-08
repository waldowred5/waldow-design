import { cva, type VariantProps } from 'class-variance-authority'
import { type ComponentProps, type ReactNode, useId } from 'react'
import { ActionBar } from '../components/action-bar'
import { cn } from '../lib/cn'
import { variantOptions } from '../lib/variant-options'

const variants = {
  variant: {
    /** A bordered panel at the top of a page in a layout, such as a docs page. */
    panel: 'items-start gap-6 rounded-surface border border-border bg-background-subtle p-6 sm:p-12',
    /** The full-width opening of a landing page: centred, no frame, generous space around it. */
    landing: 'items-center gap-8 px-4 pt-16 pb-12 text-center sm:px-6 sm:pt-24 sm:pb-16',
  },
}

const heroVariants = cva('flex flex-col', { variants, defaultVariants: { variant: 'panel' } })

export const heroVariantOptions = variantOptions(variants)

export type HeroProps = Omit<ComponentProps<'section'>, 'title'> &
  VariantProps<typeof heroVariants> & {
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
 * <Hero variant="landing" title="waldow.design" tagline="A design system you can read end to end.">
 *   <Button variant="outline" asChild><a href="/tools/theme-knobs">Try the theme knobs</a></Button>
 *   <Button asChild><a href="/getting-started/introduction">Read the docs</a></Button>
 * </Hero>
 * ```
 *
 * `variant="panel"` (the default) frames the hero for the top of a page inside a layout;
 * `variant="landing"` centres it, without a frame, for a full-width landing page. Centred
 * actions keep their order: the primary one is still last.
 *
 * **Accessibility**
 * - The title is the page's `h1`; use one Hero per page, and start the page's other headings at `h2`.
 * - Renders a `<section>` labelled by the title, so it shows up in the landmark list.
 * - Actions keep DOM order, so Tab reaches the primary action last, where reading ends.
 */
export function Hero({ title, tagline, eyebrow, variant, className, children, ...props }: HeroProps) {
  const titleId = useId()
  const landing = variant === 'landing'
  return (
    <section data-slot="hero" aria-labelledby={titleId} className={cn(heroVariants({ variant }), className)} {...props}>
      {eyebrow}
      <div className={cn('flex flex-col gap-3', landing && 'items-center gap-6')}>
        <h1
          id={titleId}
          className={cn(
            'font-display text-4xl leading-tight font-bold tracking-tight text-foreground',
            landing && 'text-balance sm:leading-none',
          )}
        >
          {title}
        </h1>
        <p className={cn('max-w-2xl text-lg text-muted-foreground sm:text-xl', landing && 'text-balance sm:text-2xl')}>{tagline}</p>
      </div>
      {children && <ActionBar className={cn('w-full', landing && 'sm:w-auto sm:justify-center')}>{children}</ActionBar>}
    </section>
  )
}
