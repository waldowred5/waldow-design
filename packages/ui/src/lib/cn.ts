import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Teach tailwind-merge about our token-named utilities so `cn('h-button-md', 'h-button-lg')`
// keeps the last one, and `text-sm text-muted-foreground` keeps both.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: ['button-sm', 'button-md', 'button-lg', 'button-x-sm', 'button-x-md', 'button-x-lg', 'input', 'input-x', 'checkbox', 'card-inset', 'dialog-inset', 'badge-x', 'cell-x', 'cell-y'],
      radius: ['control', 'surface', 'pill', 'button', 'input', 'checkbox', 'card', 'badge', 'dialog'],
      shadow: ['raised', 'floating', 'overlay', 'card', 'dialog'],
    },
  },
})

/** Merge class names, resolving Tailwind conflicts so the last one wins. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
