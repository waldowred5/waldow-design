/**
 * Light/dark mode for the app: a tiny external store over `data-theme` on <html>.
 *
 * - The inline script in index.html sets `data-theme` before anything paints (stored choice,
 *   else the system preference), so there is no flash of the wrong mode.
 * - Switching writes the attribute synchronously in the event handler. Nothing in React needs
 *   to re-render for the colours to change, so a page below (like the theme knobs playground)
 *   is never remounted and its inline knob variables stay put: one style recalc, one frame.
 * - Until the person picks a mode, the app follows the system preference live.
 */
import { useSyncExternalStore } from 'react'

export type Mode = 'light' | 'dark'

/** Also read by the inline script in index.html; keep the two in sync. */
export const MODE_STORAGE_KEY = 'waldow-design:mode'
/** Matches the `.theme-switching` rule in index.css: the fast motion token, plus a margin. */
const FADE_MS = 150 + 50

const root = document.documentElement
const systemDark = matchMedia('(prefers-color-scheme: dark)')
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
const listeners = new Set<() => void>()

function readStored(): Mode | undefined {
  try {
    const value = localStorage.getItem(MODE_STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : undefined
  } catch {
    return undefined
  }
}

export function getMode(): Mode {
  const attribute = root.dataset.theme
  if (attribute === 'light' || attribute === 'dark') return attribute
  return readStored() ?? (systemDark.matches ? 'dark' : 'light')
}

let fadeTimer: ReturnType<typeof setTimeout> | undefined

/**
 * Apply a mode. The cross-fade class and the attribute change land in the same style recalc,
 * so transitions run from the old colours to the new ones (and not at all with reduced motion).
 */
function apply(mode: Mode) {
  if (root.dataset.theme === mode) return
  if (!reducedMotion.matches) {
    root.classList.add('theme-switching')
    clearTimeout(fadeTimer)
    fadeTimer = setTimeout(() => root.classList.remove('theme-switching'), FADE_MS)
  }
  root.dataset.theme = mode
  listeners.forEach((notify) => notify())
}

/** Set and remember the person's choice. */
export function setMode(mode: Mode) {
  try {
    localStorage.setItem(MODE_STORAGE_KEY, mode)
  } catch {
    // Storage can be unavailable (private mode, blocked site data): the switch still works.
  }
  apply(mode)
}

// No stored choice yet: follow the system as it changes (for example at sunset).
systemDark.addEventListener('change', (event) => {
  if (!readStored()) apply(event.matches ? 'dark' : 'light')
})

function subscribe(notify: () => void) {
  listeners.add(notify)
  return () => listeners.delete(notify)
}

export function useMode(): Mode {
  return useSyncExternalStore(subscribe, getMode)
}
