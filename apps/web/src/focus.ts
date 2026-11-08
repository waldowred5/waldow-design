import { useEffect } from 'react'
import { hasNavigated } from './router'

/** The id of each layout's `<main>`: the skip link's target, and where focus goes after navigating. */
export const MAIN_ID = 'main'
export const focusMain = () => document.getElementById(MAIN_ID)?.focus({ preventScroll: true })

/**
 * After a navigation (not the first load), move focus to the new page so keyboard and screen
 * reader users start there. Runs when a layout mounts after a navigation too (landing → docs).
 * A timeout, so it lands after search's own focus return.
 */
export function useFocusMainOnNavigate(path: string) {
  useEffect(() => {
    if (!hasNavigated()) return
    const timer = setTimeout(focusMain)
    return () => clearTimeout(timer)
    // `path` is the trigger: each new page moves focus, though the effect doesn't read it.
    // oxlint-disable-next-line react/exhaustive-deps
  }, [path])
}
