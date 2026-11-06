import axe from 'axe-core'

/**
 * Run axe on a container and return a readable list of violations.
 * Colour contrast is skipped because jsdom doesn't compute styles; contrast is
 * covered by the token build's contrast gate and the Storybook a11y panel.
 * `region` (content inside landmarks) is a page-level rule that doesn't apply to
 * components rendered in isolation; Storybook's a11y addon disables it too.
 */
export async function axeViolations(container: Element) {
  const results = await axe.run(container, {
    rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
  })
  return results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).join(', ')})`)
}
