#!/usr/bin/env node
/**
 * Tokens-only guard. Fails if component or app source uses raw design values
 * instead of tokens. See ADR 001 and packages/tokens/README.md.
 *
 * Flags, in .ts/.tsx/.mdx under the checked roots (stories included, so explorations
 * are held to the same rules):
 *   - hex / rgb() / hsl() / oklch() colours
 *   - Tailwind arbitrary values with raw content, e.g. p-[13px], bg-[#fff]
 *     (CSS-variable shorthand like max-h-(--radix-…) is allowed)
 *   - Tailwind default palette classes, e.g. bg-blue-500
 *   - direct use of primitive token variables, e.g. var(--ds-color-brand-600)
 *
 * Opt a line out with a trailing `// tokens-ok: <reason>` comment.
 */
import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

const roots = ['packages/ui/src', 'apps/web/src', 'explorations']
const exts = /\.(tsx?|mdx)$/
const skip = /(\.test\.|node_modules|dist)/

const palette = 'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose'
const rules = [
  { name: 'raw colour', re: /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab)\(/ },
  { name: 'arbitrary value', re: /(?<![\w&\]-])(?!(?:data|aria|group|peer|has|supports|in|not|nth)-)[a-z][\w-]*-\[(?!--)[^\]\s]+\](?!:)/ },
  { name: 'default palette', re: new RegExp(`\\b(?:bg|text|border|ring|outline|fill|stroke|from|to|via|decoration|shadow|accent|caret)-(?:${palette})-\\d{2,3}\\b`) },
  { name: 'primitive token', re: /--ds-color-(?:neutral|brand|green|amber|red|blue|white|black)\b/ },
]

async function* walk(dir) {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return
  }
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (skip.test(path)) continue
    if (entry.isDirectory()) yield* walk(path)
    else if (exts.test(entry.name)) yield path
  }
}

const problems = []
for (const root of roots) {
  for await (const file of walk(root)) {
    const lines = (await readFile(file, 'utf8')).split('\n')
    lines.forEach((line, i) => {
      if (line.includes('tokens-ok:')) return
      for (const { name, re } of rules) {
        const match = line.match(re)
        if (match) problems.push(`${relative('.', file)}:${i + 1}  ${name}: ${match[0]}`)
      }
    })
  }
}

if (problems.length) {
  console.error(`Tokens-only check failed (${problems.length}):\n  ${problems.join('\n  ')}`)
  process.exit(1)
}
console.log('Tokens-only check passed')
