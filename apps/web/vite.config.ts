import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { prePaintScript } from './src/pre-paint.ts'

/** Inline the pre-paint mode script into <head>, from its one source in src/pre-paint.ts. */
const prePaint: Plugin = {
  name: 'waldow-design:pre-paint-mode',
  transformIndexHtml: () => [{ tag: 'script', children: prePaintScript, injectTo: 'head' }],
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), prePaint],
})
