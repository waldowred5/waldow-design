import tailwindcss from '@tailwindcss/vite'
import type { StorybookConfig } from '@storybook/react-vite'
import remarkGfm from 'remark-gfm'

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  // The prototypes path is mirrored in src/test/stories.test.tsx, .storybook/storybook.css,
  // scripts/check-tokens.mjs and scripts/new-prototype.mjs.
  stories: ['../src/**/*.mdx', '../src/**/*.stories.{ts,tsx}', '../../../prototypes/**/*.stories.{ts,tsx}'],
  addons: [
    // GitHub-flavoured markdown, so MDX pages can use tables.
    { name: '@storybook/addon-docs', options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } } },
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
  ],
  core: { disableTelemetry: true },
  async viteFinal(viteConfig) {
    viteConfig.plugins = [...(viteConfig.plugins ?? []), tailwindcss()]
    return viteConfig
  },
}

export default config
