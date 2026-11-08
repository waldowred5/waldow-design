/**
 * A minimal router on the History API: each page has a real path (`/tools/theme-knobs`) that
 * can be linked and indexed, and the app needs no router dependency.
 *
 * Why not a library: the site maps a dozen fixed paths to pages, with no params, nesting or
 * loaders. react-router is an order of magnitude more code than that needs, and even wouter
 * (about 2 kB gzipped) brings a matcher the site doesn't use. This file is well under 1 kB
 * and does all the app needs:
 * - `usePath()` re-renders on navigation (pushState here, or back/forward).
 * - Same-origin `<a href>` clicks anywhere are intercepted, so design system components
 *   (`SidebarLink`, `NavbarBrand`, link-buttons) render plain links and stay router-agnostic.
 * - Old hash links (`#/theme-knobs?…`, from before the docs shell) are rewritten in place.
 *
 * Every path is served index.html: Vite's dev and preview servers do this by default (SPA
 * fallback), and a static host needs the same rewrite.
 */
import { useSyncExternalStore } from 'react'

const listeners = new Set<() => void>()
let navigated = false
const notify = () => {
  navigated = true
  listeners.forEach((listener) => listener())
}

/**
 * Whether the person has moved between pages since the site loaded. A layout that mounts after
 * a navigation (the docs, opened from the landing page) uses it to move focus to the new page.
 */
export const hasNavigated = () => navigated

/** Normalise `/tools/` to `/tools`, so a trailing slash still finds the page. */
export function normalisePath(path: string) {
  return path.length > 1 ? path.replace(/\/+$/, '') : path
}

/** Short paths that stand for a page: `/docs` is the guide's first page. */
const aliases: Record<string, string> = { '/docs': '/getting-started/introduction' }

/** Run `listener` after every navigation, including back/forward. Returns an unsubscribe. */
export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

addEventListener('popstate', notify)

export function usePath(): string {
  return useSyncExternalStore(subscribe, () => normalisePath(location.pathname))
}

/** Go to a same-origin URL without reloading. Scrolls to its `#hash`, or to the top of a new page. */
export function navigate(to: string) {
  const url = new URL(to, location.href)
  if (url.origin !== location.origin) return location.assign(url)
  url.pathname = aliases[normalisePath(url.pathname)] ?? url.pathname
  const samePage = url.pathname === location.pathname && url.search === location.search
  if (url.href !== location.href) history.pushState(null, '', url)
  notify()
  // After React commits the new page, so the target heading exists.
  requestAnimationFrame(() => {
    const target = url.hash && document.getElementById(decodeURIComponent(url.hash.slice(1)))
    if (target) target.scrollIntoView()
    else if (!samePage) scrollTo(0, 0)
  })
}

/** Replace the query of the current URL (a page's own state) without a history entry or re-render. */
export function replaceSearchParams(params: URLSearchParams) {
  const query = params.toString()
  try {
    history.replaceState(history.state, '', `${location.pathname}${query ? `?${query}` : ''}${location.hash}`)
  } catch {
    // Browsers rate-limit replaceState; the next change writes the latest state anyway.
  }
}

// Intercept plain left clicks on same-origin links; let the browser handle everything else
// (new tab, download, other origins, and `#hash` jumps within the current page).
document.addEventListener('click', (event) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  const link = event.target instanceof Element ? event.target.closest('a[href]') : null
  if (!(link instanceof HTMLAnchorElement) || (link.target && link.target !== '_self') || link.hasAttribute('download')) return
  const url = new URL(link.href)
  if (url.origin !== location.origin) return
  if (url.pathname === location.pathname && url.search === location.search && url.hash) return
  event.preventDefault()
  navigate(url.pathname + url.search + url.hash)
})

// Links from before the docs shell used hash routes: `#/theme-knobs?primary=…` → `/tools/theme-knobs?primary=…`.
if (location.hash.startsWith('#/')) {
  const [path = '/', query] = location.hash.slice(1).split('?', 2)
  const target = path === '/theme-knobs' ? '/tools/theme-knobs' : '/'
  history.replaceState(null, '', `${target}${query ? `?${query}` : ''}`)
}

// A short path on first load (`/docs`): show its page's real URL.
const alias = aliases[normalisePath(location.pathname)]
if (alias) history.replaceState(null, '', `${alias}${location.search}${location.hash}`)
