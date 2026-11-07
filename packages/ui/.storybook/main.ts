import tailwindcss from '@tailwindcss/vite'
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  // The explorations glob is mirrored in src/test/stories.test.tsx and .storybook/storybook.css.
  stories: ['../src/**/*.mdx', '../src/**/*.stories.{ts,tsx}', '../../../explorations/**/*.stories.{ts,tsx}'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-themes'],
  core: { disableTelemetry: true },
  async viteFinal(viteConfig) {
    viteConfig.plugins = [...(viteConfig.plugins ?? []), tailwindcss()]
    return viteConfig
  },
}

export default config
