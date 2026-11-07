/**
 * Storybook UI themes (sidebar, toolbar, addon panel and docs pages), one per colour mode.
 * Values come from the same primitives as src/semantic/light.json and dark.json, so the
 * Storybook chrome matches the components it frames.
 */
import * as t from '@waldow-design/tokens'
import { create } from 'storybook/theming'

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
    colorPrimary: t.ColorPrimary600,
    colorSecondary: t.ColorPrimary600,
    appBg: t.ColorNeutral50,
    appContentBg: t.ColorBackgroundDefault,
    appPreviewBg: t.ColorSurfaceDefault,
    appBorderColor: t.ColorNeutral200,
    textColor: t.ColorNeutral900,
    textMutedColor: t.ColorNeutral600,
    textInverseColor: t.ColorNeutral50,
    barBg: t.ColorSurfaceDefault,
    barTextColor: t.ColorNeutral600,
    barSelectedColor: t.ColorPrimary600,
    barHoverColor: t.ColorPrimary600,
    inputBg: t.ColorSurfaceDefault,
    inputBorder: t.ColorNeutral300,
    inputTextColor: t.ColorNeutral900,
  }),
  dark: create({
    ...brand,
    base: 'dark',
    colorPrimary: t.ColorPrimary400,
    colorSecondary: t.ColorPrimary400,
    appBg: t.ColorNeutral900,
    appContentBg: t.ColorNeutral950,
    appPreviewBg: t.ColorNeutral950,
    appBorderColor: t.ColorNeutral700,
    textColor: t.ColorNeutral50,
    textMutedColor: t.ColorNeutral400,
    textInverseColor: t.ColorNeutral900,
    barBg: t.ColorNeutral900,
    barTextColor: t.ColorNeutral400,
    barSelectedColor: t.ColorPrimary300,
    barHoverColor: t.ColorPrimary300,
    inputBg: t.ColorNeutral800,
    inputBorder: t.ColorNeutral600,
    inputTextColor: t.ColorNeutral50,
  }),
}

/** The `theme` global set by the toolbar (addon-themes), defaulting to light. */
export const modeFrom = (globals: Record<string, unknown> | undefined): Mode => (globals?.theme === 'dark' ? 'dark' : 'light')
