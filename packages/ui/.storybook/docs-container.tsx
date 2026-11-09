/**
 * Docs pages follow the theme toolbar too. The preview channel announces globals on load
 * (SET_GLOBALS) and on every change (GLOBALS_UPDATED); this module listens from import time
 * so it never misses the first one.
 */
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks'
import { type PropsWithChildren, useEffect, useSyncExternalStore } from 'react'
import { addons } from 'storybook/preview-api'
import { type Mode, followTheme, themes } from './themes'

let mode: Mode = 'light'
const listeners = new Set<() => void>()
// Canvas and docs both live in this iframe, so the transition cross-fades stories as well as docs.
const stop = followTheme(
  addons.getChannel(),
  (next) => {
    mode = next
    listeners.forEach((notify) => notify())
  },
  { attribute: 'data-theme' },
)
import.meta.hot?.dispose(stop)

const subscribe = (notify: () => void) => {
  listeners.add(notify)
  return () => listeners.delete(notify)
}

export function ThemedDocsContainer({ children, context }: PropsWithChildren<DocsContainerProps>) {
  const current = useSyncExternalStore(subscribe, () => mode)

  // withThemeByDataAttribute (preview.tsx) also writes this attribute, and is still needed: it
  // drives the toolbar and themes the canvas, where this container doesn't render. But MDX pages
  // without stories never run decorators, so set the attribute here too.
  useEffect(() => {
    document.documentElement.dataset.theme = current
  }, [current])

  return (
    <DocsContainer context={context} theme={themes[current]}>
      {children}
    </DocsContainer>
  )
}
