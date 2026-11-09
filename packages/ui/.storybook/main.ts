import tailwindcss from '@tailwindcss/vite'
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  // The prototypes path is mirrored in src/test/stories.test.tsx, .storybook/storybook.css,
  // scripts/check-tokens.mjs and scripts/new-prototype.mjs.
  stories: ['../src/**/*.mdx', '../src/**/*.stories.{ts,tsx}', '../../../prototypes/**/*.stories.{ts,tsx}'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-themes'],
  core: { disableTelemetry: true },
  async viteFinal(viteConfig) {
    viteConfig.plugins = [...(viteConfig.plugins ?? []), tailwindcss()]
    return viteConfig
  },
}

export default config
