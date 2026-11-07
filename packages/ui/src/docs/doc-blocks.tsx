import type { ReactNode } from 'react'
import { AnchorMdx, Canvas } from '@storybook/addon-docs/blocks'
import type { Meta } from '@storybook/react-vite'
import { toId } from 'storybook/internal/csf'

/**
 * Link to another docs page by its title (`'Principles/Overview'`), so a renamed
 * page fails visibly rather than leaving a stale hand-written `?path=` slug.
 * AnchorMdx navigates the Storybook manager instead of reloading the iframe.
 */
export function DocsLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <AnchorMdx href={`?path=/docs/${toId(to, 'docs')}`} target="_self">
      {children}
    </AnchorMdx>
  )
}

type PrincipleStories = { DoExample: unknown; DontExample: unknown }

/** The do and don't canvases every principle page ends with. */
export function PrincipleExamples({ of }: { of: PrincipleStories }) {
  return (
    <>
      <Canvas of={of.DoExample} sourceState="hidden" />
      <Canvas of={of.DontExample} sourceState="hidden" />
    </>
  )
}

/** Principle stories keep their one-line summary in `parameters.summary`. */
type PrincipleMeta = Meta & { title: string; parameters: { summary: string } }

const principles = Object.values(
  import.meta.glob<PrincipleMeta>('./principles/*.stories.tsx', { eager: true, import: 'default' }),
)

/** Render `code` spans in a plain-text summary. */
const withCode = (text: string) =>
  text.split('`').map((part, i) => (i % 2 ? <code key={i}>{part}</code> : part))

/** Every principle with its summary, built from the principle stories. */
export function PrincipleIndex() {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left">
          <th className="py-2">Principle</th>
          <th className="py-2">In one line</th>
        </tr>
      </thead>
      <tbody>
        {principles.map(({ title, parameters }) => (
          <tr key={title} className="border-b">
            <td className="py-2">
              <DocsLink to={title}>{title.split('/').at(-1)}</DocsLink>
            </td>
            <td className="py-2">{withCode(parameters.summary)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
