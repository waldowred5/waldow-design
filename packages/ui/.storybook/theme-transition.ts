/**
 * Cross-fades colours when the theme toolbar changes, in both the manager and the preview.
 * The class is only present for the length of the switch, so it never slows hover states,
 * snapshots or accessibility scans. The matching CSS is in storybook.css and manager-head.html.
 */

/** Tailwind's default transition duration (`--default-transition-duration`), plus a small margin. */
const DURATION_MS = 150 + 50
/** Give up waiting for the theme attribute after this long. */
const MAX_WAIT_MS = 1000

/**
 * Add `theme-switching` to the document, and remove it once the colours have had time to fade.
 * With `attribute`, the fade is timed from when that attribute on <html> actually changes:
 * the preview re-renders the story first, so `data-theme` flips a beat after the toolbar click.
 */
export function startThemeTransition(doc: Document = document, attribute?: string) {
  if (doc.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const root = doc.documentElement
  root.classList.add('theme-switching')

  let timer = setTimeout(done, attribute ? MAX_WAIT_MS : DURATION_MS)
  const observer = attribute
    ? new MutationObserver(() => {
        clearTimeout(timer)
        timer = setTimeout(done, DURATION_MS)
      })
    : undefined
  observer?.observe(root, { attributeFilter: [attribute!] })

  function done() {
    observer?.disconnect()
    root.classList.remove('theme-switching')
  }
}
