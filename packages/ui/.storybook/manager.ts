import { addons } from 'storybook/manager-api'
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events'
import { modeFrom, themes } from './themes'

addons.setConfig({ theme: themes.light })

// The theme toolbar sets a global in the preview. Follow it here so the sidebar, toolbar and
// addon panel switch with the canvas instead of staying light.
addons.register('waldow-design/theme-sync', (api) => {
  const apply = ({ globals }: { globals?: Record<string, unknown> }) => api.setOptions({ theme: themes[modeFrom(globals)] })
  const channel = api.getChannel()
  channel?.on(SET_GLOBALS, apply)
  channel?.on(GLOBALS_UPDATED, apply)
})
