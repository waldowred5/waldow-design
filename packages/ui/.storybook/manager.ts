import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming'

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'waldow.design',
    brandUrl: 'https://github.com/waldowred5/waldow-design',
    brandTarget: '_blank',
  }),
})
