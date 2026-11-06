import tokens from '@waldow-ds/tokens/tokens.json'
import { ColorItem, ColorPalette } from '@storybook/addon-docs/blocks'

type TokenTree = { [key: string]: string | number | TokenTree }

/** Flatten a nested token group into [path, value] pairs. */
function flatten(tree: TokenTree, prefix: string[] = []): Array<[string[], string | number]> {
  return Object.entries(tree).flatMap(([key, value]) =>
    typeof value === 'object' ? flatten(value, [...prefix, key]) : [[[...prefix, key], value] as [string[], string | number]],
  )
}

const cssVar = (path: string[]) => `var(--ds-${path.join('-')})`

const semanticColorGroups = ['background', 'surface', 'text', 'border', 'action', 'status'] as const

/**
 * Semantic colour swatches. Swatches use the live CSS variables, so the theme
 * toolbar switches them between light and dark.
 */
export function SemanticColors() {
  const color = tokens.color as unknown as TokenTree
  return (
    <ColorPalette>
      {semanticColorGroups.flatMap((group) => {
        const groupTree = color[group] as TokenTree
        // Split action and status into one row per intent so rows stay readable.
        const rows: Array<[string[], TokenTree]> =
          group === 'action' || group === 'status'
            ? Object.entries(groupTree).map(([intent, sub]) => [['color', group, intent], sub as TokenTree])
            : [[['color', group], groupTree]]
        return rows.map(([path, sub]) => (
          <ColorItem
            key={path.join('.')}
            title={path.slice(1).join('.')}
            subtitle={`--ds-${path.join('-')}-*`}
            colors={Object.fromEntries(flatten(sub).map(([p]) => [p.join('.'), cssVar([...path, ...p])]))}
          />
        ))
      })}
    </ColorPalette>
  )
}

const hues = ['neutral', 'brand', 'green', 'amber', 'red', 'blue'] as const

/** Primitive palette. For reference only: components never use these directly. */
export function PrimitiveColors() {
  const color = tokens.color as unknown as TokenTree
  return (
    <ColorPalette>
      {hues.map((hue) => (
        <ColorItem
          key={hue}
          title={hue}
          subtitle={`--ds-color-${hue}-*`}
          colors={Object.fromEntries(Object.entries(color[hue] as TokenTree).map(([step, value]) => [step, String(value)]))}
        />
      ))}
    </ColorPalette>
  )
}

type ScaleProps = { group: 'space' | 'radius' | 'elevation' }

/** A table of a dimension or elevation scale, each with a live preview. */
export function Scale({ group }: ScaleProps) {
  const entries = flatten(tokens[group] as unknown as TokenTree)
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left">
          <th className="py-2">Token</th>
          <th className="py-2">Value</th>
          <th className="py-2">Preview</th>
        </tr>
      </thead>
      <tbody>
        {entries.map(([path, value]) => {
          const name = cssVar([group, ...path])
          return (
            <tr key={path.join('.')} className="border-b">
              <td className="py-2 font-mono">{`--ds-${group}-${path.join('-')}`}</td>
              <td className="py-2 font-mono text-muted-foreground">{String(value)}</td>
              <td className="py-2">
                {group === 'space' && <div className="h-3 bg-primary" style={{ width: name }} />}
                {group === 'radius' && <div className="size-10 border-2 border-primary bg-background-muted" style={{ borderRadius: name }} />}
                {group === 'elevation' && <div className="size-10 rounded-control bg-surface" style={{ boxShadow: name }} />}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
