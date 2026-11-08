// The ARIA combobox pattern: an input that controls a styled listbox, which <datalist> and
// <select> can't be. Options stay unfocusable; the input tracks the active one.
/* oxlint-disable jsx-a11y/prefer-tag-over-role, jsx-a11y/interactive-supports-focus */
import { SearchIcon } from 'lucide-react'
import { type KeyboardEvent, useEffect, useId, useMemo, useRef, useState } from 'react'
import { Button } from '../components/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/dialog'
import { Input } from '../components/input'
import { cn } from '../lib/cn'

export type SearchItem = {
  id: string
  title: string
  /** Where the item lives, such as its section or page; shown under the title and searched too. */
  group?: string
  href: string
}

export type SearchProps = {
  items: SearchItem[]
  /** Called with the chosen item. Defaults to following its `href`; pass your router's navigate. */
  onSelect?: (item: SearchItem) => void
  /** Names the trigger, the dialog and the search box. */
  label?: string
  /** Open with ⌘K / Ctrl+K, and `/` when focus isn't in a text field. */
  shortcut?: boolean
  /** Open on first render (for visual tests). */
  defaultOpen?: boolean
  /** The query the box starts with, and returns to when the dialog closes (for visual tests). */
  defaultQuery?: string
  className?: string
}

const MAX_RESULTS = 12

/** A query word matches its own text, or its singular: "tokens" finds "Token pipeline". */
const has = (text: string, word: string) => text.includes(word) || (word.length > 3 && word.endsWith('s') && text.includes(word.slice(0, -1)))

/** Every word of the query must appear in the title or group; title matches come first. */
export function filterSearchItems(items: SearchItem[], query: string): SearchItem[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (!words.length) return items.filter((item) => !item.href.includes('#')).slice(0, MAX_RESULTS)
  const matches = items.filter((item) => words.every((word) => has(`${item.title} ${item.group ?? ''}`.toLowerCase(), word)))
  const inTitle = (item: SearchItem) => words.every((word) => has(item.title.toLowerCase(), word))
  return [...matches.filter(inTitle), ...matches.filter((item) => !inTitle(item))].slice(0, MAX_RESULTS)
}

function isTyping(target: EventTarget | null) {
  return target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
}

/**
 * Search across a site's pages and headings: a trigger button that opens a dialog with a
 * search box and a list of matches. Filtering is client-side over the `items` you pass, so
 * build them from your page titles and headings.
 *
 * ```tsx
 * <Search items={[{ id: 'colour', title: 'Colour', group: 'Foundations', href: '/foundations/colour' }]} onSelect={(item) => navigate(item.href)} />
 * ```
 *
 * With an empty query it lists the pages (items whose `href` has no `#`).
 *
 * **Accessibility**
 * - The search box is a combobox that controls a listbox: Up and Down move through the
 *   results, Enter opens one, Escape closes the dialog. Focus stays in the box while the
 *   active result is announced (`aria-activedescendant`). Closing without a choice returns
 *   focus to the trigger; after a choice it doesn't, so the app can move it to the destination.
 * - The number of results is announced as you type.
 * - The trigger's name is its visible text, `label` (kept for screen readers when the phone layout
 *   shows only the icon); the shortcut hint is hidden from screen readers.
 */
export function Search({ items, onSelect, label = 'Search docs', shortcut = true, defaultOpen = false, defaultQuery = '', className }: SearchProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [query, setQuery] = useState(defaultQuery)
  const [active, setActive] = useState(0)
  const results = useMemo(() => filterSearchItems(items, query), [items, query])
  const listId = useId()
  const optionId = (index: number) => `${listId}-${index}`
  const [isMac] = useState(() => typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent))

  useEffect(() => {
    if (!shortcut) return
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      const combo = event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)
      const slash = event.key === '/' && !isTyping(event.target)
      if (!combo && !slash) return
      event.preventDefault()
      setOpen(true)
    }
    addEventListener('keydown', onKeyDown)
    return () => removeEventListener('keydown', onKeyDown)
  }, [shortcut])

  // Keep the active result in view as the arrow keys move through a long list.
  useEffect(() => {
    if (open) document.getElementById(optionId(active))?.scrollIntoView({ block: 'nearest' })
  })

  const onOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      setQuery(defaultQuery)
      setActive(0)
    }
  }

  // After choosing a result, focus belongs at the destination (the app moves it there), not
  // back on the trigger.
  const chose = useRef(false)

  const choose = (item: SearchItem | undefined) => {
    if (!item) return
    chose.current = true
    onOpenChange(false)
    if (onSelect) onSelect(item)
    else location.assign(item.href)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const step = event.key === 'ArrowDown' ? 1 : -1
      setActive((index) => (results.length ? (index + step + results.length) % results.length : 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      choose(results[active])
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className={cn('text-muted-foreground max-sm:size-control-md max-sm:px-0', className)}>
          <SearchIcon aria-hidden="true" />
          <span className="max-sm:sr-only">{label}</span>
          {shortcut && (
            <kbd aria-hidden="true" className="ms-4 font-sans text-xs max-sm:hidden">
              {isMac ? '⌘K' : 'Ctrl K'}
            </kbd>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="mt-16 gap-3"
        onCloseAutoFocus={(event) => {
          if (chose.current) event.preventDefault()
          chose.current = false
        }}
      >
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription className="sr-only">Pages and sections. Use the arrow keys to move through results.</DialogDescription>
        </DialogHeader>
        <Input
          type="search"
          role="combobox"
          aria-label={label}
          aria-expanded={results.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={results.length ? optionId(active) : undefined}
          autoComplete="off"
          placeholder="Colour, tokens, theme knobs…"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActive(0)
          }}
          onKeyDown={onKeyDown}
        />
        <output className="sr-only">{results.length === 1 ? '1 result' : `${results.length} results`}</output>
        {results.length ? (
          <div id={listId} role="listbox" aria-label="Results" className="-mx-2 flex max-h-80 flex-col gap-1 overflow-y-auto">
            {results.map((item, index) => (
              // Options aren't focusable: focus stays in the combobox (aria-activedescendant),
              // so the keyboard handler lives there and a click is the pointer path.
              // oxlint-disable-next-line jsx-a11y/click-events-have-key-events
              <div
                key={item.id}
                id={optionId(index)}
                role="option"
                aria-selected={index === active}
                onClick={() => choose(item)}
                onPointerMove={() => setActive(index)}
                className="flex cursor-pointer flex-col rounded-control px-2 py-2 aria-selected:bg-background-muted"
              >
                <span className="text-sm font-medium text-foreground">{item.title}</span>
                {item.group && <span className="text-xs text-muted-foreground">{item.group}</span>}
              </div>
            ))}
          </div>
        ) : (
          <p className="py-6 text-center text-sm text-muted-foreground">No results for “{query}”.</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
