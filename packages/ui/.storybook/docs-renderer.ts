/**
 * Keeps docs pages mounted when the theme toolbar changes.
 *
 * Storybook re-renders the docs page on every globals change, and addon-docs' DocsRenderer
 * renders it under `key={Math.random()}`, so the whole page unmounts and mounts again: the
 * "flicker" on theme switch. Nothing on the page needs that re-render. ThemedDocsContainer
 * follows the theme itself, and embedded stories re-render in place with the new globals.
 * So a render with the same arguments as the last one (a globals re-render) is skipped, and
 * every other render (first render, navigation, hot reload) goes through as before. In
 * Storybook 10 a docs re-render is only ever triggered by a globals change, so a docs block that
 * read globals itself would go stale; none here do.
 */
import { DocsRenderer } from '@storybook/addon-docs'
import type { ReactRenderer } from '@storybook/react-vite'

type Render = DocsRenderer<ReactRenderer>['render']
type Args = Parameters<Render>

export class StableDocsRenderer {
  private inner = new DocsRenderer<ReactRenderer>()
  private last: Args | undefined

  render: Render = async (...args) => {
    if (this.last && args.every((arg, index) => arg === this.last![index])) return
    this.last = args
    return this.inner.render(...args)
  }

  unmount = (element: HTMLElement) => {
    this.last = undefined
    this.inner.unmount(element)
  }
}
