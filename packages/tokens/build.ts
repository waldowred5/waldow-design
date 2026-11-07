/**
 * Builds the two token tiers (primitive, semantic) into CSS variables and a typed JS module.
 * There is no component tier: components use semantic tokens directly (see docs/adr/003).
 *
 *   src/brand         the theme knobs: seed colours (primary, secondary, highlight), neutral scale,
 *                     radius, font. Each seed becomes an 11-step scale via palette.ts.
 *   src/primitive     raw values (status hues, scales)
 *   src/semantic      intent (base.json is mode-independent: radius, control sizes, insets,
 *                     fonts, motion; light.json and dark.json are modes)
 *
 * Output (dist/):
 *   tokens.css   :root (knobs + primitives + semantic + light), then dark overrides for
 *                [data-theme="dark"] and prefers-color-scheme: dark. Every block is also
 *                declared on [data-brand], so overriding a knob on any element re-derives
 *                the tokens for that subtree.
 *   tokens.js    flat light-theme values for JS consumers, with tokens.d.ts (colours as hex)
 *   tokens.json  nested light-theme values, for docs and tooling (colours as hex)
 *
 * The build fails if a text/background pair in either theme drops below WCAG AA.
 */
import { readFileSync } from 'node:fs'
import { readFile, rm, writeFile } from 'node:fs/promises'
import StyleDictionary from 'style-dictionary'
import type { TransformedToken } from 'style-dictionary/types'
import { wcagContrast } from 'culori'
import { scale, toOklch } from './palette.ts'

// CSS gets colours as oklch(), including the colours inside shadows: everything the site
// renders is OKLCH. JS/JSON output keeps hex only for compatibility, because tools that read
// it (Storybook's manager theming, for one) can't parse oklch(). See README "Why OKLCH".
type ShadowLayer = { color: string } & Record<string, string>
StyleDictionary.registerTransform({
  name: 'color/oklch',
  type: 'value',
  filter: (token) => token.$type === 'color',
  transform: (token) => toOklch(String(token.$value)),
})
StyleDictionary.registerTransform({
  name: 'shadow/oklch',
  type: 'value',
  filter: (token) => token.$type === 'shadow',
  transform: (token) => {
    const layer = (l: ShadowLayer) => ({ ...l, color: toOklch(l.color) })
    const value = token.$value as ShadowLayer | ShadowLayer[]
    return Array.isArray(value) ? value.map(layer) : layer(value)
  },
})
const cssTransforms = StyleDictionary.hooks.transformGroups.css!.flatMap((name) =>
  name === 'color/css' ? ['color/oklch'] : name === 'shadow/css/shorthand' ? ['shadow/oklch', name] : [name],
)

const PREFIX = 'ds'
const DIST = 'dist/'
const BRAND = 'src/brand/waldow.json'
const shared = [BRAND, 'src/primitive/**/*.json', 'src/semantic/base.json']

// The brand's seed colours become color.primary.*, color.secondary.* and color.highlight.*.
const seeds = JSON.parse(readFileSync(BRAND, 'utf8')).theme.color as Record<string, { $value: string }>
const palette = {
  color: Object.fromEntries(
    ['primary', 'secondary', 'highlight'].map((role) => [
      role,
      Object.fromEntries(Object.entries(scale(seeds[role]!.$value)).map(([step, hex]) => [step, { $type: 'color', $value: hex }])),
    ]),
  ),
}

const light = new StyleDictionary({
  tokens: palette,
  source: [...shared, 'src/semantic/light.json'],
  log: { verbosity: 'silent' },
  platforms: {
    css: {
      transforms: cssTransforms,
      prefix: PREFIX,
      buildPath: DIST,
      files: [{ destination: 'light.css', format: 'css/variables', options: { outputReferences: true, selector: ':root, [data-brand]' } }],
    },
    js: {
      transformGroup: 'js',
      buildPath: DIST,
      files: [
        { destination: 'tokens.js', format: 'javascript/es6' },
        { destination: 'tokens.d.ts', format: 'typescript/es6-declarations' },
        { destination: 'tokens.json', format: 'json/nested' },
      ],
    },
  },
})

