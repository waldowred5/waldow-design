import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Teach tailwind-merge about our token-named utilities so `cn('h-control-md', 'h-control-lg')`
// keeps the last one, and `text-sm text-muted-foreground` keeps both.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: ['control-sm', 'control-md', 'control-lg', 'control-inner', 'control-x-sm', 'control-x-md', 'control-x-lg', 'pill-x', 'surface-inset', 'cell-x', 'cell-y'],
      radius: ['inner', 'control', 'surface', 'pill'],
      shadow: ['raised', 'floating', 'overlay'],
    },
  },
})

/** Merge class names, resolving Tailwind conflicts so the last one wins. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
