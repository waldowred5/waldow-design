import { addons } from 'storybook/manager-api'
import { followTheme, themes } from './themes'

addons.setConfig({ theme: themes.light })

// The theme toolbar sets a global in the preview. Follow it here so the sidebar, toolbar and
// addon panel switch with the canvas instead of staying light. Seeding from the current globals
// covers a preview that announced them first, e.g. a `?globals=theme:dark` deep link.
addons.register('waldow-design/theme-sync', (api) => {
  followTheme(api.getChannel(), (mode) => api.setOptions({ theme: themes[mode] }), {
    initial: { globals: api.getGlobals() },
  })
})
