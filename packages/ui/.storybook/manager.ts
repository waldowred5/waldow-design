import { addons } from 'storybook/manager-api'
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events'
import { startThemeTransition } from './theme-transition'
import { type Mode, modeFrom, themes } from './themes'

addons.setConfig({ theme: themes.light })

// The theme toolbar sets a global in the preview. Follow it here so the sidebar, toolbar and
// addon panel switch with the canvas instead of staying light.
addons.register('waldow-design/theme-sync', (api) => {
  let current: Mode | undefined
  const apply = ({ globals }: { globals?: Record<string, unknown> }, animate: boolean) => {
    const next = modeFrom(globals)
    if (next === current) return
    if (animate && current) startThemeTransition()
    current = next
    api.setOptions({ theme: themes[next] })
  }
  const channel = api.getChannel()
  channel?.on(SET_GLOBALS, (payload) => apply(payload, false))
  channel?.on(GLOBALS_UPDATED, (payload) => apply(payload, true))
})
