import '@testing-library/jest-dom/vitest'
import { setProjectAnnotations } from '@storybook/react-vite'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import * as preview from '../../.storybook/preview'

setProjectAnnotations([preview])

afterEach(() => cleanup())

// jsdom gaps that Radix relies on.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Element.prototype.scrollIntoView ??= () => {}
Element.prototype.hasPointerCapture ??= () => false
Element.prototype.releasePointerCapture ??= () => {}
