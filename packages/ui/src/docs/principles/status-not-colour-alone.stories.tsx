import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../../components/badge'
import { Stack } from '../../components/stack'
import { Do, Dont } from '../do-dont'

const meta = { title: 'Principles/Status never relies on colour alone', tags: ['!autodocs'] } satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const builds = [
  { name: 'web', status: 'Passed', variant: 'success' },
  { name: 'api', status: 'Failed', variant: 'danger' },
  { name: 'docs', status: 'Running', variant: 'info' },
] as const

export const DoExample: Story = {
  name: 'Do',
  render: () => (
    <Do caption="The word carries the meaning; colour reinforces it.">
      <Stack gap={2}>
        {builds.map((b) => (
          <Stack key={b.name} direction="horizontal" justify="between" align="center">
            <span className="text-sm font-medium">{b.name}</span>
            <Badge variant={b.variant}>{b.status}</Badge>
          </Stack>
        ))}
      </Stack>
    </Do>
  ),
}

const dot = { success: 'bg-success-text', danger: 'bg-danger-text', info: 'bg-info-text' } as const

export const DontExample: Story = {
  name: "Don't",
  render: () => (
    <Dont caption="Coloured dots alone are invisible to colour-blind users and screen readers.">
      <Stack gap={2}>
        {builds.map((b) => (
          <Stack key={b.name} direction="horizontal" justify="between" align="center">
            <span className="text-sm font-medium">{b.name}</span>
            <span className={`size-2.5 rounded-pill ${dot[b.variant]}`} />
          </Stack>
        ))}
      </Stack>
    </Dont>
  ),
}
