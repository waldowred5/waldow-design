import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../lib/cn'
import { variantOptions } from '../lib/variant-options'

const variants = {
  columns: {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  },
}

const featureGridVariants = cva('grid gap-8', { variants, defaultVariants: { columns: 3 } })

export const featureGridVariantOptions = variantOptions(variants)

export type FeatureGridProps = ComponentProps<'ul'> & VariantProps<typeof featureGridVariants>

/**
 * A grid of short features, each an icon, a title and a sentence or two: the "why" of a
 * landing page at a glance. One column on phones, then two, then `columns` from `lg`.
 *
 * ```tsx
 * <FeatureGrid columns={3}>
 *   <FeatureGridItem icon={<PaletteIcon />} title="Change once">A brand colour is one edit.</FeatureGridItem>
 *   …
 * </FeatureGrid>
 * ```
 *
 * **Accessibility**
 * - A list, so screen readers announce how many features there are.
 * - Each title is an `h3`: put the grid under an `h2`, such as a `FeatureSection`'s title.
 * - Icons are decorative and hidden from assistive technology; the title carries the meaning.
 */
export function FeatureGrid({ columns, className, ...props }: FeatureGridProps) {
  return <ul data-slot="feature-grid" className={cn(featureGridVariants({ columns }), className)} {...props} />
}

export type FeatureGridItemProps = Omit<ComponentProps<'li'>, 'title'> & {
  /** A small icon in a tinted tile, such as a lucide icon. */
  icon?: ReactNode
  title: ReactNode
}

export function FeatureGridItem({ icon, title, className, children, ...props }: FeatureGridItemProps) {
  return (
    <li data-slot="feature-grid-item" className={cn('flex flex-col gap-3', className)} {...props}>
      {icon && (
        <span
          aria-hidden="true"
          className="inline-flex size-control-md items-center justify-center rounded-control border border-highlight-border bg-highlight-subtle text-highlight-text [&_svg]:size-4"
        >
          {icon}
        </span>
      )}
      <h3 className="font-display text-lg leading-tight font-semibold text-foreground">{title}</h3>
      {children && <div className="text-sm text-muted-foreground">{children}</div>}
    </li>
  )
}
