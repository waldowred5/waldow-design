/**
 * Docs pages follow the theme toolbar too. The preview channel announces globals on load
 * (SET_GLOBALS) and on every change (GLOBALS_UPDATED); this module listens from import time
 * so it never misses the first one.
 */
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks'
import { type PropsWithChildren, useEffect, useSyncExternalStore } from 'react'
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events'
import { addons } from 'storybook/preview-api'
import { type Mode, modeFrom, themes } from './themes'

let mode: Mode = 'light'
const listeners = new Set<() => void>()
const update = ({ globals }: { globals?: Record<string, unknown> }) => {
  mode = modeFrom(globals)
  listeners.forEach((notify) => notify())
}
const channel = addons.getChannel()
channel.on(SET_GLOBALS, update)
channel.on(GLOBALS_UPDATED, update)

const subscribe = (notify: () => void) => {
  listeners.add(notify)
  return () => listeners.delete(notify)
}

export function ThemedDocsContainer({ children, context }: PropsWithChildren<DocsContainerProps>) {
  const current = useSyncExternalStore(subscribe, () => mode)

  // MDX pages without stories never run the theme decorator, so set the attribute here too.
  useEffect(() => {
    document.documentElement.dataset.theme = current
  }, [current])

  return (
    <DocsContainer context={context} theme={themes[current]}>
      {children}
    </DocsContainer>
  )
}
