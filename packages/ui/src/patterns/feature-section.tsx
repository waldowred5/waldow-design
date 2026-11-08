import { cva, type VariantProps } from 'class-variance-authority'
import { type ComponentProps, type ReactNode, useId } from 'react'
import { ActionBar } from '../components/action-bar'
import { cn } from '../lib/cn'
import { variantOptions } from '../lib/variant-options'

const layouts = {
    /** The copy above, the demo full width below it. */
    stacked: '',
    /** The copy beside the demo from `lg`, stacked below it. */
    split: 'lg:grid lg:grid-cols-5 lg:items-center lg:gap-12',
}

const tones = {
    default: 'bg-background',
    /** A tinted band, to separate a section from its neighbours. */
  subtle: 'border-y border-border bg-background-subtle',
}

const toneVariants = cva('', { variants: { tone: tones }, defaultVariants: { tone: 'default' } })
const layoutVariants = cva('', { variants: { layout: layouts }, defaultVariants: { layout: 'stacked' } })

export const featureSectionVariantOptions = variantOptions({ layout: layouts, tone: tones })

export type FeatureSectionProps = Omit<ComponentProps<'section'>, 'title'> &
  VariantProps<typeof toneVariants> &
  VariantProps<typeof layoutVariants> & {
    /** The section's heading, rendered as an `h2`. */
    title: ReactNode
    /** The id of the heading, for links to the section (`/#theming`). */
    titleId?: string
    /** A short label above the title, naming the topic ("Theming"). */
    eyebrow?: ReactNode
    /** One or two sentences under the title. */
    description?: ReactNode
    /** Links or buttons after the description; the primary one last. */
    actions?: ReactNode
    /** In the split layout, put the demo on the leading side on wide screens (visual order only). */
    reverse?: boolean
  }

/**
 * One chapter of a landing page: a short headline and pitch, then the thing itself, usually a
 * live demo made of real components. Stack several, alternating `tone`, to walk a reader
 * through a product.
 *
 * ```tsx
 * <FeatureSection
 *   eyebrow="Theming"
 *   title="One knob, every screen"
 *   description="Change a seed colour and every component follows."
 *   actions={<Button variant="outline" asChild><a href="/tools/theme-knobs">Try the knobs</a></Button>}
 * >
 *   <ComponentGallery />
 * </FeatureSection>
 * ```
 *
 * `layout="split"` puts the copy beside the demo on wide screens (two fifths to three); `reverse`
 * swaps the demo to the leading side visually only, so the copy is still read first.
 *
 * **Accessibility**
 * - Renders a `<section>` labelled by its `h2`, so each chapter is in the landmark list.
 *   Start headings inside the demo at `h3`.
 * - `reverse` changes the visual order only on wide screens, where both columns are side by
 *   side; DOM order (copy, then demo) is kept for keyboard and screen reader users.
 */
export function FeatureSection({
  title,
  titleId,
  eyebrow,
  description,
  actions,
  layout,
  tone,
  reverse = false,
  className,
  children,
  ...props
}: FeatureSectionProps) {
  const generatedId = useId()
  const headingId = titleId ?? generatedId
  const split = layout === 'split'
  return (
    <section data-slot="feature-section" aria-labelledby={headingId} className={cn(toneVariants({ tone }), className)} {...props}>
      <div className={cn('mx-auto flex max-w-6xl flex-col gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:px-8', layoutVariants({ layout }))}>
        <div className={cn('flex max-w-2xl flex-col gap-4', split && 'lg:col-span-2', split && reverse && 'lg:order-last')}>
          {eyebrow && <p className="text-sm font-semibold text-link">{eyebrow}</p>}
          <h2 id={headingId} className="scroll-mt-24 font-display text-3xl leading-tight font-bold tracking-tight text-balance text-foreground sm:text-4xl">
            {title}
          </h2>
          {description && <div className="text-lg text-muted-foreground">{description}</div>}
          {actions && <ActionBar className="mt-2">{actions}</ActionBar>}
        </div>
        {children && <div className={cn('min-w-0', split && 'lg:col-span-3')}>{children}</div>}
      </div>
    </section>
  )
}
