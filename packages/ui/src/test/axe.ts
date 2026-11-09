import axe, { type RuleObject } from 'axe-core'
import preview from '../../.storybook/preview'

/** Rules disabled in Storybook's a11y parameters (`.storybook/preview.tsx`), the one source of truth. */
const storybookRules: RuleObject = Object.fromEntries(
  (preview.parameters?.a11y?.config?.rules ?? []).map((rule: { id: string; enabled?: boolean }) => [
    rule.id,
    { enabled: rule.enabled ?? true },
  ]),
)

/**
 * Run axe on a container and return a readable list of violations.
 * Uses the same rule overrides as Storybook, plus one jsdom-only exception:
 * colour contrast is skipped because jsdom doesn't compute styles. Contrast is
 * covered by the token build's contrast gate and the Storybook a11y panel.
 */
export async function axeViolations(container: Element) {
  const results = await axe.run(container, {
    rules: { ...storybookRules, 'color-contrast': { enabled: false } },
  })
  return results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).join(', ')})`)
}