// Dark only re-declares the semantic colour and elevation tokens. Everything else is
// mode-independent, or references these variables, so it follows the theme without being re-emitted.
const isDark = (token: TransformedToken) => token.filePath?.endsWith('semantic/dark.json') ?? false

const dark = new StyleDictionary({
  tokens: palette,
  source: [...shared, 'src/semantic/dark.json'],
  log: { verbosity: 'silent' },
  platforms: {
    css: {
      transforms: cssTransforms,
      prefix: PREFIX,
      buildPath: DIST,
      files: [
        {
          destination: 'dark-attr.css',
          format: 'css/variables',
          filter: isDark,
          options: { outputReferences: true, selector: '[data-theme="dark"], [data-theme="dark"] [data-brand]' },
        },
        {
          destination: 'dark-media.css',
          format: 'css/variables',
          filter: isDark,
          options: {
            outputReferences: true,
            selector: ['@media (prefers-color-scheme: dark)', ':root:not([data-theme="light"]), :root:not([data-theme="light"]) [data-brand]'],
          },
        },
      ],
    },
  },
})

await rm(DIST, { recursive: true, force: true })
await light.buildAllPlatforms()
await dark.buildAllPlatforms()

const parts = await Promise.all(['light.css', 'dark-attr.css', 'dark-media.css'].map((f) => readFile(DIST + f, 'utf8')))
const colorScheme = [
  ':root { color-scheme: light; }',
  '[data-theme="dark"] { color-scheme: dark; }',
  '@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { color-scheme: dark; } }',
].join('\n')
await writeFile(DIST + 'tokens.css', [...parts, colorScheme].join('\n') + '\n')
await Promise.all(['light.css', 'dark-attr.css', 'dark-media.css'].map((f) => rm(DIST + f)))

// --- Contrast gate ---------------------------------------------------------

/** Foreground/background pairs that must meet WCAG AA (4.5:1 for text, 3:1 for UI). */
const pairs: Array<[fg: string, bg: string, min: number]> = [
  ['color.text.default', 'color.background.default', 4.5],
  ['color.text.default', 'color.surface.default', 4.5],
  ['color.text.muted', 'color.background.default', 4.5],
  ['color.text.muted', 'color.surface.default', 4.5],
  ['color.text.link', 'color.background.default', 4.5],
  ['color.text.inverse', 'color.background.inverse', 4.5],
  ['color.action.primary.text', 'color.action.primary.default', 4.5],
  ['color.action.primary.text', 'color.action.primary.hover', 4.5],
  ['color.action.secondary.text', 'color.action.secondary.default', 4.5],
  ['color.action.secondary.text', 'color.action.secondary.hover', 4.5],
  ['color.emphasis.highlight.on-solid', 'color.emphasis.highlight.solid', 4.5],
  ['color.emphasis.highlight.text', 'color.emphasis.highlight.background', 4.5],
  ['color.action.danger.text', 'color.action.danger.default', 4.5],
  ['color.status.success.text', 'color.status.success.background', 4.5],
  ['color.status.warning.text', 'color.status.warning.background', 4.5],
  ['color.status.danger.text', 'color.status.danger.background', 4.5],
  ['color.status.info.text', 'color.status.info.background', 4.5],
  ['color.border.focus', 'color.background.default', 3],
  ['color.border.strong', 'color.background.default', 3],
]

const contrast = (a: string, b: string) => wcagContrast(a, b)

const failures: string[] = []
for (const [name, sd] of [['light', light], ['dark', dark]] as const) {
  const { allTokens } = await sd.getPlatformTokens('css')
  const byPath = new Map(allTokens.map((t) => [t.path.join('.'), String(t.$value ?? t.value)]))
  for (const [fg, bg, min] of pairs) {
    const ratio = contrast(byPath.get(fg)!, byPath.get(bg)!)
    if (ratio < min) failures.push(`${name}: ${fg} on ${bg} is ${ratio.toFixed(2)}:1 (needs ${min}:1)`)
  }
}

if (failures.length) {
  console.error('Token contrast check failed:\n  ' + failures.join('\n  '))
  process.exit(1)
}
console.log(`Built tokens to ${DIST} (${pairs.length * 2} contrast pairs pass AA)`)
