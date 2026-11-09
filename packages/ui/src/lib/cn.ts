import { container, radius, shadow, spacing } from '@waldow-design/tokens/utilities'
import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Teach tailwind-merge about our token-named utilities so `cn('h-control-md', 'h-control-lg')`
// keeps the last one, and `text-sm text-muted-foreground` keeps both. The names come from the
// token build, so they can't drift from the semantic tokens.
const twMerge = extendTailwindMerge({
  extend: {
    theme: { spacing, container, radius, shadow },
  },
})

/** Merge class names, resolving Tailwind conflicts so the last one wins. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
