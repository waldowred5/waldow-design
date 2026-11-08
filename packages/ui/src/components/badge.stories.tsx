import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge, badgeVariantOptions } from './badge'

const labels: Record<string, string> = {
  neutral: 'Draft',
  primary: 'New',
  secondary: 'Shared',
  highlight: 'Featured',
  success: 'Active',
  warning: 'Pending',
  danger: 'Failed',
  info: 'Beta',
}

type Variant = NonNullable<Parameters<typeof Badge>[0]['variant']>

const meta = {
  title: 'Components/Badge',
  component: Badge,
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

/** Every `variant`, by name. The text always states the status, so colour is never the only signal. */
export const Variants: Story = {
  render: () => (
    <dl className="grid grid-cols-2 items-center gap-x-10 gap-y-3">
      {badgeVariantOptions.variant.map((variant) => (
        <div key={variant} className="contents">
          <dt className="font-mono text-sm text-muted-foreground">{variant}</dt>
          <dd>
            <Badge variant={variant as Variant}>{labels[variant] ?? variant}</Badge>
          </dd>
        </div>
      ))}
    </dl>
  ),
}
