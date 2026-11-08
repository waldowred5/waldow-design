import { withThemeByDataAttribute } from '@storybook/addon-themes'
import type { Preview, ReactRenderer } from '@storybook/react-vite'
import { ThemedDocsContainer } from './docs-container'
import './storybook.css'

const preview: Preview = {
  tags: ['autodocs'],
  decorators: [
    withThemeByDataAttribute<ReactRenderer>({
      themes: { light: 'light', dark: 'dark' },
      defaultTheme: 'light',
      attributeName: 'data-theme',
      parentSelector: 'html',
    }),
  ],
  parameters: {
    layout: 'centered',
    controls: { expanded: true, matchers: { color: /(background|color)$/i } },
    // Accessibility violations fail story tests. src/test/axe.ts reads these rules,
    // so Storybook's a11y panel and `pnpm test` disable the same ones.
    a11y: {
      test: 'error',
      config: {
        // `region` (content inside landmarks) is a page-level rule; components render in isolation.
        rules: [{ id: 'region', enabled: false }],
      },
    },
    backgrounds: { disable: true },
    docs: { container: ThemedDocsContainer },
    options: {
      storySort: { order: ['Introduction', 'Principles', ['Overview', '*'], 'Foundations', 'Components', 'Patterns', 'Prototypes'] },
    },
  },
}

export default preview
