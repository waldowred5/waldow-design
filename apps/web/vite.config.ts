import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { prePaintScript } from './src/pre-paint.ts'

/** Inline the pre-paint mode script into <head>, from its one source in src/pre-paint.ts. */
const prePaint: Plugin = {
  name: 'waldow-design:pre-paint-mode',
  transformIndexHtml: () => [{ tag: 'script', children: prePaintScript, injectTo: 'head' }],
}

// The entry holds React, the router and the mode store; each layout (landing, docs) is a lazy
// chunk. What both layouts share gets named chunks, cached across them and budgeted in
// .size-limit.json: `design-system` (@waldow-design/ui and its dependencies) and `site-shared`
// (the app's own shared modules). React stays in the entry, and culori stays with the knobs.
const inEntryOrOwnChunk = /[\\/]node_modules[\\/](react|react-dom|scheduler|culori)[\\/]/
const isDesignSystem = (id: string) =>
  /packages[\\/](ui[\\/]src|tokens[\\/]dist[\\/]utilities)/.test(id) || (id.includes('node_modules') && !inEntryOrOwnChunk.test(id))

export default defineConfig({
  plugins: [react(), tailwindcss(), prePaint],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          // Without this, a group also pulls in what its modules import, React included.
          includeDependenciesRecursively: false,
          groups: [
            { name: 'design-system', test: isDesignSystem },
            { name: 'site-shared', test: /apps[\\/]web[\\/]src|size-limit/, minShareCount: 2 },
          ],
        },
      },
    },
  },
})
