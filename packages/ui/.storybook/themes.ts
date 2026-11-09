/**
 * Storybook UI themes (sidebar, toolbar, addon panel and docs pages), one per colour mode.
 * Values come from the same primitives as src/semantic/light.json and dark.json, so the
 * Storybook chrome matches the components it frames. They are picked by hand because
 * @waldow-design/tokens only exports light-mode semantic values to JS.
 */
import * as t from '@waldow-design/tokens'
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events'
import { create } from 'storybook/theming'
import { startThemeTransition } from './theme-transition'

export type Mode = 'light' | 'dark'

const brand = {
  brandTitle: 'waldow.design',
  brandUrl: 'https://github.com/waldowred5/waldow-design',
  brandTarget: '_blank',
  fontBase: t.FontFamilySans.join(', '),
  fontCode: t.FontFamilyMono.join(', '),
  appBorderRadius: 8,
  inputBorderRadius: 6,
}

export const themes = {
  light: create({
    ...brand,
    base: 'light',
    colorPrimary: t.ColorBrand600,
    colorSecondary: t.ColorBrand600,
    appBg: t.ColorNeutral50,
    appContentBg: t.ColorBackgroundDefault,
    appPreviewBg: t.ColorSurfaceDefault,
    appBorderColor: t.ColorNeutral200,
    textColor: t.ColorNeutral900,
    textMutedColor: t.ColorNeutral600,
    textInverseColor: t.ColorNeutral50,
    barBg: t.ColorSurfaceDefault,
    barTextColor: t.ColorNeutral600,
    barSelectedColor: t.ColorBrand600,
    barHoverColor: t.ColorBrand600,
    inputBg: t.ColorSurfaceDefault,
    inputBorder: t.ColorNeutral300,
    inputTextColor: t.ColorNeutral900,
  }),
  dark: create({
    ...brand,
    base: 'dark',
    colorPrimary: t.ColorBrand400,
    colorSecondary: t.ColorBrand400,
    appBg: t.ColorNeutral900,
    appContentBg: t.ColorNeutral950,
    appPreviewBg: t.ColorNeutral950,
    appBorderColor: t.ColorNeutral700,
    textColor: t.ColorNeutral50,
    textMutedColor: t.ColorNeutral400,
    textInverseColor: t.ColorNeutral900,
    barBg: t.ColorNeutral900,
    barTextColor: t.ColorNeutral400,
    barSelectedColor: t.ColorBrand300,
    barHoverColor: t.ColorBrand300,
    inputBg: t.ColorNeutral800,
    inputBorder: t.ColorNeutral600,
    inputTextColor: t.ColorNeutral50,
  }),
}

/** The `theme` global set by the toolbar (addon-themes), defaulting to light. */
export const modeFrom = (globals: Record<string, unknown> | undefined): Mode => (globals?.theme === 'dark' ? 'dark' : 'light')

type GlobalsPayload = { globals?: Record<string, unknown> }
type Channel = {
  on(event: string, listener: (payload: GlobalsPayload) => void): void
  off(event: string, listener: (payload: GlobalsPayload) => void): void
}

/**
 * Follow the theme toolbar over a Storybook channel, in the manager or the preview. `apply`
 * runs once per actual mode change. Changes after the first (GLOBALS_UPDATED) cross-fade
 * through `startThemeTransition(doc, attribute)`. `initial` seeds the mode for globals that
 * were announced before this subscribed. Returns a function that unsubscribes.
 */
export function followTheme(
  channel: Channel | null | undefined,
  apply: (mode: Mode) => void,
  { initial, doc, attribute }: { initial?: GlobalsPayload; doc?: Document; attribute?: string } = {},
) {
  let current: Mode | undefined
  const set = ({ globals }: GlobalsPayload, animate: boolean) => {
    const next = modeFrom(globals)
    if (next === current) return
    if (animate && current) startThemeTransition(doc, attribute)
    current = next
    apply(next)
  }
  const onSet = (payload: GlobalsPayload) => set(payload, false)
  const onUpdate = (payload: GlobalsPayload) => set(payload, true)
  channel?.on(SET_GLOBALS, onSet)
  channel?.on(GLOBALS_UPDATED, onUpdate)
  if (initial) set(initial, false)
  return () => {
    channel?.off(SET_GLOBALS, onSet)
    channel?.off(GLOBALS_UPDATED, onUpdate)
  }
}
