#!/usr/bin/env node
/** Scaffold explorations/<slug>/<slug>.stories.tsx with three variant stubs. */
import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'

const name = process.argv.slice(2).join(' ').trim()
if (!name) {
  console.error('Usage: pnpm explore "<what you are exploring>"')
  process.exit(1)
}

const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const title = name.charAt(0).toUpperCase() + name.slice(1)
const dir = `explorations/${slug}`
const file = `${dir}/${slug}.stories.tsx`

if (existsSync(file)) {
  console.error(`${file} already exists`)
  process.exit(1)
}

const variant = (letter, label) => `
/** ${letter}: what this variant is betting on. */
export const ${letter}: Story = {
  name: '${letter}: ${label}',
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>${title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap={4}>
          <Button>Primary action</Button>
        </Stack>
      </CardContent>
    </Card>
  ),
}
`

await mkdir(dir, { recursive: true })
await writeFile(
  file,
  `/**
 * Exploration: ${name}.
 * Throwaway: compare in Chromatic, pick one, then build it properly.
 */
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, Card, CardContent, CardHeader, CardTitle, Stack } from '@waldow-design/ui'

const meta = {
  title: 'Explorations/${title}',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>
${variant('A', 'first direction')}${variant('B', 'second direction')}${variant('C', 'third direction')}`,
)
console.log(`Created ${file}`)
