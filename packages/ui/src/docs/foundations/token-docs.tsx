import tokens from '@waldow-design/tokens/tokens.json'
import { ColorItem, ColorPalette } from '@storybook/addon-docs/blocks'
import styles from '../../styles.css?raw'

type TokenValue = string | number | TokenValue[] | { [key: string]: TokenValue }
type TokenTree = { [key: string]: TokenValue }

/** Flatten a nested token group into [path, value] pairs. */
function flatten(tree: TokenTree, prefix: string[] = []): Array<[string[], TokenValue]> {
  return Object.entries(tree).flatMap(([key, value]) =>
    typeof value === 'object' && !Array.isArray(value)
      ? flatten(value, [...prefix, key])
      : [[[...prefix, key], value] as [string[], TokenValue]],
  )
}

const dsName = (path: string[]) => `--ds-${path.join('-')}`
const cssVar = (path: string[]) => `var(${dsName(path)})`

/** Tailwind theme namespaces in styles.css and the utility prefix each one produces. */
const utilityPrefix: Record<string, string> = { text: 'text', radius: 'rounded', shadow: 'shadow' }

/** `--ds-*` variable → Tailwind utility, read from the `@theme` block in styles.css. */
const utilities = new Map(
  [...styles.matchAll(/--(text|radius|shadow)-([\w-]+):\s*var\((--ds-[\w-]+)\)/g)].map((match) => {
    const [, ns, key, ds] = match as unknown as [string, string, string, string]
    return [ds, `${utilityPrefix[ns]}-${key}`]
  }),
)

const color = tokens.color as unknown as TokenTree

/** Primitive hues are groups of numbered steps (`neutral.50` … `neutral.950`). */
const isHue = (group: TokenValue) =>
  typeof group === 'object' && !Array.isArray(group) && Object.keys(group).every((step) => /^\d+$/.test(step))

const colorGroups = Object.entries(color).filter(([, group]) => typeof group === 'object')
const hues = colorGroups.filter(([, group]) => isHue(group)).map(([key]) => key)
const semanticColorGroups = colorGroups.filter(([, group]) => !isHue(group)).map(([key]) => key)

/**
 * Semantic colour swatches. Swatches use the live CSS variables, so the theme
 * toolbar switches them between light and dark.
 */
export function SemanticColors() {
  return (
    <ColorPalette>
      {semanticColorGroups.flatMap((group) => {
        const groupTree = color[group] as TokenTree
        // Split groups of intents (action, emphasis, status) into one row per intent so rows stay readable.
        const byIntent = Object.values(groupTree).every((sub) => typeof sub === 'object')
        const rows: Array<[string[], TokenTree]> = byIntent
          ? Object.entries(groupTree).map(([intent, sub]) => [['color', group, intent], sub as TokenTree])
          : [[['color', group], groupTree]]
        return rows.map(([path, sub]) => (
          <ColorItem
            key={path.join('.')}
            title={path.slice(1).join('.')}
            subtitle={`${dsName(path)}-*`}
            colors={Object.fromEntries(flatten(sub).map(([p]) => [p.join('.'), cssVar([...path, ...p])]))}
          />
        ))
      })}
    </ColorPalette>
  )
}

/** Primitive palette. For reference only: components never use these directly. */
export function PrimitiveColors() {
  return (
    <ColorPalette>
      {hues.map((hue) => (
        <ColorItem
          key={hue}
          title={hue}
          subtitle={`${dsName(['color', hue])}-*`}
          colors={Object.fromEntries(Object.entries(color[hue] as TokenTree).map(([step, value]) => [step, String(value)]))}
        />
      ))}
    </ColorPalette>
  )
}

type Shadow = { offsetX: string; offsetY: string; blur: string; spread: string; color: string }

/** Render a shadow token (one layer or several) as a CSS box-shadow value. */
const formatShadow = (value: TokenValue) =>
  ([] as Shadow[])
    .concat(value as unknown as Shadow | Shadow[])
    .map((s) => `${s.offsetX} ${s.offsetY} ${s.blur} ${s.spread} ${s.color}`)
    .join(', ')

type ScaleProps = { group: 'space' | 'radius' | 'elevation' }

/** A table of a dimension or elevation scale, each with its utility and a live preview. */
export function Scale({ group }: ScaleProps) {
  const tree = tokens[group] as unknown as TokenTree
  // Elevation values are composite shadows: one row per top-level token, not per shadow field.
  const entries: Array<[string[], string]> =
    group === 'elevation'
      ? Object.entries(tree).map(([key, value]) => [[key], formatShadow(value)])
      : flatten(tree).map(([path, value]) => [path, String(value)])
  return (
    // Elevation rows aren't striped (see storybook.css): shadows read best on the plain page.
    <table className="w-full text-sm" data-striped={group === 'elevation' ? 'false' : undefined}>
      <thead>
        <tr className="border-b text-left">
          <th className="py-2">Token</th>
          {group !== 'space' && <th className="py-2">Utility</th>}
          <th className="py-2">Value</th>
          <th className="py-2">Preview</th>
        </tr>
      </thead>
      <tbody>
        {entries.map(([path, value]) => {
          const name = dsName([group, ...path])
          return (
            <tr key={path.join('.')} className="border-b">
              <td className="py-2 font-mono">{name}</td>
              {group !== 'space' && <td className="py-2 font-mono">{utilities.get(name) ?? '–'}</td>}
              <td className="py-2 font-mono text-muted-foreground">
                {value}
                {group === 'elevation' && <span className="block font-sans text-xs">Light mode value; dark mode uses stronger shadows.</span>}
              </td>
              <td className="py-2">
                {group === 'space' && <div className="h-3 bg-primary" style={{ width: `var(${name})` }} />}
                {group === 'radius' && (
                  <div className="size-10 border-2 border-primary bg-background-muted" style={{ borderRadius: `var(${name})` }} />
                )}
                {group === 'elevation' && (
                  // A raised surface straight on the page, the way elevation is actually seen. The
                  // padding leaves room for the shadow to spread.
                  <div className="inline-flex py-4">
                    <div className="h-12 w-20 rounded-surface bg-surface-raised" style={{ boxShadow: `var(${name})` }} />
                  </div>
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

type FontSizesProps = {
  /** What each size is for, keyed by token name. Sizes without an entry use `fallback`. */
  uses: Record<string, string>
  fallback: string
}

/** The font-size scale with the Tailwind `text-*` utility each token backs. */
export function FontSizes({ uses, fallback }: FontSizesProps) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left">
          <th className="py-2">Utility</th>
          <th className="py-2">Token</th>
          <th className="py-2">Value</th>
          <th className="py-2">Use for</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(tokens['font-size']).map(([size, value]) => (
          <tr key={size} className="border-b">
            <td className="py-2 font-mono">{utilities.get(dsName(['font-size', size])) ?? '–'}</td>
            <td className="py-2 font-mono">{`font-size.${size}`}</td>
            <td className="py-2 font-mono text-muted-foreground">{value}</td>
            <td className="py-2">{uses[size] ?? fallback}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
