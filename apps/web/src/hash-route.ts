/**
 * A two-page app does not need a router dependency: the route is the hash path
 * (`#/theme-knobs`), and anything after `?` in the hash is that page's state, so it survives
 * reloads, works on any static host and can be shared as a link.
 */
import { useSyncExternalStore } from 'react'

export type Route = 'home' | 'theme-knobs'

export const routes: Record<Route, string> = {
  home: '#/',
  'theme-knobs': '#/theme-knobs',
}

function parse(hash: string): { path: string; params: URLSearchParams } {
  const [path = '', query = ''] = hash.replace(/^#/, '').split('?', 2)
  return { path: path || '/', params: new URLSearchParams(query) }
}

export function currentRoute(hash = location.hash): Route {
  return parse(hash).path === '/theme-knobs' ? 'theme-knobs' : 'home'
}

/** The current page's state from the hash query, e.g. `#/theme-knobs?radius=1`. */
export function hashParams(hash = location.hash): URLSearchParams {
  return parse(hash).params
}

/** Replace the hash query without adding a history entry or firing a route change. */
export function replaceHashParams(params: URLSearchParams) {
  const { path } = parse(location.hash)
  const query = params.toString()
  try {
    history.replaceState(history.state, '', `#${path}${query ? `?${query}` : ''}`)
  } catch {
    // Browsers rate-limit replaceState; the next change writes the latest state anyway.
  }
}

function subscribe(notify: () => void) {
  addEventListener('hashchange', notify)
  return () => removeEventListener('hashchange', notify)
}

export function useRoute(): Route {
  return useSyncExternalStore(subscribe, () => currentRoute())
}
