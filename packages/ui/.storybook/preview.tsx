import { withThemeByDataAttribute } from '@storybook/addon-themes'
import type { Preview, ReactRenderer } from '@storybook/react-vite'
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
    // Accessibility violations fail story tests (wired into CI in LAB-112).
    a11y: { test: 'error' },
    backgrounds: { disable: true },
    options: {
      storySort: { order: ['Introduction', 'Principles', ['Overview', '*'], 'Foundations', 'Components', 'Explorations'] },
    },
  },
}

export default preview
